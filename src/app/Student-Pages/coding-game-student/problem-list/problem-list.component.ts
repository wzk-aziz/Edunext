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
  filteredProblems: any[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalItems: number = 0;
  selectedDifficulty: string = '';
  difficulties: string[] = ['Easy', 'Medium', 'Hard'];

  constructor(private problemService: ProblemService, private router: Router) {}

  ngOnInit(): void {
    this.loadProblems();
  }
  getPaginationRange() {
    // Crée une pagination intelligente qui montre toujours un nombre limité de pages
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, this.currentPage - halfVisiblePages);
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    // Ajuster si on est près de la fin
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
  
  // Ajouter cette référence pour utiliser dans le template
  Math = Math;
  loadProblems(): void {
    this.problemService.getAll().subscribe({
      next: (data) => {
        this.problems = data;
        console.log('Loaded problems:', this.problems); // Debug
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading problems:', error);
      }
    });
  }

  applyFilters(): void {
    // Convertir en minuscules pour la comparaison
    const difficulty = this.selectedDifficulty.toLowerCase();
    
    this.filteredProblems = this.problems.filter(problem => {
      if (!this.selectedDifficulty) {
        return true;
      }
      // Assurez-vous que la comparaison est insensible à la casse
      return problem.difficulty.toLowerCase() === difficulty;
    });
    
    this.totalItems = this.filteredProblems.length;
    // Revenir à la première page après le filtrage
    this.currentPage = 1;
    console.log('Filtered problems:', this.filteredProblems); // Debug
  }

  onDifficultyChange(difficulty: string): void {
    console.log('Selected difficulty:', difficulty); // Debug
    // Si on clique sur le même niveau, on désélectionne
    if (this.selectedDifficulty === difficulty) {
      this.selectedDifficulty = '';
    } else {
      this.selectedDifficulty = difficulty;
    }
    this.applyFilters();
  }

  resetFilters(): void {
    this.selectedDifficulty = '';
    this.currentPage = 1;
    this.applyFilters();
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get paginatedProblems(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredProblems.slice(startIndex, startIndex + this.pageSize);
  }

  viewProblem(id: number): void {
    this.router.navigate(['/coding-game/problem-detail', id]);
  }

  launchProblem(id: number): void {
    this.router.navigate(['/coding-game/editor', id]);
  }

  generatePDF(problem: Problem): void {
    const doc = new jsPDF();
    doc.setFillColor(51, 122, 183);
    doc.rect(0, 0, 210, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text("Coding Challenge Platform", 105, 10, { align: 'center' });
    doc.setFontSize(22);
    doc.setTextColor(33, 33, 33);
    doc.text(problem.title, 105, 30, { align: 'center' });
    doc.setDrawColor(220, 220, 220);
    doc.line(20, 35, 190, 35);
    doc.setFontSize(12);
    doc.setTextColor(68, 68, 68);
    doc.text("Professional Challenge Description", 20, 45);
    const introText = "Welcome to this coding challenge! ...";
    const splitIntro = doc.splitTextToSize(introText, 170);
    doc.text(splitIntro, 20, 55);
    doc.setFontSize(14);
    doc.setTextColor(33, 33, 33);
    doc.text("Problem Statement", 20, 85);
    doc.setFontSize(12);
    doc.setTextColor(68, 68, 68);
    const splitDescription = doc.splitTextToSize(problem.description, 170);
    doc.text(splitDescription, 20, 95);
    doc.text("Examples", 20, 115);
    doc.text("Input: \"hello\"", 20, 125);
    doc.text("Output: \"olleh\"", 20, 135);
    doc.text("Input: \"javascript\"", 20, 145);
    doc.text("Output: \"tpircsavaj\"", 20, 155);
    doc.setFontSize(14);
    doc.text("Requirements", 20, 175);
    const requirements = [
      "Write your solution in JavaScript",
      "Function should accept a string as input",
      "Return the reversed string",
      "Pay attention to edge cases"
    ];
    let y = 185;
    requirements.forEach(req => {
      doc.text("• " + req, 25, y);
      y += 10;
    });
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text("© " + new Date().getFullYear() + " Coding Challenge Platform", 105, 280, { align: 'center' });
    doc.save(`${problem.title.replace(/\s+/g, '_')}_problem_details.pdf`);
  }
}
