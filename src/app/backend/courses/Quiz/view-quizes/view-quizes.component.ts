import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../Services/quiz.service';
import { Quiz } from 'src/app/model/quiz.model';
import { Router } from '@angular/router';
import { GlobalAlertService } from 'src/app/Service/global-alert.service';

@Component({
  selector: 'app-view-quizes',
  templateUrl: './view-quizes.component.html',
  styleUrls: ['./view-quizes.component.css']
})
export class ViewQuizesComponent implements OnInit {
  quizzes: Quiz[] = [];
  loading = true;
  errorMessage: string | null = null;

  constructor(
    private quizService: QuizService,
    private router: Router,
    private alertService: GlobalAlertService
  ) {}

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
        this.errorMessage = 'Error loading quizzes';
        console.error('Error fetching quizzes:', err);
        this.loading = false;
      }
    });
  }

  editQuiz(quizId: number): void {
    this.router.navigate([`/backoffice/edit-quiz/${quizId}`]);
  }

    deleteQuiz(quizId: number): void {
    this.alertService.showConfirm('Are you sure you want to delete this quiz?', () => {
      this.quizService.deleteQuiz(quizId).subscribe({
        next: () => {
          this.alertService.showAlert('Quiz deleted successfully', 'Success');
          this.loadQuizzes(); // Refresh list after deletion
        },
        error: (err) => {
          console.error('Error deleting quiz:', err);
          this.alertService.showAlert('Error deleting quiz', 'Error');
        }
      });
    });
  }

  viewQuestions(quizId: number): void {
    this.router.navigate([`/backoffice/view_questions/${quizId}`]);
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
