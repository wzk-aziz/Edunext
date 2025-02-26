import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from 'src/app/backend/courses/Services/question.service';
import { QuizService } from 'src/app/backend/courses/Services/quiz.service';
import { Question } from 'src/app/model/question.model';
import { Quiz } from 'src/app/model/quiz.model';

@Component({
  selector: 'app-student-quizzes',
  templateUrl: './student-quizzes.component.html',
  styleUrls: ['./student-quizzes.component.css']
})
export class StudentQuizzesComponent {
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

  startQuiz(quizId: number): void {
    this.router.navigate(['/take-quiz', quizId]);
  }
}
