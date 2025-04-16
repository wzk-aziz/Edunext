import { Component, OnInit } from '@angular/core';
import { ProblemService } from '../problem.service';
import { Problem } from '../../models/problem.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-problems',
  templateUrl: './problems.component.html',
  styleUrls: ['./problems.component.css']
})
export class ProblemsComponent implements OnInit {
  problems: Problem[] = [];
  loading: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 6;
  
  constructor(
    private problemService: ProblemService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.loadProblems();
  }
  
  loadProblems() {
    this.loading = true;
    this.problemService.getAll().subscribe({
      next: (data) => {
        this.problems = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching problems:', error);
        this.loading = false;
        Swal.fire({
          title: 'Error!',
          text: 'Unable to load problems. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }
  
  get paginatedProblems() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.problems.slice(start, start + this.itemsPerPage);
  }
  
  get totalPages() {
    return Math.ceil(this.problems.length / this.itemsPerPage);
  }
  
  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  
  deleteProblem(id?: number) {
    if (!id) return;
    
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#3498db',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.problemService.delete(id).subscribe({
          next: () => {
            this.problems = this.problems.filter(p => p.id !== id);
            this.loading = false;
            Swal.fire({
              title: 'Deleted!',
              text: 'Problem has been successfully deleted.',
              icon: 'success',
              confirmButtonColor: '#3498db'
            });
            
            // Adjust current page if necessary after deletion
            if (this.paginatedProblems.length === 0 && this.currentPage > 1) {
              this.currentPage--;
            }
          },
          error: (error) => {
            console.error('Error deleting problem:', error);
            this.loading = false;
            Swal.fire({
              title: 'Error!',
              text: 'Unable to delete the problem. Please try again later.',
              icon: 'error',
              confirmButtonColor: '#3498db'
            });
          }
        });
      }
    });
  }
  
  goToUpdate(id: number) {
    this.router.navigate(['/backoffice/problems/edit', id]);
  }
  
  goToView(id: number) {
    this.router.navigate(['/backoffice/problems/view', id]);
  }
}