import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CourseService } from 'src/app/backend/courses/Services/course.service';
import { Course, CourseLevel, PackType } from 'src/app/model/course.model';

@Component({
  selector: 'app-courseslist',
  templateUrl: './courseslist.component.html',
  styleUrls: ['./courseslist.component.css']
})
export class CourseslistComponent implements OnInit {
  page: number = 1;
  courses: Course[] = [];
  itemsPerPage: number = 3;
  selectedCourseLevel?: CourseLevel | null = null;
  CourseLevel = CourseLevel;
  mostLikedCourses: Course[] = [];
  constructor(
    private courseService: CourseService,
    private sanitizer: DomSanitizer
  ) {}

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
          // Filter courses: at least 5 likes and likes are not less than dislikes.
          this.mostLikedCourses = courses
            .filter(course => 
              (course.likes || 0) >= 5 && (course.likes || 0) >= (course.dislikes || 0)
            )
            .sort((a, b) => (b.likes || 0) - (a.likes || 0))
            .slice(0, 5);
          this.courses = courses;
        },
        error: (err) => {
          console.error('Error loading courses:', err);
        }
      });
    }
  }
  
  

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

  getPackRibbonClass(course: Course): string {
    return PackType[course.packType] ? `ribbon-${course.packType.toLowerCase()}` : 'ribbon-default';
  }

  getPackTypeText(course: Course): string {
    return PackType[course.packType] || 'Unknown';
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
  

}