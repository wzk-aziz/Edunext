import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { CourseService } from 'src/app/backend/courses/Services/course.service';
import { Course } from 'src/app/model/course.model';
import { Lecture } from 'src/app/model/Lecture.model';
import { LectureService } from 'src/app/backend/courses/Services/lecture.service';

@Component({
  selector: 'app-coursedetail',
  templateUrl: './coursedetail.component.html',
  styleUrls: ['./coursedetail.component.css']
})
export class CoursedetailComponent implements OnInit {
  course!: Course;
  lectures: Lecture[] = [];
  courseId!: number;

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
      next: (lectures) => this.lectures = lectures.sort((a, b) => a.lectureOrder - b.lectureOrder),
      error: (err) => console.error('Error loading lectures:', err)
    });
  }

  getThumbnailUrl(): SafeUrl {
    if (this.course.thumbnailData) {
      return this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${this.course.thumbnailData}`);
    }
    return '';
  }
  

  enrollCourse(): void {
    this.courseService.enrollInCourse(this.courseId).subscribe(() => {
      this.router.navigate(['/coursepage', this.courseId]);
    });
  }
  
  // Helper method to display a friendly course level label.
  getCourseLevelText(course: Course): string {
    switch (course.courseLevel) {
      case 'ALL_LEVELS': return 'All Levels';
      case 'BEGINNER': return 'Beginner';
      case 'INTERMEDIATE': return 'Intermediate';
      case 'ADVANCED': return 'Advanced';
      default: return 'Unknown';
    }
  }

}
