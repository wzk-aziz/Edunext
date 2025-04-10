import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from 'src/app/backend/courses/Services/question.service';
import { QuizService } from 'src/app/backend/courses/Services/quiz.service';
import { Question } from 'src/app/model/question.model';
import { Quiz } from 'src/app/model/quiz.model';

@Component({
  selector: 'app-take-quiz',
  templateUrl: './take-quiz.component.html',
  styleUrls: ['./take-quiz.component.css']
})
export class TakeQuizComponent {
   // Existing properties
   quizId!: number;
   questions: Question[] = [];
   quizForm: FormGroup;
   loading = true;
   errorMessage: string | null = null;
   timeLeft!: number;
   interval: any;
   quizTimeLimit!: number;
 
   // Anti-cheating
   warningCount: number = 0;
   cheatingTriggered: boolean = false;
   showCheatingPopup: boolean = false;
   disqualified: boolean = false;
   constructor(
     private route: ActivatedRoute,
     private questionService: QuestionService,
     private quizService: QuizService,
     private fb: FormBuilder,
     private router: Router
   ) {
     this.quizForm = this.fb.group({
       answers: this.fb.array([]) 
     });
   }
 
   ngOnInit(): void {
     this.quizId = Number(this.route.snapshot.paramMap.get('quizId'));
     this.loadQuiz();
     this.attachSecurityListeners();
   }
 
   ngOnDestroy(): void {
     if (this.interval) clearInterval(this.interval);
     window.removeEventListener('beforeunload', this.onBeforeUnload);
   }
 
   loadQuiz(): void {
     this.quizService.getQuizById(this.quizId).subscribe({
       next: (quiz: Quiz) => {
         this.quizTimeLimit = quiz.timeLimit;
         this.loadQuestions();
       },
       error: (err) => {
         this.errorMessage = 'Error loading quiz';
         this.loading = false;
       }
     });
   }
 
   loadQuestions(): void {
     this.questionService.getQuestionsByQuizId(this.quizId).subscribe({
       next: (questions) => {
         this.questions = questions;
         this.populateForm();
         this.startTimer();
         this.loading = false;
       },
       error: (err) => {
         this.errorMessage = 'Error loading questions';
         this.loading = false;
       }
     });
   }
 
   populateForm(): void {
     const answerArray = this.quizForm.get('answers') as FormArray;
     this.questions.forEach(() => {
       answerArray.push(this.fb.control(''));
     });
   }
 
   startTimer(): void {
     this.timeLeft = this.quizTimeLimit * 60;
     this.interval = setInterval(() => {
       if (this.timeLeft > 0) {
         this.timeLeft--;
       } else {
         clearInterval(this.interval);
         this.submitQuiz();
       }
     }, 1000);
   }
 
   formatTimeLeft(timeLeft: number): string {
     const minutes = Math.floor(timeLeft / 60);
     const seconds = timeLeft % 60;
     return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
   }
 
   selectAnswer(questionIndex: number, selectedOption: string, questionType: string): void {
     const answersArray = this.quizForm.get('answers') as FormArray;
     if (questionType === 'SINGLE_CHOICE') {
       answersArray.controls[questionIndex].setValue([selectedOption]);
     } else {
       let selectedAnswers: string[] = answersArray.controls[questionIndex].value || [];
       if (!Array.isArray(selectedAnswers)) selectedAnswers = [];
       if (selectedAnswers.includes(selectedOption)) {
         selectedAnswers = selectedAnswers.filter((ans: string) => ans !== selectedOption);
       } else {
         selectedAnswers.push(selectedOption);
       }
       answersArray.controls[questionIndex].setValue(selectedAnswers);
     }
   }
 
   isSelected(questionIndex: number, option: string): boolean {
     const selectedAnswers: string[] = this.quizForm.get('answers')?.value[questionIndex] || [];
     return Array.isArray(selectedAnswers) ? selectedAnswers.includes(option) : selectedAnswers === option;
   }
 
   submitQuiz(): void {
     const studentAnswers = this.quizForm.value.answers.map((ans: string | string[]) => {
       return Array.isArray(ans) ? ans.map((a) => a.trim()) : (typeof ans === 'string' ? ans.trim() : '');
     });
     this.router.navigate(['/quiz-results', this.quizId], {
       queryParams: { answers: JSON.stringify(studentAnswers) }
     });
   }
 
   forceFailQuiz(): void {
    this.cheatingTriggered = true;
    this.disqualified = true;
  
    setTimeout(() => {
      this.submitQuiz(); // You can delay this if you want user to read the message
    }, 3000); // Wait 3 seconds before auto-submit
  }
 
   // ✅ Handle all cheating events
   handleCheating(reason: string): void {
     this.warningCount++;
     console.warn('🚨 Cheating attempt:', reason);
     if (this.warningCount >= 2 && !this.cheatingTriggered) {
       this.forceFailQuiz();
     } else {
       this.showCheatingPopup = true;
       setTimeout(() => (this.showCheatingPopup = false), 3000);
     }
   }
 
   // ✅ Attach browser-level listeners
   attachSecurityListeners(): void {
     window.addEventListener('beforeunload', this.onBeforeUnload.bind(this));
     document.addEventListener('visibilitychange', () => {
       if (document.hidden) this.handleCheating('Switched tabs or windows');
     });
     document.addEventListener('keydown', (e) => {
       if (
         e.key === 'F12' ||
         (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
         (e.ctrlKey && (e.key === 'c' || e.key === 'v'))
       ) {
         e.preventDefault();
         this.handleCheating('Keyboard shortcut detected');
       }
     });
     document.addEventListener('contextmenu', (e) => {
       e.preventDefault();
       this.handleCheating('Right-click detected');
     });
     document.addEventListener('copy', () => this.handleCheating('Copied content'));
     document.addEventListener('paste', () => this.handleCheating('Pasted content'));
   }
 
   onBeforeUnload(event: BeforeUnloadEvent) {
     event.preventDefault();
     event.returnValue = '';
     this.handleCheating('Page reload or navigation attempt');
   }
  
}
