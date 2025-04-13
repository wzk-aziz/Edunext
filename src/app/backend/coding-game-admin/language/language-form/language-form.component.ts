import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../language.service';
import { Language } from '../../models/language.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-language-form',
  templateUrl: './language-form.component.html',
  styleUrls: ['./language-form.component.css']
})
export class LanguageFormComponent implements OnInit {
  language: Language = { name: '', version: '' };
  isEditMode = false;

  constructor(
    private languageService: LanguageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  backToList(): void {
    this.router.navigate(['/backoffice/languages']);
  }
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.languageService.get(+id).subscribe((data: Language) => {
        this.language = data;
      });
    }
  }

  saveLanguage() {
    if (this.isEditMode) {
      this.languageService.update(this.language.id!, this.language).subscribe(() => {
        this.router.navigate(['/backoffice/languages']);
      });
    } else {
      this.languageService.create(this.language).subscribe(() => {
        this.router.navigate(['/backoffice/languages']);
      });
    }
  }

  cancel() {
    this.router.navigate(['/backoffice/languages']);
  }
}
