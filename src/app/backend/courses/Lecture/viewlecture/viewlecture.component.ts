import { GlobalAlertComponent } from './../../../../global-alert/global-alert.component';
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
  lectures: Lecture[] = [];
  page: number = 1;
  courseId: number | undefined;
  lectureId: number | undefined;

  constructor(
    private lectureService: LectureService,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router, // Inject the Router service
    private globalAlertService: GlobalAlertService
  ) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    this.loadAllCourses();
  }

  loadAllCourses(): void {
    // Fetch all courses
    this.courseService.getAllCourses().subscribe(courses => {
      this.courses = courses;
      this.loadLecturesForAllCourses(); // After loading all courses, load lectures for them
    });
  }

  loadLecturesForAllCourses(): void {
    this.courses.forEach(course => {
      this.lectureService.getLecturesByCourseId(course.id!).subscribe(lectures => {
        this.lectures.push(...lectures);
        this.lectures.sort((a, b) => a.lectureOrder - b.lectureOrder); // Sort lectures after adding them
      });
    });
  }
  

  getSortedLectures(): Lecture[] {
    // Sort lectures by the lectureOrder
    return this.lectures.sort((a, b) => a.lectureOrder - b.lectureOrder);
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
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  isTeacherMenuOpen = false;
  toggleTeacherMenu() {
    this.isTeacherMenuOpen = !this.isTeacherMenuOpen;
  }
   // Handle delete of a lecture
   deleteLecture(lectureId: number | undefined): void {
    if (lectureId === undefined) {
      this.globalAlertService.showAlert('Invalid lecture ID!', 'Delete Error');
      return;
    }
    if (confirm('Are you sure you want to delete this lecture?')) {
      this.lectureService.deleteLecture(lectureId).subscribe({
        next: () => {
          alert('Lecture deleted successfully');
          this.loadAllCourses(); // Reload lectures after deletion
        },
        error: (err) => {
          console.error('Error deleting lecture:', err);
          alert('Error deleting lecture');
        }
      });
    }
  }

   // Handle edit of a lecture
   editLecture(lectureId: number | undefined): void {
    if (lectureId === undefined || this.courseId === undefined) {
      this.globalAlertService.showAlert('Invalid lecture or course ID!', 'Edit Error');
      return;
    }
    // Navigate to the edit lecture page, passing the lectureId
    this.router.navigate([`/backoffice/lecture-update`, this.courseId, lectureId]);
  }
}