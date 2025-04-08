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

  searchTerm: string = '';  // Variable pour le terme de recherche
  currentPage = 1; // Default page number
  itemsPerPage = 5;

  isCertificatMenuOpen = false;

  isExamMenuOpen=false;

  toggleExamMenu() {
    this.isExamMenuOpen = !this.isExamMenuOpen;
  }
  toggleCertificatMenu() {
    this.isCertificatMenuOpen = !this.isCertificatMenuOpen;
  }
  // Getter to calculate the exams for the current page
  get paginatedExams() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.exams.slice(start, start + this.itemsPerPage);
  }

  // Getter to calculate the total number of pages
  get totalPages() {
    return Math.ceil(this.exams.length / this.itemsPerPage);
  }

  // Method to handle page changes
  onPageChange(page: number): void {
    if (page < 1) {
      page = 1;  // Prevent going below page 1
    } else if (page > this.totalPages) {
      page = this.totalPages;  // Prevent going above the last page
    }
    this.currentPage = page;
  }
  constructor(private examService: ExamService, private router: Router) {}

  ngOnInit(): void {
    this.loadExams();
  }

  
  // Méthode pour charger tous les examens ou effectuer la recherche
  loadExams(): void {
    if (this.searchTerm.trim() === '') {
      // Si le champ de recherche est vide, on charge tous les examens
      this.examService.getAllExams().subscribe((data) => {
        this.exams = data;
      });
    } else {
      // Sinon, on filtre les examens selon le titre
      this.examService.searchExams(this.searchTerm).subscribe((data) => {
        this.exams = data;
      });
    }
  }

  // Méthode appelée à chaque modification du champ de recherche
  onSearchChange(): void {
    this.loadExams();  // Recharger la liste avec le terme de recherche
  }

  deleteExam(idExam: number): void {
    this.examService.deleteExam(idExam).subscribe(() => {
      this.loadExams();  // Reload the list after deletion
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

  // Filter function to apply search term
  filteredExams() {
    return this.exams.filter(exam => {
      return exam.examTitle!.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
             exam.examDescription!.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
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
