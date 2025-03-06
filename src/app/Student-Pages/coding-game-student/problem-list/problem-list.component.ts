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
    // Create new PDF document with better formatting
    const doc = new jsPDF();
    
    // Add header with logo placeholder
    doc.setFillColor(51, 122, 183); // Bootstrap primary color
    doc.rect(0, 0, 210, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text("Coding Challenge Platform", 105, 10, { align: 'center' });
    
    // Title section
    doc.setFontSize(22);
    doc.setTextColor(33, 33, 33);
    doc.text(problem.title, 105, 30, { align: 'center' });
    
    // Add horizontal line
    doc.setDrawColor(220, 220, 220);
    doc.line(20, 35, 190, 35);
    
    // Introduction section
    doc.setFontSize(12);
    doc.setTextColor(68, 68, 68);
    doc.text("Professional Challenge Description", 20, 45);
    
    // Standard introduction text for all coding challenges
    const introText = "Welcome to this coding challenge! This exercise is designed to test your problem-solving skills and programming knowledge. Each challenge on our platform is carefully crafted to help you improve your coding abilities and prepare for technical interviews. Before attempting to solve this problem, we recommend that you read through the entire description and requirements.";
    
    const splitIntro = doc.splitTextToSize(introText, 170);
    doc.text(splitIntro, 20, 55);
    
    // Problem statement section
    doc.setFontSize(14);
    doc.setTextColor(33, 33, 33);
    doc.text("Problem Statement", 20, 85);
    
    // Problem description
    doc.setFontSize(12);
    doc.setTextColor(68, 68, 68);
    const splitDescription = doc.splitTextToSize(problem.description, 170);
    doc.text(splitDescription, 20, 95);
    
    // Example section (you can populate with dynamic content from your problem data)
    doc.setFontSize(14);
    doc.setTextColor(33, 33, 33);
    doc.text("Examples", 20, 115);
    
    doc.setFontSize(12);
    doc.setTextColor(68, 68, 68);
    doc.text("Input: \"hello\"", 20, 125);
    doc.text("Output: \"olleh\"", 20, 135);
    
    // Additional examples if needed
    doc.text("Input: \"javascript\"", 20, 145);
    doc.text("Output: \"tpircsavaj\"", 20, 155);
    
    // Requirements section
    doc.setFontSize(14);
    doc.setTextColor(33, 33, 33);
    doc.text("Requirements", 20, 175);
    
    doc.setFontSize(12);
    doc.setTextColor(68, 68, 68);
    const requirements = [
      "Write your solution in JavaScript",
      "Function should accept a string as input",
      "Return the reversed string",
      "Pay attention to edge cases (empty strings, special characters, etc.)"
    ];
    
    let yPosition = 185;
    requirements.forEach(req => {
      doc.text("• " + req, 25, yPosition);
      yPosition += 10;
    });
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text("© " + new Date().getFullYear() + " Coding Challenge Platform - All rights reserved", 105, 280, { align: 'center' });
    
    // Save the PDF with a formatted name
    doc.save(`${problem.title.replace(/\s+/g, '_')}_problem_details.pdf`);
  }
}