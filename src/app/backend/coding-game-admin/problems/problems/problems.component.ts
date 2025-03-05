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

  constructor(private problemService: ProblemService, private router: Router) {}

  ngOnInit(): void {
    this.loadProblems();
  }

  loadProblems() {
    this.problemService.getAll().subscribe(data => {
      this.problems = data;
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
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.problemService.delete(id).subscribe(() => {
          this.problems = this.problems.filter(p => p.id !== id);
          this.loading = false;
          Swal.fire('Deleted!', 'Your problem has been deleted.', 'success');
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
