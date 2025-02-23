import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../Services/course.service';
import { Course } from 'src/app/model/course.model';

@Component({
  selector: 'app-course-update',
  templateUrl: './course-update.component.html',
  styleUrls: ['./course-update.component.css']
})
export class CourseUpdateComponent implements OnInit {
  courseForm: FormGroup;
  courseId!: number;
  existingCourse!: Course;
  isEditMode = true;
  isMenuOpen = false;


  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  isTeacherMenuOpen = false;

toggleTeacherMenu() {
    this.isTeacherMenuOpen = !this.isTeacherMenuOpen;
}
  // File previews
  thumbnailPreview: string | ArrayBuffer | null = null;
  pdfPreview: string | ArrayBuffer | null = null;
  videoPreview: string | ArrayBuffer | null = null;

  // Current files
  currentThumbnail: File | null = null;
  currentPdf: File | null = null;
  currentVideo: File | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService
  ) {
    this.courseForm = this.fb.group({
      courseName: ['', Validators.required],
      courseDescription: ['', Validators.required],
      pointsEarned: [1, [Validators.required, Validators.min(1)]],
      thumbnail: [null],
      pdfFile: [null],
      videoFile: [null]
    });
  }

  ngOnInit(): void {
    this.courseId = this.route.snapshot.params['id'];
    this.loadCourseData();
  }

  loadCourseData(): void {
    this.courseService.getCourse(this.courseId).subscribe({
      next: (course) => {
        this.existingCourse = course;
        this.patchFormValues(course);
      },
      error: (err) => console.error('Error loading course:', err)
    });
  }

  patchFormValues(course: Course): void {
    this.courseForm.patchValue({
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      pointsEarned: course.pointsEarned
    });

    // Set current file names
    if (course.thumbnailFileName) {
      this.thumbnailPreview = `data:${course.thumbnailFileType};base64,${course.thumbnailData}`;
    }
    if (course.pdfName) {
      this.pdfPreview = `data:${course.pdfType};base64,${course.pdfData}`;
    }
    if (course.videoName) {
      this.videoPreview = `data:${course.videoType};base64,${course.videoData}`;
    }
  }

  onThumbnailSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.currentThumbnail = file;
      this.previewFile(file, 'thumbnail');
    }
  }

  onPdfSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.currentPdf = file;
      this.previewFile(file, 'pdf');
    }
  }

  onVideoSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.currentVideo = file;
      this.previewFile(file, 'video');
    }
  }

  private previewFile(file: File, type: string): void {
    const reader = new FileReader();
    reader.onload = () => {
      switch (type) {
        case 'thumbnail':
          this.thumbnailPreview = reader.result;
          break;
        case 'pdf':
          this.pdfPreview = reader.result;
          break;
        case 'video':
          this.videoPreview = reader.result;
          break;
      }
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.courseForm.invalid) return;

    const formData = new FormData();
    formData.append('courseName', this.courseForm.get('courseName')?.value);
    formData.append('courseDescription', this.courseForm.get('courseDescription')?.value);
    formData.append('pointsEarned', this.courseForm.get('pointsEarned')?.value);

    if (this.currentThumbnail) {
      formData.append('thumbnail', this.currentThumbnail);
    }
    if (this.currentPdf) {
      formData.append('pdfFile', this.currentPdf);
    }
    if (this.currentVideo) {
      formData.append('videoFile', this.currentVideo);
    }

    this.courseService.updateCourse(this.courseId, formData).subscribe({
      next: () => {
        this.router.navigate(['/courseslist']);
      },
      error: (err) => console.error('Update failed:', err)
    });
  }
}