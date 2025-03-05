import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import { Problem } from 'src/app/backend/coding-game-admin/models/problem.model';
import { ProblemService } from 'src/app/backend/coding-game-admin/problems/problem.service';

@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})
export class ProblemListComponent implements OnInit {
  problems: any[] = [];

  constructor(
    private problemService: ProblemService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProblems();
  }

  loadProblems(): void {
    this.problemService.getAll().subscribe((data) => {
      this.problems = data;
    });
  }

  viewProblem(id: number): void {
    this.router.navigate(['/coding-game/problem-detail', id]);
  }

  launchProblem(id: number): void {
    this.router.navigate(['/coding-game/editor', id]);
  }
  generatePDF(problem: Problem): void {
    const doc = new jsPDF();
    
    // Style et mise en page
    doc.setFontSize(16);
    doc.setTextColor(33, 33, 33);
    
    // Titre du problème
    doc.text(problem.title, 20, 20);
    
    // Description
    doc.setFontSize(12);
    doc.setTextColor(68, 68, 68);
    
    // Utiliser splitTextToSize pour gérer le retour à la ligne automatique
    const splitDescription = doc.splitTextToSize(problem.description, 170);
    doc.text(splitDescription, 20, 30);
    
    // Détails supplémentaires
   
    
    // Enregistrer le PDF
    doc.save(`${problem.title}_problem_details.pdf`);
  }

  
}
