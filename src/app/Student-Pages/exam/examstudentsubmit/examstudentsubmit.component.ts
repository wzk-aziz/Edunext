import { Component, Input, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Question } from 'src/app/models/Question';
import { AuthenticationServiceService } from 'src/app/Services/authentication-service.service';
import { ExamService } from 'src/app/Services/exam_service';

@Component({
  selector: 'app-examstudentsubmit',
  templateUrl: './examstudentsubmit.component.html',
  styleUrls: ['./examstudentsubmit.component.css']
})
export class ExamstudentsubmitComponent {
  exam: any;
  answers: { [key: number]: string } = {}; 
  score: number | null = null;  
  remainingTime: number = 0; // Temps restant en secondes
  timerInterval: any; // Stocke l'intervalle du timer
  totalExamTime: number = 0;
  hasSwitchedTab = false;
  isTimerStopped = false;
  warningMessages: string[] = [];
  isSubmitDisabled = false;
  userId!: number; // User ID dynamique
  examId!: number; // Exam ID dynamique
  errorMessage: string | null = null;
  isRefreshBlocked = false;  // Flag to show refresh warning message

  constructor(private route: ActivatedRoute, private examService: ExamService,private authService:AuthenticationServiceService, private router: Router ) {}

  ngOnInit() {
// Check if the user is attempting to retake the exam after cheating is detected
if (localStorage.getItem('examCheatingDetected')) {
  this.isSubmitDisabled = true;
}

    // Récupérer userId depuis le service d'auth
    this.userId = this.authService.getUserId() ?? 0;
    console.log("User ID:", this.userId);
  
    // Vérification de l'ID de l'examen dans l'URL
    this.route.paramMap.subscribe(params => {
      const examId = Number(params.get('id'));
      console.log("Exam ID from URL:", examId);  // Vérification dans la console
  
      if (examId) {
        this.examId = examId;
        
        this.examService.getExamById(examId).subscribe(data => {
          this.exam = data;
          if (this.exam) {
            // Mélanger les questions côté front-end
            this.exam.questions = this.shuffleArray(this.exam.questions);
            this.remainingTime = (this.exam.examDuration || 30) * 60; // Convertir les minutes en secondes
            this.totalExamTime = this.remainingTime;
            this.startTimer();
  
            // Transformation des options de réponses en tableau si c'est une chaîne
            this.exam.questions.forEach((question: Question) => {
              if (typeof question.answerOptions === 'string') {
                question.answerOptions = question.answerOptions.split(' | ');
              }
            });
          } else {
            alert("L'examen n'a pas pu être récupéré.");
          }
        });
      } else {
        alert("ID de l'examen invalide.");
      }
    });
  }
  
  shuffleArray(array: any[]): any[] {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }
  

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.remainingTime > 0 && !this.isTimerStopped) {
        this.remainingTime--; // Diminue le temps restant
      } else if (this.remainingTime <= 0) {
        this.submitExam(); // Soumet automatiquement l'examen à la fin du temps
      }
    }, 1000); // Mise à jour chaque seconde
  }

  stopTimer() {
    this.isTimerStopped = true;
  }

  getTimerColor(): string {
    const halfTime = (this.exam?.examDuration || 30) * 30; // Moitié du temps total
    if (this.remainingTime > halfTime) {
      return 'green'; // Plus de la moitié du temps restant
    } else if (this.remainingTime > 10) {
      return 'orange'; // Moins de la moitié du temps
    } else {
      return 'red'; // Dernières secondes
    }
  }
  
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${minutes}:${sec < 10 ? '0' : ''}${sec}`; // Format MM:SS
  }

  selectAnswer(questionId: number, answer: string) {
    if (!this.isSubmitDisabled) {
      this.answers[questionId] = answer;  // Enregistre la réponse de l'utilisateur
      console.log(`Réponse enregistrée pour la question ${questionId}: ${answer}`);
      console.log("Mise à jour de answers :", this.answers);
    }
  }
  
  addWarning(message: string) {
    // Ajoute un message d'avertissement s'il n'existe pas déjà
    if (!this.warningMessages.includes(message)) {
      this.warningMessages.push(message);
    }
    
    // Si la triche est détectée, on bloque le temps et la soumission
    this.stopTimer();
    this.isSubmitDisabled = true;
  }

  

 
  submitExam() {
    const examSubmission = {
      user: { id: this.userId },
      exam: { idExam: this.examId },
      userAnswers: { ...this.answers }
    };
  
    // Ne pas soumettre si désactivé
    if (this.isSubmitDisabled || this.score !== null) {
      return;
    }
  
    clearInterval(this.timerInterval);  // Arrêter le timer si l'examen est soumis
    console.log("Réponses envoyées :", this.answers);
  
    // Détecter la triche si l'utilisateur a changé d'onglet
    if (this.hasSwitchedTab) {
      this.addWarning("Suspicion de triche détectée ! Vous avez quitté l'examen.");
      return;  // Ne pas soumettre
    }
  
    this.isSubmitDisabled = true;  // Désactive le bouton de soumission après un premier clic
  
    // Soumettre l'examen
    this.examService.submitExam(examSubmission).subscribe({
      next: (score) => {
        this.score = score;  // Mettre à jour le score
        console.log("Score reçu :", this.score);
        
        // Vider le localStorage après la soumission réussie
        localStorage.removeItem('examAnswers');

        // Automatically navigate the user after score is displayed
        setTimeout(() => {
          this.router.navigate(['/examstudent']); // Adjust the route as needed
        }, 5000); // Wait 5 seconds to allow the user to see the score
      },
      error: (error) => {
        console.error("Erreur lors de la soumission :", error);
        this.errorMessage = error.error || "Une erreur s'est produite lors de la soumission de l'examen.";
      }
    });
  }
  
  
   // Prevent page refresh or tab close
   @HostListener('window:beforeunload', ['$event'])
   unloadNotification($event: any): void {
     if (localStorage.getItem('examSubmitted') !== 'true') {
      this.isRefreshBlocked = true; // Flag to show custom warning message
       $event.returnValue = true;  // Show confirmation dialog
     }
   }

  // Bloquer copier-coller
  @HostListener('document:copy', ['$event'])
  @HostListener('document:cut', ['$event'])
  @HostListener('document:paste', ['$event'])
  disableCopyPaste(event: ClipboardEvent) {
    event.preventDefault();
    this.addWarning("Copier-coller est désactivé ! Ceci est considéré comme une tentative de triche.");
  }

  // Bloquer les raccourcis clavier
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && ['c', 'v', 'x'].includes(event.key.toLowerCase())) {
      event.preventDefault();
      this.addWarning("Les raccourcis copier-coller sont désactivés ! Ceci est considéré comme une tentative de triche.");
    }
  }

  // Détecter le changement d'onglet
  @HostListener('window:blur', ['$event'])
  onBlur() {
    this.hasSwitchedTab = true;
    this.addWarning("Attention ! Vous avez quitté l'examen. Cela est considéré comme une triche.");
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval); // Arrête le timer si l'utilisateur quitte la page
  }
}