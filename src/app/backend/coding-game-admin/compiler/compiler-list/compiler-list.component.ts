import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { Compiler } from '../../models/compiler.model';
import { CompilerService } from '../compiler.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-compiler-list',
  templateUrl: './compiler-list.component.html',
  styleUrls: ['./compiler-list.component.css']
})
export class CompilerListComponent implements OnInit {
  compilers: Compiler[] = [];
  filteredCompilers: Compiler[] = [];
  searchTerm: string = '';
  filterLanguage: string = '';
  uniqueLanguages: string[] = [];

  // Sorting
  sortColumn: string = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Pagination
  itemsPerPage: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(private compilerService: CompilerService, private router: Router) {
  }

  ngOnInit(): void {
    this.loadCompilers();
  }

  loadCompilers(): void {
    this.compilerService.getAll().subscribe(data => {
      this.compilers = data;
      this.extractUniqueLanguages();
      this.filterCompilers();
    });
  }

  extractUniqueLanguages(): void {
    const languages = new Set<string>();
    this.compilers.forEach(compiler => {
      if (compiler.language && compiler.language.id) {
        languages.add(compiler.language.id.toString());
      }
    });
    this.uniqueLanguages = Array.from(languages);
  }

  filterCompilers(): void {
    // Filter by search term and language
    let filtered = this.compilers;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(compiler =>
          compiler.id?.toString().includes(term) ||
          compiler.command?.toLowerCase().includes(term) ||
          compiler.language?.id?.toString().toLowerCase().includes(term)
      );
    }

    if (this.filterLanguage) {
      filtered = filtered.filter(compiler =>
          compiler.language?.id?.toString() === this.filterLanguage
      );
    }

    // Apply sorting
    filtered = this.sortCompilers(filtered);

    // Calculate pagination
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }

    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredCompilers = filtered.slice(startIndex, startIndex + this.itemsPerPage);
  }

  sortCompilers(compilers: Compiler[]): Compiler[] {
    return compilers.sort((a, b) => {
      let valueA, valueB;

      if (this.sortColumn === 'language.id') {
        valueA = a.language?.id?.toString().toLowerCase() || '';
        valueB = b.language?.id?.toString().toLowerCase() || '';
      } else {
        valueA = a[this.sortColumn as keyof Compiler]?.toString().toLowerCase() || '';
        valueB = b[this.sortColumn as keyof Compiler]?.toString().toLowerCase() || '';
      }

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.filterCompilers();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.filterCompilers();
  }

  deleteCompiler(id: number): void {
    Swal.fire({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete this compiler? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.compilerService.delete(id).subscribe(() => {
          // Remove from local arrays
          this.compilers = this.compilers.filter(c => c.id !== id);
          this.filterCompilers();

          Swal.fire({
            title: 'Deleted!',
            text: 'The compiler has been successfully removed.',
            icon: 'success',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });
        }, error => {
          Swal.fire({
            title: 'Error',
            text: 'Failed to delete the compiler. Please try again.',
            icon: 'error'
          });
        });
      }
    });
  }

  goToCreate(): void {
    this.router.navigate(['/backoffice/compilers/new']);
  }

  goToEdit(id: number): void {
    this.router.navigate([`/backoffice/compilers/edit/${id}`]);
  }


  
}
