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
  lectureNotes: string = '';
  notePanelOpen: boolean = false;
  showSavedMessage: boolean = false;
  savedTimeout: any;
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
    return this.currentLecture?.videoPath
      ? this.sanitizer.bypassSecurityTrustResourceUrl(this.currentLecture.videoPath)
      : '';
  }
  
  getPdfUrl(): SafeResourceUrl {
    return this.currentLecture?.pdfPath
      ? this.sanitizer.bypassSecurityTrustResourceUrl(this.currentLecture.pdfPath)
      : '';
  }
  
 

  enrollCourse(): void {
    // Navigate to the course player or enrollment page
    this.router.navigate(['/course-player', this.course.id]);
  }

  getNoteStorageKey(): string {
    return `notes_student_1_lecture_${this.currentLecture?.id}`;
  }
  
  toggleNotePanel(): void {
    this.notePanelOpen = !this.notePanelOpen;
    if (this.notePanelOpen) {
      const saved = localStorage.getItem(this.getNoteStorageKey());
      this.lectureNotes = saved || '';
    }
  }
  
  onNoteChange(): void {
    localStorage.setItem(this.getNoteStorageKey(), this.lectureNotes);
  
    this.showSavedMessage = true;
    if (this.savedTimeout) clearTimeout(this.savedTimeout);
    this.savedTimeout = setTimeout(() => {
      this.showSavedMessage = false;
    }, 2000); // Hide after 2 seconds
  }
}
