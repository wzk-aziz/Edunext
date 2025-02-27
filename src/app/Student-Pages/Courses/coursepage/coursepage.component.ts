import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/backend/courses/Services/course.service';
import { LectureService } from 'src/app/backend/courses/Services/lecture.service';
import { Lecture } from 'src/app/model/Lecture.model';
import { Course } from 'src/app/model/course.model';

@Component({
  selector: 'app-coursepage',
  templateUrl: './coursepage.component.html',
  styleUrls: ['./coursepage.component.css']
})
export class CoursepageComponent implements OnInit {
  course!: Course;
  lectures: Lecture[] = [];
  currentLecture?: Lecture;
  viewMode: string = 'video'; // default mode

  constructor(
    private lectureService: LectureService,
    private courseService: CourseService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCourse(courseId);
    this.loadLectures(courseId);
  }

  loadCourse(courseId: number): void {
    this.courseService.getCourseById(courseId).subscribe({
      next: (course) => {
        this.course = course;
        // Optionally, set the first lecture as current if available
        if (this.lectures.length > 0) {
          this.currentLecture = this.lectures[0];
        }
      },
      error: (err) => console.error('Error loading course:', err)
    });
  }

  loadLectures(courseId: number): void {
    // Assuming you have a service method to get lectures by course id
    // You may adjust the endpoint as needed.
    this.lectureService.getLecturesByCourseId(courseId).subscribe({
      next: (lectures) => {
        this.lectures = lectures.sort((a, b) => a.lectureOrder - b.lectureOrder);
        if (this.lectures.length > 0) {
          this.currentLecture = this.lectures[0];
        }
      },
      error: (err) => console.error('Error loading lectures:', err)
    });
  }

  selectLecture(lecture: Lecture): void {
    this.currentLecture = lecture;
  }

  getVideoUrl(): SafeResourceUrl {
    if (!this.currentLecture?.videoData) return '';
    const dataUrl = `data:${this.currentLecture.videoType};base64,${this.currentLecture.videoData}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl);
  }

  getPdfUrl(): SafeResourceUrl {
    if (!this.currentLecture?.pdfData) return '';
    const dataUrl = `data:application/pdf;base64,${this.currentLecture.pdfData}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl);
  }

  enrollCourse(): void {
    // Navigate to the course player or enrollment page
    this.router.navigate(['/course-player', this.course.id]);
  }
}
