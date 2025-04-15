import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LectureService } from 'src/app/backend/courses/Services/lecture.service';
import { Course } from 'src/app/model/course.model';
import { GlobalAlertService } from 'src/app/Service/global-alert.service';
import { CourseService } from '../../Services/course.service';

@Component({
  selector: 'app-lecture-creation-from',
  templateUrl: './lecture-creation-from.component.html',
  styleUrls: ['./lecture-creation-from.component.css']
})
export class LectureCreationFromComponent implements OnInit {
  lectureFormGroup!: FormGroup;
  get lecturesFormArray(): FormArray {
    return this.lectureFormGroup.get('lectures') as FormArray;
  }
  isMenuOpen = false;
  courseId!: number;
  course!: Course;
  existingLecturesCount: number = 0;  // New property to hold current lecture count
  selectedPdfFiles: (File | null)[] = [];
  selectedVideoFiles: (File | null)[] = [];
  pdfPreviews: string[] = [];
  videoPreviews: string[] = [];

  constructor(
    private fb: FormBuilder,
    private lectureService: LectureService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: GlobalAlertService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    // Fetch current lectures count for this course
    this.lectureService.getLecturesByCourseId(this.courseId).subscribe(lectures => {
      this.existingLecturesCount = lectures.length;
      // Optionally update the course's lecture count if your course object uses it:
      this.courseService.getCourseById(this.courseId).subscribe({
        next: (course) => {
          this.course = course;
          this.course.numberOfLectures = this.existingLecturesCount; // Update course info
          this.initializeForm();
        },
        error: (err) => console.error('Error loading course:', err)
      });
    });
  }

  initializeForm(): void {
    this.lectureFormGroup = this.fb.group({
      lectures: this.fb.array([])
    });
    // Start with one lecture form group
    this.addLectureFormGroup();
  }

  // Adds a new lecture form group and calculates order based on existing lectures count
  addLectureFormGroup(): void {
    // Use existing lectures count as base
    const order = this.existingLecturesCount + this.lecturesFormArray.length + 1;
    const lectureGroup = this.fb.group({
      lectureTitle: ['', Validators.required],
      lectureDescription: ['', Validators.required],
      lectureOrder: [order, [Validators.required, Validators.min(1)]]
    });
    this.lecturesFormArray.push(lectureGroup);
    this.selectedPdfFiles.push(null);
    this.selectedVideoFiles.push(null);
    this.pdfPreviews.push('');
    this.videoPreviews.push('');
  }

  // Remove a lecture form group and update orders accordingly
  removeLectureFormGroup(index: number): void {
    this.lecturesFormArray.removeAt(index);
    this.selectedPdfFiles.splice(index, 1);
    this.selectedVideoFiles.splice(index, 1);
    this.pdfPreviews.splice(index, 1);
    this.videoPreviews.splice(index, 1);
    this.updateLectureOrders();
  }

  // Update lecture orders based on existing lectures count
  updateLectureOrders(): void {
    for (let i = 0; i < this.lecturesFormArray.length; i++) {
      this.lecturesFormArray.at(i).get('lectureOrder')?.setValue(this.existingLecturesCount + i + 1);
    }
  }

  onPdfSelect(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedPdfFiles[index] = file;
      this.pdfPreviews[index] = URL.createObjectURL(file);
    }
  }

  onVideoSelect(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedVideoFiles[index] = file;
      this.videoPreviews[index] = URL.createObjectURL(file);
    }
  }

  submitLectures(): void {
    if (this.lectureFormGroup.invalid) {
      this.alertService.showAlert('Please fill all required lecture details', 'Validation Error');
      return;
    }

    const requests: Promise<any>[] = [];
    for (let i = 0; i < this.lecturesFormArray.length; i++) {
      const lectureGroup = this.lecturesFormArray.at(i);
      const formData = new FormData();
      formData.append('courseId', this.courseId.toString());
      formData.append('lectureTitle', lectureGroup.get('lectureTitle')?.value);
      formData.append('lectureDescription', lectureGroup.get('lectureDescription')?.value);
      formData.append('lectureOrder', lectureGroup.get('lectureOrder')?.value.toString());

      if (this.selectedPdfFiles[i]) {
        formData.append('pdfFile', this.selectedPdfFiles[i] as File, (this.selectedPdfFiles[i] as File).name);
      }
      if (this.selectedVideoFiles[i]) {
        formData.append('videoFile', this.selectedVideoFiles[i] as File, (this.selectedVideoFiles[i] as File).name);
      }
      requests.push(this.lectureService.createLecture(formData).toPromise());
    }

    Promise.all(requests)
      .then(() => {
        this.alertService.showAlert('Lectures created successfully', 'Success');
        this.router.navigate(['/backoffice/course-detail', this.courseId]);
      })
      .catch(err => {
        console.error('Error creating lectures', err);
        this.alertService.showAlert('Error creating lectures', 'Error');
      });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  isTeacherMenuOpen = false;
  toggleTeacherMenu(): void {
    this.isTeacherMenuOpen = !this.isTeacherMenuOpen;
  }
}
