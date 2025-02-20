import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../Services/course.service';
import { Course } from 'src/app/model/course.model';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent {
  courseForm: FormGroup;
  selectedFile: File | null = null;
  isMenuOpen = false;

  constructor(private fb: FormBuilder, private courseService: CourseService) {
    this.courseForm = this.fb.group({
      courseName: ['', Validators.required],
      courseDescription: ['', Validators.required],
      courseFormat: ['', Validators.required],
      pointsEarned: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onFormatChange(event: any) {
    this.selectedFile = null; // Réinitialise le fichier si le format change
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit() {
    if (this.courseForm.invalid || !this.selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('courseName', this.courseForm.value.courseName);
    formData.append('courseDescription', this.courseForm.value.courseDescription);
    formData.append('courseFormat', this.courseForm.value.courseFormat);
    formData.append('pointsEarned', this.courseForm.value.pointsEarned);
    formData.append('file', this.selectedFile);

    this.courseService.createCourse(formData).subscribe({
      next: (response) => alert('Cours créé avec succès !'),
      error: (error) => console.error('Erreur lors de la création du cours', error)
    });
  }


  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  isTeacherMenuOpen = false;

toggleTeacherMenu() {
    this.isTeacherMenuOpen = !this.isTeacherMenuOpen;
}
}
