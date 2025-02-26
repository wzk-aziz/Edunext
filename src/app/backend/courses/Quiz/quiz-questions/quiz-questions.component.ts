import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuestionService } from '../../Services/question.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalAlertService } from 'src/app/Service/global-alert.service';

@Component({
  selector: 'app-quiz-questions',
  templateUrl: './quiz-questions.component.html',
  styleUrls: ['./quiz-questions.component.css']
})
export class QuizQuestionsComponent implements OnInit {
  quizId!: number;
  questionsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: GlobalAlertService
  ) {
    // Initialize with an empty FormArray for questions.
    this.questionsForm = this.fb.group({
      questions: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.quizId = Number(this.route.snapshot.paramMap.get('quizId'));
    this.addQuestion(); // Start with one question
  }

  // Convenience getter for the FormArray
  get questionsFormArray(): FormArray {
    return this.questionsForm.get('questions') as FormArray;
  }

  // Adds a new question form group with auto-incremented order and default points = 1
  addQuestion(): void {
    const questionGroup = this.fb.group({
      questionOrder: [this.questionsFormArray.length + 1, [Validators.required, Validators.min(1)]],
      questionText: ['', Validators.required],
      questionType: ['SINGLE_CHOICE', Validators.required],
      answerOptions: this.fb.array([this.fb.control('', Validators.required)]),
      correctAnswers: this.fb.array([this.fb.control('', Validators.required)]),
      points: [1, [Validators.required, Validators.min(1)]],
      explanation: ['']
    });
    this.questionsFormArray.push(questionGroup);
  }

  removeQuestion(index: number): void {
    if (this.questionsFormArray.length > 1) {
      this.questionsFormArray.removeAt(index);
      // Update questionOrder for remaining questions
      this.questionsFormArray.controls.forEach((group, i) => {
        group.get('questionOrder')?.setValue(i + 1);
      });
    } else {
      this.alertService.showAlert('At least one question is required.', 'Validation Error');
    }
  }

  // Answer Options methods
  getAnswerOptionsArray(questionIndex: number): FormArray {
    return this.questionsFormArray.at(questionIndex).get('answerOptions') as FormArray;
  }

  addAnswerOption(questionIndex: number): void {
    this.getAnswerOptionsArray(questionIndex).push(this.fb.control('', Validators.required));
  }

  removeAnswerOption(questionIndex: number, optionIndex: number): void {
    const options = this.getAnswerOptionsArray(questionIndex);
    if (options.length > 1) {
      options.removeAt(optionIndex);
    }
  }

  // Correct Answers methods
  getCorrectAnswersArray(questionIndex: number): FormArray {
    return this.questionsFormArray.at(questionIndex).get('correctAnswers') as FormArray;
  }

  addCorrectAnswer(questionIndex: number): void {
    this.getCorrectAnswersArray(questionIndex).push(this.fb.control('', Validators.required));
  }

  removeCorrectAnswer(questionIndex: number, answerIndex: number): void {
    const answers = this.getCorrectAnswersArray(questionIndex);
    if (answers.length > 1) {
      answers.removeAt(answerIndex);
    }
  }

  onSubmit(): void {
    if (this.questionsForm.invalid) {
      this.alertService.showAlert('Please fill all required question fields', 'Validation Error');
      return;
    }
  
    // Build the questions array from the form data
    const questions = this.questionsForm.value.questions.map((q: any) => ({
      questionText: q.questionText,
      questionType: q.questionType,
      answerOptions: q.answerOptions,
      correctAnswers: q.correctAnswers,
      points: q.points,
      explanation: q.explanation,
      quiz: { id: this.quizId }  // <-- Make sure quiz ID is set as an object with an ID
    }));
  
    // Send to backend
    this.questionService.createQuestionsForQuiz(this.quizId, questions).subscribe({
      next: () => {
        this.alertService.showAlert('Questions created successfully', 'Success');
        this.router.navigate(['/backoffice/quizzes']);
      },
      error: (err) => {
        console.error('Error creating questions:', err);
        this.alertService.showAlert(`Error: ${err.error?.error || err.message}`, 'Error');
      }
    });
  }

  isMenuOpen = false;
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  isTeacherMenuOpen = false;
  toggleTeacherMenu(): void {
    this.isTeacherMenuOpen = !this.isTeacherMenuOpen;
  }
  
}
