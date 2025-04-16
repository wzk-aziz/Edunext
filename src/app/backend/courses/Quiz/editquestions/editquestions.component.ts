import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { QuestionService } from '../../Services/question.service';
import { Question, QuestionType } from 'src/app/model/question.model';
import { GlobalAlertService } from 'src/app/Service/global-alert.service';

@Component({
  selector: 'app-editquestions',
  templateUrl: './editquestions.component.html',
  styleUrls: ['./editquestions.component.css']
})
export class EditquestionsComponent implements OnInit {
  questionId!: number;
  questionForm: FormGroup;
  questionTypes = Object.values(QuestionType); // SINGLE_CHOICE, MULTIPLE_CHOICE
  loading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private questionService: QuestionService,
    private router: Router,
    private alertService: GlobalAlertService
  ) {
    this.questionForm = this.fb.group({
      questionText: ['', Validators.required],
      questionType: ['', Validators.required],
      answerOptions: this.fb.array([]), // Answer options as FormArray
      correctAnswers: this.fb.array([]), // Correct answers as FormArray
      points: [1, [Validators.required, Validators.min(1)]],
      explanation: ['']
    });
  }

  ngOnInit(): void {
    this.questionId = Number(this.route.snapshot.paramMap.get('questionId'));
    this.loadQuestion();
  }

  loadQuestion(): void {
    this.questionService.getQuestionById(this.questionId).subscribe({
      next: (question) => {
        this.populateForm(question);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading question:', err);
        this.errorMessage = `Error loading question: ${err.error?.message || 'Unknown error'}`;
        this.loading = false;
      }
    });
  }

  populateForm(question: Question): void {
    this.questionForm.patchValue({
      questionText: question.questionText,
      questionType: question.questionType,
      points: question.points,
      explanation: question.explanation
    });

    this.setFormArray(this.answerOptionsArray, question.answerOptions);
    this.setFormArray(this.correctAnswersArray, question.correctAnswers);
  }

  setFormArray(formArray: FormArray, values: string[]): void {
    formArray.clear();
    values.forEach(value => {
      formArray.push(this.fb.control(value, Validators.required));
    });
  }

  // Getters for Form Arrays
  get answerOptionsArray(): FormArray {
    return this.questionForm.get('answerOptions') as FormArray;
  }

  get correctAnswersArray(): FormArray {
    return this.questionForm.get('correctAnswers') as FormArray;
  }

  addAnswerOption(): void {
    this.answerOptionsArray.push(this.fb.control('', Validators.required));
  }

  removeAnswerOption(index: number): void {
    if (this.answerOptionsArray.length > 1) {
      this.answerOptionsArray.removeAt(index);
    }
  }

  addCorrectAnswer(): void {
    this.correctAnswersArray.push(this.fb.control('', Validators.required));
  }

  removeCorrectAnswer(index: number): void {
    if (this.correctAnswersArray.length > 1) {
      this.correctAnswersArray.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.questionForm.invalid) {
      this.alertService.showAlert('Please fill all required fields', 'Validation Error');
      return;
    }

    const updatedQuestion: Question = {
      id: this.questionId,
      questionText: this.questionForm.value.questionText,
      questionType: this.questionForm.value.questionType,
      answerOptions: this.questionForm.value.answerOptions,
      correctAnswers: this.questionForm.value.correctAnswers,
      points: this.questionForm.value.points,
      explanation: this.questionForm.value.explanation
    };

    this.questionService.updateQuestion(this.questionId, updatedQuestion).subscribe({
      next: () => {
        this.alertService.showAlert('Question updated successfully', 'Success');
        this.router.navigate(['/backoffice/view-quizes', updatedQuestion.id]);
      },
      error: (err) => {
        console.error('Error updating question:', err);
        this.alertService.showAlert(`Error: ${err.error?.error || err.message}`, 'Update Failed');
      }
    });
  }

  isMenuOpen = false;
 
  
  isTeacherMenuOpen = false;
 


  isVirtualClassroomMenuOpen = false;
  isVirtualClassroomSubMenuOpen = false;
  isLiveTutoringSubMenuOpen = false;


  isCodingGameMenuOpen = false;
  isForumMenuOpen = false;
  showSubMenu = false;


  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }


  toggleTeacherMenu() {
    this.isTeacherMenuOpen = !this.isTeacherMenuOpen;

  }
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
