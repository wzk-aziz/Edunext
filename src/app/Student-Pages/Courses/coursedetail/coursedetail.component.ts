import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CourseService } from 'src/app/backend/courses/Services/course.service';
import { Course } from 'src/app/model/course.model';

@Component({
  selector: 'app-coursedetail',
  templateUrl: './coursedetail.component.html',
  styleUrls: ['./coursedetail.component.css']
})
export class CoursedetailComponent implements OnInit {
  course!: Course;
  courseId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // Extract the course id from the route
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCourseDetails();
  }

  loadCourseDetails(): void {
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (course) => {
        this.course = course;
        console.log('Course loaded:', course);
      },
      error: (err) => console.error('Error loading course details:', err)
    });
  }

  participate(): void {
    // Navigate to a course player route or enrollment page.
    this.router.navigate(['/course-player', this.courseId]);
  }

  getSafePdfUrl(pdfData: string): SafeResourceUrl {
    const dataUrl = `data:application/pdf;base64,${pdfData}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl);
  }

  getCourseLevelText(course: Course): string {
    switch (course.courseLevel) {
      case 'ALL_LEVELS': return 'All Levels';
      case 'BEGINNER': return 'Beginner';
      case 'INTERMEDIATE': return 'Intermediate';
      case 'ADVANCED': return 'Advanced';
      default: return 'Unknown';
    }
  }

  getPackTypeText(course: Course): string {
    switch (course.packType) {
      case 'COPPER': return 'Copper';
      case 'BRONZE': return 'Bronze';
      case 'SILVER': return 'Silver';
      case 'GOLD': return 'Gold';
      default: return 'Unknown';
    }
  }

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
