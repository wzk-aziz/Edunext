import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from 'src/app/backend/courses/Services/question.service';
import { Question } from 'src/app/model/question.model';

@Component({
  selector: 'app-quiz-results',
  templateUrl: './quiz-results.component.html',
  styleUrls: ['./quiz-results.component.css']
})
export class QuizResultsComponent {
  quizId!: number;
  studentAnswers: string[] = [];
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
  
      const studentAnswer = this.studentAnswers[i]?.trim().toLowerCase();
      const correctAnswers = q.correctAnswers.map(ans => ans.trim().toLowerCase());
  
      console.log(`Question ${i + 1}:`);
      console.log(`Student Answer:`, studentAnswer);
      console.log(`Correct Answers:`, correctAnswers);
  
      const isCorrect = correctAnswers.includes(studentAnswer);
      return isCorrect ? score + q.points : score;
    }, 0);
  }
  

  isCorrect(index: number): boolean {
    return this.questions[index].correctAnswers.includes(this.studentAnswers[index]);
  }
}
