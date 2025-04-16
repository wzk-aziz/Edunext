import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../Services/question.service';
import { Question } from 'src/app/model/question.model';
import { GlobalAlertService } from 'src/app/Service/global-alert.service';

@Component({
  selector: 'app-viewquestions',
  templateUrl: './viewquestions.component.html',
  styleUrls: ['./viewquestions.component.css']
})
export class ViewquestionsComponent implements OnInit {
  quizId!: number;
  questions: Question[] = [];
  loading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private alertService: GlobalAlertService
  ) {}

  ngOnInit(): void {
    this.quizId = Number(this.route.snapshot.paramMap.get('quizId'));
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.questionService.getQuestionsByQuizId(this.quizId).subscribe({
      next: (questions) => {
        this.questions = questions;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching questions:', err);
        this.errorMessage = `Error loading questions: ${err.error?.message || 'Unknown error'}`;
        this.loading = false;
      }
    });
  }
deleteQuestion(questionId: number): void {
  this.alertService.showConfirm('Are you sure you want to delete this question?', () => {
    this.questionService.deleteQuestion(questionId).subscribe({
      next: () => {
        this.alertService.showAlert('Question deleted successfully', 'Success');
        this.loadQuestions(); // Refresh list after deletion
      },
      error: (err) => {
        console.error('Error deleting question:', err);
        this.alertService.showAlert('Error deleting question', 'Error');
      }
    });
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
