import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProblemService } from '../problem.service';
import { Problem } from '../../models/problem.model';

@Component({
  selector: 'app-problem-form',
  templateUrl: './problem-form.component.html',
  styleUrls: ['./problem-form.component.css']
})
export class ProblemFormComponent implements OnInit {
  problem: Problem = { title: '', description: '', expectedOutput: '' };
  isEditMode = false;
  successMessage: string = '';
  isFormValid: boolean = false; // ✅ Ajout d'une variable pour gérer l'état du bouton

  constructor(
    private problemService: ProblemService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.problemService.getById(Number(id)).subscribe(data => {
        this.problem = data;
        this.validateForm(); // ✅ Vérifie l'état du formulaire après chargement des données
      });
    }
  }

  saveProblem() {
    if (this.isEditMode) {
      this.problemService.update(this.problem.id!, this.problem).subscribe(() => {
        this.successMessage = "Problem updated successfully!";
        setTimeout(() => this.router.navigate(['/problems']), 2000);
      });
    } else {
      this.problemService.create(this.problem).subscribe(() => {
        this.successMessage = "✅ Problem added successfully!";
        this.problem = { title: '', description: '', expectedOutput: '' }; // ✅ Réinitialise le formulaire
        this.validateForm(); // ✅ Vérifie l'état du formulaire après la réinitialisation
        setTimeout(() => this.successMessage = '', 3000);
      });
    }
  }

  goBack() {
    this.router.navigate(['/backoffice/problems']); // ✅ Redirection vers la liste
  }

  validateForm() {
    this.isFormValid = this.problem.title.trim() !== '' &&
                       this.problem.description.trim() !== '' &&
                       this.problem.expectedOutput.trim() !== '';
  }
}
