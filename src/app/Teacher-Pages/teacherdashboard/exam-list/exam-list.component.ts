import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExamService } from 'src/app/Services/exam_service';
import { exam } from 'src/app/models/exam';

@Component({
  selector: 'app-exam-list',
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.css']
})
export class ExamListComponent implements OnInit {
  exams: exam[] = [];
  searchTerm: string = '';  // Variable pour le terme de recherche
  currentPage = 1; // Default page number
  itemsPerPage = 5;

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
    this.loadExams();  // Charger tous les examens au début
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

  // Méthode pour supprimer un examen
  deleteExam(idExam: number): void {
    this.examService.deleteExam(idExam).subscribe(() => {
      this.loadExams();  // Recharger la liste des examens après suppression
    }, error => {
      console.error('Erreur lors de la suppression de l\'examen', error);
    });
  }

  // Méthode pour éditer un examen
  editExam(idExam: number | undefined): void {
    if (idExam !== undefined && idExam > 0) {
      this.router.navigate(['/editaxam', idExam]);
    } else {
      console.error('ID examen invalide:', idExam);
    }
  }
}
