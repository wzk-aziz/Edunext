import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from '../Services/course.service';
import { Course } from 'src/app/model/course.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CoursesListComponent implements OnInit {
  courses: Course[] = [];
  isMenuOpen = false;
  page: number = 1;

  constructor(
    private courseService: CourseService,
    private sanitizer: DomSanitizer
  ) {}
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  isTeacherMenuOpen = false;

toggleTeacherMenu() {
    this.isTeacherMenuOpen = !this.isTeacherMenuOpen;
}
  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe(courses => {
      this.courses = courses;
    });
  }

  getSafePdfUrl(pdfData: string): SafeResourceUrl {
    const dataUrl = `data:application/pdf;base64,${pdfData}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl);
  }

  deleteCourse(id: number): void {
    this.courseService.deleteCourse(id).subscribe(() => {
      this.loadCourses();
    });
  }
}