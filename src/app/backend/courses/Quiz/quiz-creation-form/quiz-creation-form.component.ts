import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuizService } from '../../Services/quiz.service';
import { GlobalAlertService } from 'src/app/Service/global-alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Quiz } from 'src/app/model/quiz.model';
import { Course } from 'src/app/model/course.model';
import { CourseService } from '../../Services/course.service';

@Component({
  selector: 'app-quiz-creation-form',
  templateUrl: './quiz-creation-form.component.html',
  styleUrls: ['./quiz-creation-form.component.css']
})
export class QuizCreationFormComponent implements OnInit {
  quizForm: FormGroup;
  courses: Course[] = [];
  courseId: number | null = null;
  createdQuizId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private quizService: QuizService,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: GlobalAlertService
  ) {
    // Initialize the form with default numeric values so empty strings aren’t sent.
    this.quizForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      timeLimit: [30, [Validators.required, Validators.min(1)]],
      totalPoints: [100, [Validators.required, Validators.min(1)]],
      courseId: [null]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('courseId');
    if (idParam) {
      this.courseId = Number(idParam);
      // Pre-assign the course if coming from a course context.
      this.quizForm.patchValue({ courseId: this.courseId });
      this.quizForm.get('courseId')?.disable();
    } else {
      // If no courseId was passed, load all courses for selection.
      this.courseService.getAllCourses().subscribe({
        next: (courses) => this.courses = courses,
        error: (err) => console.error('Error loading courses', err)
      });
    }
  }

  onSubmit(): void {
    if (this.quizForm.invalid) {
      this.alertService.showAlert('Please fill all required fields', 'Validation Error');
      return;
    }

    // Enable courseId control if disabled so its value is included.
    if (this.quizForm.get('courseId')?.disabled) {
      this.quizForm.get('courseId')?.enable();
    }

    // Build a Quiz object and ensure numeric values are converted.
    const quizData: Quiz = {
      title: this.quizForm.value.title,
      description: this.quizForm.value.description,
      timeLimit: Number(this.quizForm.value.timeLimit),
      totalPoints: Number(this.quizForm.value.totalPoints),
      courseId: this.quizForm.value.courseId ? Number(this.quizForm.value.courseId) : null
    };

    this.quizService.createQuiz(quizData).subscribe({
      next: (quiz) => {
        this.alertService.showAlert('Quiz created successfully', 'Success');
        this.createdQuizId = quiz.id!;
      },
      error: (err) => {
        console.error('Error creating quiz:', err);
        this.alertService.showAlert(`Error: ${err.error?.error || err.message}`, 'Creation Failed');
      }
    });
  }

  // Navigate to the question creation form for the newly created quiz.
  addQuestions(): void {
    if (!this.createdQuizId) {
      this.alertService.showAlert('Please create the quiz first', 'Info');
      return;
    }
    this.router.navigate([`/backoffice/quiz-questions/${this.createdQuizId}`]);
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
