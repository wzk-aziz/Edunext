import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Question } from 'src/app/models/Question';
import { ExamService } from 'src/app/Services/exam_service';

@Component({
  selector: 'app-examstudentsubmit',
  templateUrl: './examstudentsubmit.component.html',
  styleUrls: ['./examstudentsubmit.component.css']
})
export class ExamstudentsubmitComponent {
  exam: any;
  answers: { [key: number]: string } = {}; 

  constructor(private route: ActivatedRoute, private examService: ExamService) {}

  ngOnInit() {
    const examId = Number(this.route.snapshot.paramMap.get('id'));
    this.examService.getExamById(examId).subscribe(data => {
      this.exam = data;
      // Transformation des options de réponses en tableau si c'est une chaîne
      this.exam.questions.forEach((question: Question) => {
        if (typeof question.answerOptions === 'string') {
          question.answerOptions = question.answerOptions.split(' | '); // Sépare les options en un tableau
        }
      });
    });
  }

  selectAnswer(questionId: number, answer: string) {
    this.answers[questionId] = answer;  // Enregistre la réponse de l'utilisateur
    console.log(`Réponse enregistrée pour la question ${questionId}: ${answer}`);
  }
  

  submitExam() {
    console.log("Réponses envoyées :", this.answers);
    this.examService.submitExam(this.exam.idExam, this.answers).subscribe(score => {
      console.log(`Total Marks: ${this.exam.totalMarks}`); // Ajoutez cette ligne pour vérifier
      alert(`Votre score: ${score} / ${this.exam.totalMarks}`);
    });
  }
  
  
  
  
  
  
  
  
}
