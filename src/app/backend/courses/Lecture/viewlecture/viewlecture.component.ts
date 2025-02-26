import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/model/course.model';
import { Lecture } from 'src/app/model/Lecture.model';
import { LectureService } from '../../Services/lecture.service';
import { CourseService } from '../../Services/course.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalAlertService } from 'src/app/Service/global-alert.service';

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

  loadAllCourses(): void {
    // Fetch all courses
    this.courseService.getAllCourses().subscribe(courses => {
      this.courses = courses;
      // For each course, fetch its lectures and store them in the dictionary
      courses.forEach(course => {
        this.lectureService.getLecturesByCourseId(course.id!).subscribe(lectures => {
          // Sort lectures by lectureOrder before storing
          this.lecturesByCourse[course.id!] = lectures.sort((a, b) => a.lectureOrder - b.lectureOrder);
        });
      });
    });
  }

  // Helper to get lectures for a specific course
  getLecturesForCourse(course: Course): Lecture[] {
    return this.lecturesByCourse[course.id!] || [];
  }

  downloadFile(fileData: string | undefined, fileName: string | undefined): void {
    if (!fileData || !fileName) {
      this.globalAlertService.showAlert('Invalid file data or file name!', 'Download Error');
      return;
    }
  
    const byteArray = new Uint8Array(atob(fileData).split('').map(char => char.charCodeAt(0)));
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

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
}
