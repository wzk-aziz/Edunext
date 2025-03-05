import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageService } from '../language.service';  // Vérifie le bon chemin
import { Language } from '../../models/language.model';

@Component({
  selector: 'app-language-detail',
  templateUrl: './language-detail.component.html',
  styleUrls: ['./language-detail.component.css']
})
export class LanguageDetailComponent implements OnInit {
  language: Language | undefined;

  constructor(
    private languageService: LanguageService,
    private route: ActivatedRoute,
    private router: Router,  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.languageService.get(id).subscribe((data) => {
        this.language = data;
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/backoffice/languages']);
  }
}
