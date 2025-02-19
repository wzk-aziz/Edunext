import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { exam } from 'src/app/models/exam';
import { ExamService } from 'src/app/Services/exam_service';

@Component({
  selector: 'app-exam-list',
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.css']
})
export class ExamListComponent implements OnInit{
  exams: exam[] = [];
 

  constructor(private examService: ExamService,private router :Router) {}

  ngOnInit(): void {
    this.loadExams();
  }

  loadExams(): void {
    this.examService.getAllExams().subscribe((data) => {
      this.exams = data;
    });
  }

  deleteExam(idExam: number): void {
    this.examService.deleteExam(idExam).subscribe(() => {
      this.loadExams();  // Recharger la liste des examens après suppression
    }, error => {
      console.error('Erreur lors de la suppression de l\'examen', error);
    });
  }
 
  editExam(idExam: number | undefined) {
    if (idExam !== undefined && idExam > 0) {
      this.router.navigate(['/editaxam', idExam]);
    } else {
      console.error('ID examen invalide:', idExam);
    }
  }
}
