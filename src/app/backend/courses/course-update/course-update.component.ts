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
  selectedFile: File | null = null;
  courseId: number | null = null;

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

  ngOnInit(): void {
    this.courseId = this.route.snapshot.params['id'];
    if (this.courseId) {
      this.courseService.getCourseById(this.courseId).subscribe({
        next: (course) => this.courseForm.patchValue(course),
        error: (error) => console.error('Error loading course', error)
      });
    }
  }

  onFormatChange(event: any) {
    this.selectedFile = null; // Reset the file if the format changes
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit() {
    if (this.courseForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('courseName', this.courseForm.value.courseName);
    formData.append('courseDescription', this.courseForm.value.courseDescription);
    formData.append('courseFormat', this.courseForm.value.courseFormat);
    formData.append('pointsEarned', this.courseForm.value.pointsEarned);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    if (this.courseId) {
      this.courseService.updateCourse(this.courseId, formData).subscribe({
        next: () => {
          alert('Cours mis à jour avec succès !');
          this.router.navigate(['/courses']);
        },
        error: (error) => console.error('Erreur lors de la mise à jour du cours', error)
      });
    }
  }
}