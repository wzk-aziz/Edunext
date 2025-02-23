import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../Services/course.service';
import { Course } from 'src/app/model/course.model';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent implements OnInit {
  @ViewChild('previewContainer') previewContainer: any;
  courseForm: FormGroup;
  selectedFile: File | null = null;
  filePreview: string | ArrayBuffer | null = null;
  thumbnailPreview: string | ArrayBuffer | null = null;
  isEditMode = false;
  courseId: number | null = null;
  selectedThumbnail: File | null = null;
  selectedPdf?: File;
  selectedVideo?: File;
  pdfPreview: string | null = null;
  videoPreview: string | null = null;
  isMenuOpen = false;
  page: number = 1;
  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.courseForm = this.fb.group({
      courseName: ['', Validators.required],
      courseDescription: ['', Validators.required],
      courseFormat: ['', Validators.required],
      pointsEarned: ['', [Validators.required, Validators.min(1)]]
    });
  }
 // Update file select handlers
 onPdfSelect(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.selectedPdf = file;
    this.pdfPreview = URL.createObjectURL(file);
  }
}

onVideoSelect(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.selectedVideo = file;
    this.videoPreview = URL.createObjectURL(file);
  }
}

// Clean up URLs when component destroys
ngOnDestroy() {
  if (this.pdfPreview) URL.revokeObjectURL(this.pdfPreview);
  if (this.videoPreview) URL.revokeObjectURL(this.videoPreview);
}

 ngOnInit(): void {
  this.courseId = this.route.snapshot.params['id'];
  this.isEditMode = !!this.courseId;

  this.courseForm = this.fb.group({
    courseName: ['', Validators.required],
    courseDescription: ['', Validators.required],
    courseFormat: ['PDF', Validators.required], // Set default value
    pointsEarned: ['', [Validators.required, Validators.min(1)]]
  });

  // Add thumbnail control conditionally
  if (!this.isEditMode) {
    this.courseForm.addControl('thumbnail', 
      this.fb.control(null, Validators.required));
  }

  if (this.isEditMode && this.courseId) {
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (course) => {
        this.courseForm.patchValue(course);
        if (course.thumbnailData) {
          this.thumbnailPreview = `data:image/png;base64,${course.thumbnailData}`;
        }
      },
      error: (error) => console.error('Error loading course', error)
    });
  }
}

  onFormatChange(event: any) {
    this.selectedFile = null; // Reset the file if the format changes
    this.filePreview = null;
  }

 // Modify onFileSelect
onFileSelect(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.selectedFile = file;
    const url = URL.createObjectURL(file);
    
    // Direct DOM manipulation
    if (this.courseForm.value.courseFormat === 'PDF') {
      this.previewContainer.nativeElement.innerHTML = `
        <embed src="${url}" 
               type="application/pdf" 
               width="100%" 
               height="300px">
      `;
    }
  }
}

onThumbnailSelect(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.selectedThumbnail = file;
    const control = this.courseForm.get('thumbnail');
    
    // Update form control validity
    if (control) {
      control.setValue(file.name);
      control.markAsTouched();
      control.updateValueAndValidity();
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      this.thumbnailPreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

  getAcceptedFileTypes(): string {
    const format = this.courseForm.get('courseFormat')?.value;
    switch (format) {
      case 'PDF':
        return 'application/pdf';
      case 'VIDEO':
        return 'video/*';
      case 'AUDIO':
        return 'audio/*';
      default:
        return '';
    }
  }


  onSubmit(): void {
    if (this.courseForm.invalid) return;
    
    if (!this.isEditMode && !this.selectedThumbnail) {
      alert('Thumbnail is required for new courses');
      return;
    }
  
    const formData = new FormData();
    const formValues = this.courseForm.value;
  
    // Append all fields
    formData.append('courseName', formValues.courseName);
    formData.append('courseDescription', formValues.courseDescription);
    formData.append('courseFormat', formValues.courseFormat);
    formData.append('pointsEarned', formValues.pointsEarned.toString());
  
    // Append files with field names matching backend expectations
    if (this.selectedThumbnail) {
      formData.append('thumbnail', this.selectedThumbnail, this.selectedThumbnail.name);
    }
    
    if (this.selectedFile) {
      formData.append('file', this.selectedFile, this.selectedFile.name);
    }
    if (this.selectedPdf) {
      formData.append('pdfFile', this.selectedPdf);
    }
    if (this.selectedVideo) {
      formData.append('videoFile', this.selectedVideo);
    }
  
    // Add debug output
    console.log('FormData entries:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });
  
    // Handle submission
    if (this.isEditMode && this.courseId) {
      this.courseService.updateCourse(this.courseId, formData).subscribe({
        next: () => this.router.navigate(['/backoffice/courseslist']),
        error: (err) => {
          console.error('Update error:', err);
          alert(`Error: ${err.error?.error || err.message}`);
        }
      });
    } else {
      this.courseService.createCourse(formData).subscribe({
        next: () => this.router.navigate(['/backoffice/courseslist']),
        error: (err) => {
          console.error('Creation error:', err);
          alert(`Error: ${err.error?.error || err.message}`);
        }
      });
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  isTeacherMenuOpen = false;

toggleTeacherMenu() {
    this.isTeacherMenuOpen = !this.isTeacherMenuOpen;
}





  
}