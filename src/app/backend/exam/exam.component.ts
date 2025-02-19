import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { exam } from 'src/app/models/exam';
import { ExamService } from 'src/app/Services/exam_service';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent {
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
        this.router.navigate(['/backoffice/Exam/editexama', idExam]);
      } else {
        console.error('ID examen invalide:', idExam);
      }
    }
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  isTeacherMenuOpen = false;

toggleTeacherMenu() {
    this.isTeacherMenuOpen = !this.isTeacherMenuOpen;
}
}
