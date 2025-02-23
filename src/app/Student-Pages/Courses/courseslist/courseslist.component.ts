import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CourseService } from 'src/app/backend/courses/Services/course.service';
import { Course } from 'src/app/model/course.model';

@Component({
  selector: 'app-courseslist',
  templateUrl: './courseslist.component.html',
  styleUrls: ['./courseslist.component.css']
})
export class CourseslistComponent {
  page: number = 1;

  courses: Course[] = [];
  constructor(
    private courseService: CourseService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  // Update loadCourses() in front-office:
loadCourses(): void {
  this.courseService.getAllCourses().subscribe({
    next: (courses) => {
      console.log('Courses loaded:', courses);
      this.courses = courses;
    },
    error: (err) => {
      console.error('Error loading courses:', err);
    }
  });
}
}
