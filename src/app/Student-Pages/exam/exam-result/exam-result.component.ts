import { Component } from '@angular/core';
import { AuthenticationServiceService } from 'src/app/Services/authentication-service.service';
import { ExamService } from 'src/app/Services/exam_service';

@Component({
  selector: 'app-exam-result',
  templateUrl: './exam-result.component.html',
  styleUrls: ['./exam-result.component.css']
})
export class ExamResultComponent {
  filteredResults: any[] = [];
paginatedResults: any[] = [];
  results: any[] = [];
  selectedExamResult: any = null;
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  passedCount: number = 0;
  searchTerm: string = '';

constructor(private examService: ExamService, private authService: AuthenticationServiceService) {}
  ngOnInit() {
    const userId = this.authService.getUserId(); // récupère depuis auth service
    this.examService.getResultsByUserId(userId!).subscribe(data => {
      this.results = data;
      this.filteredResults = [...this.results];
      this.updatePagination();
      this.calculatePassedCount();
    });
  }
  // Fonction pour afficher le résultat de l'examen sélectionné
  viewExamResult(examId: number) {
    const selectedResult = this.results.find(result => result.exam.idExam === examId);
    this.selectedExamResult = selectedResult;
  }

  // Fonction pour revenir à la liste des examens
  backToExams() {
    this.selectedExamResult = null;
  }


  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }
  
  getPages(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }
  
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredResults.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedResults = this.filteredResults.slice(start, end);
  }
  
  calculatePassedCount() {
    this.passedCount = this.results.filter(r => r.score >= r.exam.passingScore).length;
  }
  onSearchChange() {
    this.filteredResults = this.results.filter(result =>
      result.exam.examTitle.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1;
    this.updatePagination();
  }
}
