import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../language.service';
import { Language } from '../../models/language.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-language-list',
  templateUrl: './language-list.component.html',
  styleUrls: ['./language-list.component.css']
})
export class LanguageListComponent implements OnInit {
  languages: Language[] = [];

  constructor(private languageService: LanguageService, private router: Router) {}

  ngOnInit(): void {
    this.loadLanguages();
  }
  viewLanguage(id: number): void {
    this.router.navigate([`/backoffice/languages/view/${id}`]);
  }
  
  loadLanguages() {
    this.languageService.getAll().subscribe(data => {
      this.languages = data;
    });
  }

  deleteLanguage(id: number | undefined) {
    if (id !== undefined) {
      Swal.fire({
        title: 'Are you sure?',
        text: "This will delete the language permanently!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.languageService.delete(id).subscribe(() => {
            this.languages = this.languages.filter(l => l.id !== id);
            Swal.fire('Deleted!', 'Language has been deleted.', 'success');
          });
        }
      });
    }
  }

  goToAdd() {
    this.router.navigate(['/backoffice/languages/new']);
  }

  goToUpdate(id: number) {
    this.router.navigate(['/backoffice/languages/edit', id]);
  }

  goToView(id: number) {
    this.router.navigate(['/backoffice/languages/view', id]);
  }
}
