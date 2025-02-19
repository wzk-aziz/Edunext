import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { exam } from 'src/app/models/exam';
import { Question } from 'src/app/models/Question';
import { ExamService } from 'src/app/Services/exam_service';

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

  constructor(private examService: ExamService,private router :Router) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.examService.createExam(this.exam).subscribe(() => {
      alert('Examen créé avec succès !');
      this.router.navigate(['/examlist']); 
    });
  }
  addQuestion() {
    this.exam.questions?.push({ questionText: '', answerOptions: '' });
  }
  
  
}
