import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { exam } from 'src/app/models/exam';
import { Question } from 'src/app/models/Question';
import { ExamService } from 'src/app/Services/exam_service';

@Component({
  selector: 'app-examadminedit',
  templateUrl: './examadminedit.component.html',
  styleUrls: ['./examadminedit.component.css']
})
export class ExamadmineditComponent {
  exam: exam = new exam();
  isCertificatMenuOpen = false;
  isExamMenuOpen=false;

  toggleExamMenu() {
    this.isExamMenuOpen = !this.isExamMenuOpen;
  }

toggleCertificatMenu() {
  this.isCertificatMenuOpen = !this.isCertificatMenuOpen;
}
  constructor(
    private examService: ExamService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idExam = Number(this.route.snapshot.paramMap.get('idExam'));
  
    if (!isNaN(idExam) && idExam > 0) {
      this.examService.getExamById(idExam).subscribe({
        next: (exam) => {
          if (exam.scheduledDate) {
            const date = new Date(exam.scheduledDate);
            exam.scheduledDate = date.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
          }
          // Initialize questions array if it is not already
          exam.questions = exam.questions || [];
          this.exam = exam;
        },
        error: (err) => console.error(`❌ Error fetching exam [ID: ${idExam}] :`, err)
      });
    } else {
      console.error(`⚠️ Invalid exam ID: ${idExam}`);
    }
  }
  

  addQuestion(): void {
    if (!this.exam.questions) {
      this.exam.questions = [];
    }
    const newQuestion: Question = {
      id: Date.now(), // Generate unique ID (could be improved)
      questionText: '',
      answerOptions: ''
    };
    this.exam.questions.push(newQuestion);
  }
  

  onSubmit(): void {
    this.examService.updateExam(this.exam.idExam!, this.exam).subscribe(() => {
      this.router.navigate(['/backoffice/Exam']);  // Rediriger vers la liste des examens après la modification
    });
  }
  onUpdate() {
    this.examService.updateExam(this.exam.idExam!, this.exam).subscribe(() => {
      this.router.navigate(['/backoffice/Exam']);
    });
  }

  onQuestionUpdate(question: Question) {
    this.examService.updateQuestion(question.id!, question).subscribe();
  }
  isMenuOpen = false;
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  isTeacherMenuOpen = false;
  toggleTeacherMenu() {
    this.isTeacherMenuOpen = !this.isTeacherMenuOpen;
  }
  cancel(): void {
    this.router.navigate(['/backoffice/Exam']);
  }

  isDarkMode = false;

toggleDarkMode() {
  this.isDarkMode = !this.isDarkMode;
}
// Variable pour savoir si la sidebar est réduite
isSidebarMini = false;

// Fonction pour basculer l'état de la sidebar
toggleSidebar() {
  this.isSidebarMini = !this.isSidebarMini;
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




isMenuOpenCourses=false;





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
