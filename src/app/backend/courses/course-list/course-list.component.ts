import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from '../Services/course.service';
import { Course, CourseLevel, PackType } from 'src/app/model/course.model';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalAlertService } from 'src/app/Service/global-alert.service';

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
  selectedCourseLevel?: CourseLevel | null = null;
  CourseLevel = CourseLevel;
  itemsPerPage: number = 3;
  constructor(
    private courseService: CourseService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private alertService: GlobalAlertService
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
    if (this.selectedCourseLevel) {
      this.searchCoursesByCourseLevel(this.selectedCourseLevel);
    } else {
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

 //admin
 deleteCourse(id: number): void {
  this.alertService.showConfirm(
    'Are you sure you want to delete this course?',
    () => {
      this.courseService.deleteCourse(id).subscribe(() => {
        this.loadCourses();
      });
    },
    () => {
      console.log('Course deletion canceled.');
    },
    'Confirm Deletion'
  );
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



  //new


  sortCourses(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const sortBy = target.value;
  }
  
  searchCoursesByName(event: Event): void {
    const input = event.target as HTMLInputElement;
    const name = input.value;
    if (!name.trim()) {
      this.loadCourses();
      return;
    }
    this.courseService.getCoursesByName(name).subscribe({
      next: (courses) => this.courses = courses,
      error: (err) => console.error('Error searching courses by name:', err)
    });
  }
  

  searchCoursesByCategory(categoryId: number): void {
    this.courseService.getCoursesByCategory(categoryId).subscribe({
      next: (courses) => {
        this.courses = courses;
      },
      error: (err) => {
        console.error('Error searching courses by category:', err);
      }
    });
  }

  searchCoursesByCourseLevel(courseLevel: CourseLevel): void {
    if (this.selectedCourseLevel === courseLevel) {
      // If the same level is clicked again, clear the filter.
      this.selectedCourseLevel = undefined;
      this.loadCourses();
    } else {
      this.selectedCourseLevel = courseLevel;
      this.courseService.getCoursesByCourseLevel(courseLevel).subscribe({
        next: (courses) => {
          this.courses = courses;
        },
        error: (err) => {
          console.error('Error searching courses by course level:', err);
        }
      });
    }
  }
  get totalPages(): number {
    return Math.ceil(this.courses.length / this.itemsPerPage);
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  setPage(pageNumber: number, event: Event): void {
    event.preventDefault();
    this.page = pageNumber;
  }

  get startIndex(): number {
    return (this.page - 1) * this.itemsPerPage;
  }

  get endIndex(): number {
    return Math.min(this.page * this.itemsPerPage, this.courses.length);
  }


  // Like or Dislike
likeCourse(courseId: number): void {
  this.courseService.voteCourse(courseId, 'like').subscribe({
    next: (updated) => {
      // Update the local array
      const index = this.courses.findIndex(c => c.id === updated.id);
      if (index !== -1) {
        this.courses[index] = updated;
      }
    },
    error: (err) => console.error('Error liking course:', err)
  });
}

dislikeCourse(courseId: number): void {
  this.courseService.voteCourse(courseId, 'dislike').subscribe({
    next: (updated) => {
      // Update the local array
      const index = this.courses.findIndex(c => c.id === updated.id);
      if (index !== -1) {
        this.courses[index] = updated;
      }
    },
    error: (err) => console.error('Error disliking course:', err)
  });
}
  // Helper to compute a ratio-based star rating
  // Example: ratio * 5 => star rating
  // ratio = likes / (likes + dislikes)
  getStarRating(course: Course): number {
    const likes = course.likes ?? 0;
    const dislikes = course.dislikes ?? 0;
    const total = likes + dislikes;
    if (total === 0) {
      return 0;
    }
    const ratio = likes / total;
    // Convert ratio (0..1) to 0..5 star rating
    return Math.round(ratio * 5);
  }
// Helper to return an array for star rendering
getRatingStars(course: Course): boolean[] {
  const rating = this.getStarRating(course); // e.g. 0..5
  const stars: boolean[] = [];
  for (let i = 0; i < 5; i++) {
    stars.push(i < rating);
  }
  return stars;
}
  



getSignalClass(course: Course): string {
  const level = course.courseLevel ? course.courseLevel.trim().toUpperCase() : '';
  switch(level) {
    case 'BEGINNER':
      return 'fas fa-signal text-info me-2';
    case 'INTERMEDIATE':
      return 'fas fa-signal text-warning me-2';
    case 'ADVANCED':
      return 'fas fa-signal text-danger me-2';
    case 'ALL_LEVELS':
      return 'fas fa-signal text-success me-2';
    default:
      return 'fas fa-signal text-secondary me-2';
  }
}

getCategoryBadgeClass(course: Course): string {
  const categoryBadgeClasses: { [key: string]: string } = {
    development: 'badge bg-primary',
    data: 'badge bg-success',
    Machine: 'badge bg-info',
    Other: 'badge bg-warning'
  };

  if (!course.category || !course.category.name) {
    return 'badge bg-secondary';
  }

  const catName = course.category.name.toLowerCase();
  for (const key in categoryBadgeClasses) {
    if (catName.includes(key)) {
      return categoryBadgeClasses[key];
    }
  }

  return 'badge bg-secondary';
}
getPackRibbonClass(course: Course): string {
  return PackType[course.packType] ? `ribbon-${course.packType.toLowerCase()}` : 'ribbon-default';
}
}
