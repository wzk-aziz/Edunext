import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from 'src/app/backend/courses/Services/question.service';
import { Question } from 'src/app/model/question.model';

@Component({
  selector: 'app-quiz-results',
  templateUrl: './quiz-results.component.html',
  styleUrls: ['./quiz-results.component.css']
})
export class QuizResultsComponent implements OnInit {
  quizId!: number;
  studentAnswers: (string | string[])[] = []; // Supports single and multiple-choice answers
  questions: Question[] = [];
  totalPoints = 0;
  studentScore = 0;

  constructor(private route: ActivatedRoute, private questionService: QuestionService) {}

  ngOnInit(): void {
    this.quizId = Number(this.route.snapshot.paramMap.get('quizId'));
    const answers = this.route.snapshot.queryParams['answers'];
    this.studentAnswers = answers ? JSON.parse(answers) : [];
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.questionService.getQuestionsByQuizId(this.quizId).subscribe({
      next: (questions) => {
        this.questions = questions;
        this.calculateScore();
      },
      error: (err) => {
        console.error('Error loading questions:', err);
      }
    });
  }

  calculateScore(): void {
    this.totalPoints = this.questions.reduce((sum, q) => sum + q.points, 0);
    this.studentScore = this.questions.reduce((score, q, i) => {
      if (i >= this.studentAnswers.length) return score;

      const studentAnswer = this.studentAnswers[i];
      const correctAnswers = q.correctAnswers.map(ans => ans.trim().toLowerCase());

      if (Array.isArray(studentAnswer)) {
        // For multiple-choice questions, check if all selected answers match the correct ones
        const normalizedStudentAnswers = studentAnswer.map(ans => ans.trim().toLowerCase());
        return normalizedStudentAnswers.every(ans => correctAnswers.includes(ans)) &&
               normalizedStudentAnswers.length === correctAnswers.length
          ? score + q.points
          : score;
      } else {
        // For single-choice questions
        return correctAnswers.includes(studentAnswer?.trim().toLowerCase()) ? score + q.points : score;
      }
    }, 0);
  }

  isCorrect(index: number): boolean {
    const studentAnswer = this.studentAnswers[index];
    const correctAnswers = this.questions[index].correctAnswers.map(ans => ans.trim().toLowerCase());

    if (Array.isArray(studentAnswer)) {
      const normalizedStudentAnswers = studentAnswer.map(ans => ans.trim().toLowerCase());
      return normalizedStudentAnswers.every(ans => correctAnswers.includes(ans)) &&
             normalizedStudentAnswers.length === correctAnswers.length;
    } else {
      return correctAnswers.includes(studentAnswer?.trim().toLowerCase());
    }
  }

  // **Helper Method: Check if an answer is an array**
  isMultipleChoiceAnswer(answer: string | string[]): boolean {
    return Array.isArray(answer);
  }

  // **Helper Method: Format multiple-choice answers as a string**
  formatMultipleChoiceAnswer(answer: string | string[]): string {
    return Array.isArray(answer) ? answer.join(', ') : answer;
  }
}
