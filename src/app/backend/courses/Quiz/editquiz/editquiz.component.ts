import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuizService } from '../../Services/quiz.service';
import { Quiz } from 'src/app/model/quiz.model';

import { CourseService } from '../../Services/course.service';
import { Course } from 'src/app/model/course.model';
import { GlobalAlertService } from 'src/app/Service/global-alert.service';

@Component({
  selector: 'app-editquiz',
  templateUrl: './editquiz.component.html',
  styleUrls: ['./editquiz.component.css']
})
export class EditquizComponent implements OnInit {
  quizId!: number;
  quizForm: FormGroup;
  courses: Course[] = [];
  loading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private quizService: QuizService,
    private courseService: CourseService,
    private router: Router,
    private alertService: GlobalAlertService
  ) {
    this.quizForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      timeLimit: [30, [Validators.required, Validators.min(1)]],
      totalPoints: [100, [Validators.required, Validators.min(1)]],
      courseId: [null]
    });
  }

  ngOnInit(): void {
    this.quizId = Number(this.route.snapshot.paramMap.get('quizId'));
    this.loadQuiz();
    this.loadCourses();
  }

  loadQuiz(): void {
    this.quizService.getQuizById(this.quizId).subscribe({
      next: (quiz) => {
        this.quizForm.patchValue({
          title: quiz.title,
          description: quiz.description,
          timeLimit: quiz.timeLimit,
          totalPoints: quiz.totalPoints,
          courseId: quiz.courseId ? quiz.courseId : null
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading quiz:', err);
        this.errorMessage = `Error loading quiz: ${err.error?.message || 'Unknown error'}`;
        this.loading = false;
      }
    });
  }

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
      },
      error: (err) => {
        console.error('Error loading courses:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.quizForm.invalid) {
      this.alertService.showAlert('Please fill all required fields', 'Validation Error');
      return;
    }

    const updatedQuiz: Quiz = {
      id: this.quizId,
      title: this.quizForm.value.title,
      description: this.quizForm.value.description,
      timeLimit: this.quizForm.value.timeLimit,
      totalPoints: this.quizForm.value.totalPoints,
      courseId: this.quizForm.value.courseId ? Number(this.quizForm.value.courseId) : null
    };

    this.quizService.updateQuiz(this.quizId, updatedQuiz).subscribe({
      next: () => {
        this.alertService.showAlert('Quiz updated successfully', 'Success');
        this.router.navigate(['/backoffice/view-quizes']);
      },
      error: (err) => {
        console.error('Error updating quiz:', err);
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
