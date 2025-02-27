import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from 'src/app/backend/courses/Services/question.service';
import { QuizService } from 'src/app/backend/courses/Services/quiz.service';
import { Question } from 'src/app/model/question.model';
import { Quiz } from 'src/app/model/quiz.model';

@Component({
  selector: 'app-take-quiz',
  templateUrl: './take-quiz.component.html',
  styleUrls: ['./take-quiz.component.css']
})
export class TakeQuizComponent {
  quizId!: number;
  questions: Question[] = [];
  quizForm: FormGroup;
  loading = true;
  errorMessage: string | null = null;

  timeLeft!: number; // Remaining time in seconds
  interval: any; // Timer interval
  quizTimeLimit!: number; // Time limit from the quiz

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private quizService: QuizService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.quizForm = this.fb.group({
      answers: this.fb.array([]) // Stores student answers
    });
  }

  ngOnInit(): void {
    this.quizId = Number(this.route.snapshot.paramMap.get('quizId'));
    this.loadQuiz();
  }

  loadQuiz(): void {
    this.quizService.getQuizById(this.quizId).subscribe({
      next: (quiz: Quiz) => {
        this.quizTimeLimit = quiz.timeLimit; // Fetch the quiz time limit (in minutes)
        this.loadQuestions();
      },
      error: (err) => {
        console.error('Error loading quiz:', err);
        this.errorMessage = 'Error loading quiz';
        this.loading = false;
      }
    });
  }

  loadQuestions(): void {
    this.questionService.getQuestionsByQuizId(this.quizId).subscribe({
      next: (questions) => {
        this.questions = questions;
        this.populateForm();
        this.startTimer(); // Start the countdown after fetching the quiz
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading questions:', err);
        this.errorMessage = 'Error loading questions';
        this.loading = false;
      }
    });
  }

  populateForm(): void {
    const answerArray = this.quizForm.get('answers') as FormArray;
    this.questions.forEach(() => {
      answerArray.push(this.fb.control('')); // Default empty answer
    });
  }

  startTimer(): void {
    if (!this.quizTimeLimit) {
        console.error("Quiz time limit not found, setting default to 1 minute");
        this.quizTimeLimit = 1; // Default to 1 minute if missing
    }

    this.timeLeft = this.quizTimeLimit * 60; // Convert minutes to seconds (no extra second)

    this.interval = setInterval(() => {
        if (this.timeLeft > 0) {
            this.timeLeft--;
        } else {
            clearInterval(this.interval);
            this.submitQuiz(); // Auto-submit when time runs out
        }
    }, 1000);
}



submitQuiz(): void {
  const studentAnswers = this.quizForm.value.answers.map((ans: string | string[]) => {
    if (Array.isArray(ans)) {
      return ans.map((a) => a.trim()); // Trim each answer in multiple-choice
    } else if (typeof ans === 'string') {
      return ans.trim(); // Trim single-choice answer
    } else {
      return ''; // Fallback for empty values
    }
  });

  console.log('Student Answers Submitted:', studentAnswers);

  this.router.navigate(['/quiz-results', this.quizId], {
    queryParams: { answers: JSON.stringify(studentAnswers) }
  });
}

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  formatTimeLeft(timeLeft: number): string {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }
  
  selectAnswer(questionIndex: number, selectedOption: string, questionType: string): void {
    const answersArray = this.quizForm.get('answers') as FormArray;
  
    if (questionType === 'SINGLE_CHOICE') {
      // Replace the answer for single-choice questions
      answersArray.controls[questionIndex].setValue([selectedOption]); 
    } else {
      // Handle multiple-choice selection
      let selectedAnswers: string[] = answersArray.controls[questionIndex].value || [];
  
      if (!Array.isArray(selectedAnswers)) {
        selectedAnswers = [];
      }
  
      if (selectedAnswers.includes(selectedOption)) {
        // Deselect if already selected
        selectedAnswers = selectedAnswers.filter((ans: string) => ans !== selectedOption);
      } else {
        // Select new answer
        selectedAnswers.push(selectedOption);
      }
  
      answersArray.controls[questionIndex].setValue(selectedAnswers);
    }
  }
  
  isSelected(questionIndex: number, option: string): boolean {
    const selectedAnswers: string[] = this.quizForm.get('answers')?.value[questionIndex] || [];
    return Array.isArray(selectedAnswers) ? selectedAnswers.includes(option) : selectedAnswers === option;
  }
  
  
}
