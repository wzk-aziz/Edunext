import { Component, OnInit } from '@angular/core';
import { QuizService } from 'src/app/backend/courses/Services/quiz.service';
import { Quiz } from 'src/app/model/quiz.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-quizzes',
  templateUrl: './student-quizzes.component.html',
  styleUrls: ['./student-quizzes.component.css']
})
export class StudentQuizzesComponent implements OnInit {
  quizzes: Quiz[] = [];
  loading = true;
  errorMessage: string | null = null;

  constructor(private quizService: QuizService, private router: Router) {}

  ngOnInit(): void {
    this.loadQuizzes();
  }

  loadQuizzes(): void {
    this.quizService.getAllQuizzes().subscribe({
      next: (quizzes) => {
        this.quizzes = quizzes;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching quizzes:', err);
        this.errorMessage = 'Error loading quizzes';
        this.loading = false;
      }
    });
  }

  startQuiz(quizId: number | undefined): void {
    if (quizId !== undefined) {
      this.router.navigate(['/take-quiz', quizId]);
    } else {
      console.warn("Quiz ID is undefined, cannot start quiz.");
    }
  }

  // **Helper Method: Format time limit display**
  formatTimeLimit(timeLimit: number | null | undefined): string {
    return timeLimit ? `${timeLimit} min` : 'No Time Limit';
  }

  // **Helper Method: Check if quizzes exist**
  hasQuizzes(): boolean {
    return this.quizzes && this.quizzes.length > 0;
  }
}
