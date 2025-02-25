import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from '../Services/course.service';
import { Course } from 'src/app/model/course.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CoursesListComponent implements OnInit {
  courses: Course[] = [];
  isMenuOpen = false;
  page: number = 1;
  isTeacherMenuOpen = false;

  constructor(
    private courseService: CourseService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleTeacherMenu(): void {
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

  deleteCourse(id: number): void {
    this.courseService.deleteCourse(id).subscribe(() => {
      this.loadCourses();
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

  // Helper method for pack type text.
  getPackTypeText(course: Course): string {
    switch (course.packType) {
      case 'COPPER': return 'Copper';
      case 'BRONZE': return 'Bronze';
      case 'SILVER': return 'Silver';
      case 'GOLD': return 'Gold';
      default: return 'Unknown';
    }
  }

  // Helper method to get the category name.
  getCategoryName(course: Course): string {
    return course.category && course.category.name ? course.category.name : 'N/A';
  }
}
