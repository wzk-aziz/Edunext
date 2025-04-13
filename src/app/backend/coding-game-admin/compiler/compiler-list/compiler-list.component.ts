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

  constructor(private compilerService: CompilerService, private router: Router) {}

  ngOnInit(): void {
    this.loadCompilers();
  }

  loadCompilers(): void {
    this.compilerService.getAll().subscribe(data => {
      this.compilers = data;
    });
  }


  deleteCompiler(id: number | undefined): void {
    if (id !== undefined) {
      Swal.fire({
        title: 'Are you sure?',
        text: "This will delete the compiler permanently!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.compilerService.delete(id).subscribe(() => {
            this.compilers = this.compilers.filter(c => c.id !== id);
            Swal.fire('Deleted!', 'Compiler has been deleted.', 'success');
          });
        }
      });
    }
  }
  

  goToCreate(): void {
    this.router.navigate(['/backoffice/compilers/new']);
  }

  goToEdit(id: number): void {
    this.router.navigate([`/backoffice/compilers/edit/${id}`]);
  }
}
