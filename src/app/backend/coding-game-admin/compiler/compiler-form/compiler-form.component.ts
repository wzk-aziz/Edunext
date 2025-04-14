import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompilerService } from '../compiler.service';
import { Compiler } from '../../models/compiler.model';

@Component({
  selector: 'app-compiler-form',
  templateUrl: './compiler-form.component.html',
  styleUrls: ['./compiler-form.component.css']
})
export class CompilerFormComponent implements OnInit {
  // ✅ Initialise compiler.language avec un objet Language vide
  compiler: Compiler = {
    command: '',
    language: { 
      id: 0, 
      name: '', 
      version: '' 
    }
  };
  isEditMode = false;

  constructor(
    private compilerService: CompilerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      const id = Number(idParam);
      this.compilerService.get(id).subscribe(data => {
        this.compiler = data;
      });
    }
  }

  saveCompiler(): void {
    if (this.isEditMode) {
      this.compilerService.update(this.compiler.id!, this.compiler).subscribe(() => {
        this.router.navigate(['/backoffice/compilers']);
      });
    } else {
      this.compilerService.create(this.compiler).subscribe(() => {
        this.router.navigate(['/backoffice/compilers']);
      });
    }
  }

  backToList(): void {
    this.router.navigate(['/backoffice/compilers']);
  }
}
