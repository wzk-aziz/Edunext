import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/model/course.model';
import { Lecture } from 'src/app/model/Lecture.model';
import { LectureService } from '../../Services/lecture.service';
import { CourseService } from '../../Services/course.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalAlertService } from 'src/app/Service/global-alert.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-viewlecture',
  templateUrl: './viewlecture.component.html',
  styleUrls: ['./viewlecture.component.css']
})
export class ViewlectureComponent implements OnInit {
  courses: Course[] = [];
  // Dictionary to hold lectures for each course: key is course id, value is array of lectures
  lecturesByCourse: { [courseId: number]: Lecture[] } = {};
  page: number = 1;

  constructor(
    private lectureService: LectureService,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router,
    private globalAlertService: GlobalAlertService
  ) {}

  ngOnInit(): void {
    this.loadAllCourses();
  }

  ngAfterViewInit(): void {
    // Initialize all collapse elements after the view is rendered
    const collapses = document.querySelectorAll('.accordion-collapse');
    collapses.forEach((collapseEl: Element) => {
      new bootstrap.Collapse(collapseEl, { toggle: false });
    });
  }

  loadAllCourses(): void {
    this.courseService.getAllCourses().subscribe(courses => {
      this.courses = courses;
      courses.forEach(course => {
        this.lectureService.getLecturesByCourseId(course.id!).subscribe(lectures => {
          this.lecturesByCourse[course.id!] = lectures.sort((a, b) => a.lectureOrder - b.lectureOrder);
        });
      });
    });
  }

  // Helper to get lectures for a specific course
  getLecturesForCourse(course: Course): Lecture[] {
    return this.lecturesByCourse[course.id!] || [];
  }


  downloadFile(filePath: string | undefined): void {
    if (!filePath) {
      this.globalAlertService.showAlert('Invalid file path!', 'Download Error');
      return;
    }
  
    window.open(filePath, '_blank'); // Open as HTTP
  }
  




  // Uncomment if you want to download files instead of opening them directly
  // downloadFile(fileData: string | undefined, fileName: string | undefined): void {
  //   if (!fileData || !fileName) {
  //     this.globalAlertService.showAlert('Invalid file data or file name!', 'Download Error');
  //     return;
  //   }
  
  //   const byteArray = new Uint8Array(atob(fileData).split('').map(char => char.charCodeAt(0)));
  //   const blob = new Blob([byteArray], { type: 'application/octet-stream' });
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = fileName;
  //   a.click();
  //   window.URL.revokeObjectURL(url);
  // }

  // Handle delete of a lecture using the global alert's confirm method
  deleteLecture(lectureId: number | undefined): void {
    if (lectureId === undefined) {
      this.globalAlertService.showAlert('Invalid lecture ID!', 'Delete Error');
      return;
    }
    this.globalAlertService.showConfirm(
      'Are you sure you want to delete this lecture?',
      () => {
        // On Confirm
        this.lectureService.deleteLecture(lectureId).subscribe({
          next: () => {
            this.globalAlertService.showAlert('Lecture deleted successfully', 'Success');
            this.loadAllCourses(); // Reload courses and lectures after deletion
          },
          error: (err) => {
            console.error('Error deleting lecture:', err);
            this.globalAlertService.showAlert('Error deleting lecture', 'Error');
          }
        });
      },
      () => {
        // On Cancel: Do nothing.
      },
      'Confirm Delete'
    );
  }

  // Handle edit of a lecture
  editLecture(lectureId: number | undefined, courseId: number): void {
    if (lectureId === undefined) {
      this.globalAlertService.showAlert('Invalid lecture ID!', 'Edit Error');
      return;
    }
    this.router.navigate([`/backoffice/lecture-update`, courseId, lectureId]);
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
