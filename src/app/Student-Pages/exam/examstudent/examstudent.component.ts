import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { exam } from 'src/app/models/exam';
import { ExamService } from 'src/app/Services/exam_service';

@Component({
  selector: 'app-examstudent',
  templateUrl: './examstudent.component.html',
  styleUrls: ['./examstudent.component.css']
})
export class ExamstudentComponent {
  exams: exam[] = [];
  selectedExamId?: number;
  searchTerm: string = '';  // Variable pour le terme de recherche
  currentPage = 1;
itemsPerPage = 5;
totalPages: number = 0;
paginatedExams: any[] = [];
constructor(private examService: ExamService, private router: Router) {}

ngOnInit(): void {
  this.loadExams(); // Charger les examens lors du démarrage
  this.updatePaginatedExams();
}
// Méthode pour changer la page
changePage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
    this.updatePaginatedExams();
  }
}
// Générer les numéros de pages dynamiquement
getPages(): number[] {
  this.totalPages = Math.ceil(this.exams.length / this.itemsPerPage);
  return Array.from({ length: this.totalPages }, (_, i) => i + 1);
}

// Mettre à jour la liste des examens affichés
updatePaginatedExams() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.paginatedExams = this.exams.slice(startIndex, endIndex);
}

//get paginatedExams() {
  //const start = (this.currentPage - 1) * this.itemsPerPage;
  //const end = start + this.itemsPerPage;
 // return this.exams.slice(start, end);
//}

onPageChange(page: number) {
  this.currentPage = page;
}

//get totalPages() {
  //return Math.ceil(this.exams.length / this.itemsPerPage);
//}

 

  

  // Méthode pour charger tous les examens ou effectuer la recherche
  loadExams(): void {
    if (this.searchTerm.trim() === '') {
      // Si le champ de recherche est vide, on charge tous les examens
      this.examService.getAllExams().subscribe({
        next: (data) => {this.exams = data;this.updatePaginatedExams();},
        error: (err) => console.error('Erreur chargement examens', err)
      });
    } else {
      // Sinon, on filtre les examens selon le titre
      this.examService.searchExams(this.searchTerm).subscribe({
        next: (data) => this.exams = data,
        error: (err) => console.error('Erreur recherche examens', err)
      });
    }
  }

  // Méthode appelée chaque fois que le champ de recherche change
  onSearchChange(): void {
    this.loadExams();  // Recharger la liste avec le terme de recherche
    this.updatePaginatedExams();
  }

  // Méthode pour sélectionner un examen
  selectExam(examId: number): void {
    this.router.navigate(['/exam', examId]);
  }
}
