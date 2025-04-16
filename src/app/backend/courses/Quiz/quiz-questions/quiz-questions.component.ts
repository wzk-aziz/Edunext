import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuestionService } from '../../Services/question.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalAlertService } from 'src/app/Service/global-alert.service';
import { QuizService } from '../../Services/quiz.service';  // Make sure you have a quiz service

@Component({
  selector: 'app-quiz-questions',
  templateUrl: './quiz-questions.component.html',
  styleUrls: ['./quiz-questions.component.css']
})
export class QuizQuestionsComponent implements OnInit {
  quizId!: number;
  totalQuizPoints: number = 0; // Total points of the quiz
  questionsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
    private quizService: QuizService, // used to fetch quiz details
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

    // Fetch the quiz to get total points (adjust the method as needed)
    this.quizService.getQuizById(this.quizId).subscribe({
      next: (quiz) => {
        this.totalQuizPoints = quiz.totalPoints;
        // Once total points are known, update distribution
        this.updatePointsDistribution();
      },
      error: (err) => {
        console.error('Error fetching quiz details', err);
      }
    });

    // Start with one question.
    this.addQuestion();
  }

  // Convenience getter for the FormArray
  get questionsFormArray(): FormArray {
    return this.questionsForm.get('questions') as FormArray;
  }

  // Adds a new question form group with default points set to 1 (will be recalculated)
  addQuestion(): void {
    const questionGroup = this.fb.group({
      questionOrder: [this.questionsFormArray.length + 1, [Validators.required, Validators.min(1)]],
      questionText: ['', Validators.required],
      questionType: ['SINGLE_CHOICE', Validators.required],
      answerOptions: this.fb.array([this.fb.control('', Validators.required)]),
      correctAnswers: this.fb.array([this.fb.control('', Validators.required)]),
      points: [1, [Validators.required, Validators.min(1)]], // This will be updated automatically.
      explanation: ['']
    });
    this.questionsFormArray.push(questionGroup);
    this.updatePointsDistribution();
  }

  removeQuestion(index: number): void {
    if (this.questionsFormArray.length > 1) {
      this.questionsFormArray.removeAt(index);
      // Update question orders
      this.questionsFormArray.controls.forEach((group, i) => {
        group.get('questionOrder')?.setValue(i + 1);
      });
      this.updatePointsDistribution();
    } else {
      this.alertService.showAlert('At least one question is required.', 'Validation Error');
    }
  }

  updatePointsDistribution(): void {
    const count = this.questionsFormArray.length;
    if (count > 0 && this.totalQuizPoints > 0) {
      // Calculate points per question rounded to two decimals.
      const perQuestion = parseFloat((this.totalQuizPoints / count).toFixed(2));
      this.questionsFormArray.controls.forEach((group) => {
        group.get('points')?.setValue(perQuestion);
      });
    }
  }

  // Methods for answer options
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

  // Methods for correct answers
  getCorrectAnswersArray(questionIndex: number): FormArray {
    return this.questionsFormArray.at(questionIndex).get('correctAnswers') as FormArray;
  }

  addCorrectAnswer(questionIndex: number): void {
    const questionGroup = this.questionsFormArray.at(questionIndex);
    const questionType = questionGroup.get('questionType')?.value;
    const correctAnswers = this.getCorrectAnswersArray(questionIndex);
  
    // For single choice questions, allow only one correct answer.
    if (questionType === 'SINGLE_CHOICE' && correctAnswers.length >= 1) {
      this.alertService.showAlert('Single Choice questions allow only one correct answer', 'Validation Error');
      return;
    }
    correctAnswers.push(this.fb.control('', Validators.required));
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
      quiz: { id: this.quizId }  // Set quiz reference
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


  isVirtualClassroomMenuOpen = false;
  isVirtualClassroomSubMenuOpen = false;
  isLiveTutoringSubMenuOpen = false;


  isCodingGameMenuOpen = false;
  isForumMenuOpen = false;
  showSubMenu = false;




 
  toggleCoursesMenu() {
    this.isMenuOpenCourses = !this.isMenuOpenCourses;

  }

  toggleMenuForum() {
    this.isForumMenuOpen = !this.isForumMenuOpen;

  }

  toggleVirtualClassroomMenu() {
    this.isVirtualClassroomMenuOpen = !this.isVirtualClassroomMenuOpen;
  }

  toggleVirtualClassroomSubMenu() {
    this.isVirtualClassroomSubMenuOpen = !this.isVirtualClassroomSubMenuOpen;
  }

  toggleLiveTutoringSubMenu() {
    this.isLiveTutoringSubMenuOpen = !this.isLiveTutoringSubMenuOpen;
  }



isCertificatMenuOpen = false;
isExamMenuOpen=false;
isMenuOpenCourses=false;
toggleExamMenu() {
  this.isExamMenuOpen = !this.isExamMenuOpen;
}

toggleCertificatMenu() {
this.isCertificatMenuOpen = !this.isCertificatMenuOpen;
}




  toggleCodingGameMenu() {
    this.isCodingGameMenuOpen = !this.isCodingGameMenuOpen;
  }

  toggleForumMenu(): void {
    this.isForumMenuOpen = !this.isForumMenuOpen;
  }

  toggleSubMenu() {
    this.showSubMenu = !this.showSubMenu;
  }
  
}
