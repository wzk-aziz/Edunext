import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompilerService } from '../compiler.service';
import { Compiler } from '../../models/compiler.model';


@Component({
  selector: 'app-compiler-detail',
  templateUrl: './compiler-detail.component.html',
  styleUrls: ['./compiler-detail.component.css']
})
export class CompilerDetailComponent implements OnInit {
  compiler: Compiler| undefined;

  constructor(
    private compilerService: CompilerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.compilerService.get(id).subscribe((data) => {
        this.compiler = data;
      });
    }
  }

  backToList(): void {
    this.router.navigate(['/backoffice/compilers']);
  }
}
