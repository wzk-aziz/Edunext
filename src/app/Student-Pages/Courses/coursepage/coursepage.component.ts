import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/backend/courses/Services/course.service';
import { LectureService } from 'src/app/backend/courses/Services/lecture.service';
import { Lecture } from 'src/app/model/Lecture.model';
import { Course } from 'src/app/model/course.model';
import * as pdfjsLib from 'pdfjs-dist';

(pdfjsLib as any).GlobalWorkerOptions.workerSrc = '/assets/pdf.worker.js';

@Component({
  selector: 'app-coursepage',
  templateUrl: './coursepage.component.html',
  styleUrls: ['./coursepage.component.css']
})
export class CoursepageComponent implements OnInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

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
  
    if (lecture.videoPath && lecture.pdfPath) {
      this.viewMode = 'video';
    } else if (lecture.videoPath) {
      this.viewMode = 'video';
    } else if (lecture.pdfPath) {
      this.viewMode = 'pdf';
    }
  
    // Resume from last watched time if video
    setTimeout(() => {
      if (this.viewMode === 'video' && this.videoPlayer) {
        const video = this.videoPlayer.nativeElement;
        const savedTime = parseFloat(localStorage.getItem(`lecture_video_time_${lecture.id}`) || '0');
        video.currentTime = savedTime;
      }
    }, 100); // slight delay to ensure player is ready
  }
  

  getVideoUrl(): SafeResourceUrl {
    return this.currentLecture?.videoPath
      ? this.sanitizer.bypassSecurityTrustResourceUrl(this.currentLecture.videoPath)
      : '';
  }
  
 
  sanitizeUrl(url: string): string {
    return this.sanitizer.sanitize(1, this.sanitizer.bypassSecurityTrustResourceUrl(url)) || '';
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
  onVideoTimeUpdate(): void {
    if (!this.currentLecture) return;
  
    const video = this.videoPlayer.nativeElement;
  
    // Save current time
    localStorage.setItem(`lecture_video_time_${this.currentLecture.id}`, video.currentTime.toString());
  
    const rawPercent = Math.floor((video.currentTime / video.duration) * 100);
    const percent = Math.min(rawPercent, 99);
  
    const key = `lecture_video_progress_${this.currentLecture.id}`;
    const prev = parseInt(localStorage.getItem(key) || '0', 10);
    const maxProgress = Math.max(percent, prev);
    localStorage.setItem(key, maxProgress.toString());
  }
  
  

  getLectureProgress(lectureId: number | undefined): number {
    if (!lectureId) return 0;
  
    const videoProgress = parseInt(localStorage.getItem(`lecture_video_progress_${lectureId}`) || '0', 10);
    const pdfProgress = parseInt(localStorage.getItem(`lecture_pdf_progress_${lectureId}`) || '0', 10);
  
    const hasVideo = !!this.lectures.find(l => l.id === lectureId)?.videoPath;
    const hasPdf = !!this.lectures.find(l => l.id === lectureId)?.pdfPath;
  
    let progress = 0;
  
    if (hasVideo && hasPdf) {
      progress = Math.floor((videoProgress + pdfProgress) / 2);
    } else if (hasVideo) {
      progress = videoProgress;
    } else if (hasPdf) {
      progress = pdfProgress;
    }
  
    return progress >= 99 ? 100 : progress;
  }
  
  


  onPdfScroll(percent: number): void {
    if (!this.currentLecture) return;
  
    const capped = Math.min(percent, 99); // cap at 99%
    const progressKey = `lecture_pdf_progress_${this.currentLecture.id}`;
    const prev = parseInt(localStorage.getItem(progressKey) || '0', 10);
    const maxProgress = Math.max(capped, prev);
  
    // Save max progress
    localStorage.setItem(progressKey, maxProgress.toString());
  
    // Save scroll position too (for resume functionality)
    const scrollKey = `lecture_pdf_scroll_${this.currentLecture.id}`;
    const scrollElement = document.querySelector('.pdf-container') as HTMLElement;
    if (scrollElement) {
      localStorage.setItem(scrollKey, scrollElement.scrollTop.toString());
    }
  }
  
  
  


  
}