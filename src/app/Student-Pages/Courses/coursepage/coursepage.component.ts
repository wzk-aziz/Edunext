import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/backend/courses/Services/course.service';
import { LectureService } from 'src/app/backend/courses/Services/lecture.service';
import { Course } from 'src/app/model/course.model';
import { Lecture } from 'src/app/model/Lecture.model';

@Component({
  selector: 'app-coursepage',
  templateUrl: './coursepage.component.html',
  styleUrls: ['./coursepage.component.css']
})
export class CoursepageComponent implements OnInit {
  courseId!: number;
  course!: Course;
  lectures: Lecture[] = [];
  currentLecture?: Lecture;
  // View type: 'video' or 'pdf'
  viewType: 'video' | 'pdf' = 'video';

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private lectureService: LectureService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCourse();
    this.loadLectures();
  }

  loadCourse(): void {
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (course) => this.course = course,
      error: (err) => console.error('Error loading course:', err)
    });
  }

  loadLectures(): void {
    this.lectureService.getLecturesByCourseId(this.courseId).subscribe({
      next: (lectures) => {
        this.lectures = lectures.sort((a, b) => a.lectureOrder - b.lectureOrder);
        if (this.lectures.length > 0) {
          this.currentLecture = this.lectures[0];
          // Set default view type depending on available content
          this.viewType = this.currentLecture.videoData ? 'video' : 'pdf';
        }
      },
      error: (err) => console.error('Error loading lectures:', err)
    });
  }

  // When a lecture is selected from the sidebar, update currentLecture and viewType
  selectLecture(lecture: Lecture): void {
    this.currentLecture = lecture;
    if (lecture.videoData && lecture.pdfData) {
      this.viewType = 'video'; // default to video if both exist
    } else if (lecture.videoData) {
      this.viewType = 'video';
    } else if (lecture.pdfData) {
      this.viewType = 'pdf';
    }
  }

  // Returns a safe URL for the video data
  getVideoUrl(): SafeUrl {
    if (this.currentLecture && this.currentLecture.videoData) {
      return this.sanitizer.bypassSecurityTrustUrl(
        `data:${this.currentLecture.videoType};base64,${this.currentLecture.videoData}`
      );
    }
    return '';
  }

  // Returns a safe URL for the PDF data
  getSafePdfUrl(pdfData?: string): SafeUrl {
    if (pdfData) {
      return this.sanitizer.bypassSecurityTrustUrl(`data:application/pdf;base64,${pdfData}`);
    }
    return '';
  }

  // Enroll in course (or start course player)
  enrollCourse(): void {
    this.router.navigate(['/course-player', this.courseId]);
  }
}
