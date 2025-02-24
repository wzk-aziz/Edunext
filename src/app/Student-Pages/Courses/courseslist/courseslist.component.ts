import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CourseService } from 'src/app/backend/courses/Services/course.service';
import { Course } from 'src/app/model/course.model';

@Component({
  selector: 'app-courseslist',
  templateUrl: './courseslist.component.html',
  styleUrls: ['./courseslist.component.css']
})
export class CourseslistComponent implements OnInit {
  page: number = 1;
  courses: Course[] = [];
  itemsPerPage: number = 3;

  constructor(
    private courseService: CourseService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

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

  // Helper method for PDF preview URLs (if used in your template)
  getSafePdfUrl(pdfData: string): SafeResourceUrl {
    const dataUrl = `data:application/pdf;base64,${pdfData}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl);
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

  // Pagination helpers
  get totalPages(): number {
    return Math.ceil(this.courses.length / this.itemsPerPage);
  }
  get pagesArray(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
  setPage(pageNumber: number, event: Event): void {
    event.preventDefault();
    this.page = pageNumber;
  }
  get startIndex(): number {
    return (this.page - 1) * this.itemsPerPage + 1;
  }
  get endIndex(): number {
    return Math.min(this.page * this.itemsPerPage, this.courses.length);
  }

  // Helper method for styling the pack type (if needed)
  getPackRibbonClass(course: Course): string {
    switch (course.packType) {
      case 'COPPER': return 'ribbon-copper';
      case 'BRONZE': return 'ribbon-bronze';
      case 'SILVER': return 'ribbon-silver';
      case 'GOLD': return 'ribbon-gold';
      default: return 'ribbon-default';
    }
  }

  // Helper method to display a friendly pack type label.
  getPackTypeText(course: Course): string {
    switch (course.packType) {
      case 'COPPER': return 'Copper';
      case 'BRONZE': return 'Bronze';
      case 'SILVER': return 'Silver';
      case 'GOLD': return 'Gold';
      default: return 'Unknown';
    }
  }

  // New helper method to return a CSS class for the category badge.
  getCategoryBadgeClass(course: Course): string {
    if (!course.category || !course.category.name) {
      return 'badge bg-secondary';
    }
    const catName = course.category.name.toLowerCase();
    if (catName.includes('development')) {
      return 'badge bg-primary';
    } else if (catName.includes('business')) {
      return 'badge bg-success';
    } else if (catName.includes('design')) {
      return 'badge bg-info';
    } else if (catName.includes('marketing')) {
      return 'badge bg-warning';
    }
    return 'badge bg-secondary';
  }
 
}
