import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from '../Services/course.service';
import { Course } from 'src/app/model/course.model';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];

  constructor(private courseService: CourseService, private router: Router) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: (data) => this.courses = data,
      error: (error) => console.error('Error loading courses', error)
    });
  }

  editCourse(id: number | undefined): void {
    if (id !== undefined) {
      this.router.navigate([`/course-update/${id}`]);
    }
  }

  deleteCourse(id: number | undefined): void {
    if (id !== undefined) {
      this.courseService.deleteCourse(id).subscribe({
        next: () => this.loadCourses(),
        error: (error) => console.error('Error deleting course', error)
      });
    }
  }
}