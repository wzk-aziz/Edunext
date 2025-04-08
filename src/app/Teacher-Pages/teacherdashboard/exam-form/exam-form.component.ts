import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { exam } from 'src/app/models/exam';
import { Question } from 'src/app/models/Question';
import { ExamService } from 'src/app/Services/exam_service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-exam-form',
  templateUrl: './exam-form.component.html',
  styleUrls: ['./exam-form.component.css']
})
export class ExamFormComponent implements OnInit{
  exam: exam = {
    examTitle: '',
    examDescription: '',
    examDuration: 0,
    totalMarks:0,
    passingScore: 0,
    scheduledDate: new Date().toISOString(),
   questions: []
  };
  successMessage: string = '';  // Variable pour le message de succès
  errorMessage: string = ''; 
  constructor(private examService: ExamService,private router :Router, private snackbar: MatSnackBar) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.examService.createExam(this.exam).subscribe({
      next: () => {
        this.snackbar.open('Examen créé avec succès !', 'Fermer', { duration: 5000 });
        setTimeout(() => {
          this.router.navigate(['/examlist']);
        }, 2000);
      },
      error: () => {
        this.snackbar.open('Une erreur est survenue lors de la création de l\'examen.', 'Fermer', { duration: 5000 });
      }
    });
  }
  
  addQuestion() {
    this.exam.questions?.push({ questionText: '', answerOptions: '' });
  }
  
  
}
