import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Lecture } from 'src/app/model/Lecture.model';
import { LectureService } from '../../Services/lecture.service';
import { GlobalAlertService } from 'src/app/Service/global-alert.service';

@Component({
  selector: 'app-lectureupdate',
  templateUrl: './lectureupdate.component.html',
  styleUrls: ['./lectureupdate.component.css']
})
export class LectureupdateComponent {
  lectureForm: FormGroup;
  lectureId: number | null = null;
  lecture: Lecture | null = null;
  courseId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private lectureService: LectureService,
    private alertService: GlobalAlertService
  ) {
    // Initialize the form group
    this.lectureForm = this.fb.group({
      lectureTitle: ['', Validators.required],
      lectureDescription: ['', Validators.required],
      lectureOrder: [1, [Validators.required, Validators.min(1)]],
      pdfFile: [null],
      videoFile: [null]
    });
  }

  ngOnInit(): void {
    // Get lecture ID and course ID from route params
    this.lectureId = this.route.snapshot.params['lectureId'];
    this.courseId = this.route.snapshot.params['courseId'];
    if (this.lectureId) {
      this.loadLectureData();
    }
  }

  loadLectureData(): void {
    // Fetch the lecture data from the service
    this.lectureService.getLectureById(this.lectureId!).subscribe({
      next: (lecture) => {
        this.lecture = lecture;
        // Populate the form with the fetched lecture data
        this.lectureForm.patchValue({
          lectureTitle: this.lecture.lectureTitle,
          lectureDescription: this.lecture.lectureDescription,
          lectureOrder: this.lecture.lectureOrder
        });
      },
      error: (err) => {
        console.error('Error fetching lecture:', err);
        this.alertService.showAlert('Error loading lecture data', 'Error');
      }
    });
  }

  onSubmit(): void {
    if (this.lectureForm.invalid) {
      return;
    }

    if (this.lectureId === null) {
      this.alertService.showAlert('Invalid lecture ID', 'Error');
      return;
    }

    // Prepare the form data
    const formData = new FormData();
    formData.append('courseId', this.courseId!.toString());
    formData.append('lectureTitle', this.lectureForm.get('lectureTitle')?.value);
    formData.append('lectureDescription', this.lectureForm.get('lectureDescription')?.value);
    formData.append('lectureOrder', this.lectureForm.get('lectureOrder')?.value);

    // If there's a file (pdf or video), add them to the form data
    const pdfFile = this.lectureForm.get('pdfFile')?.value;
    const videoFile = this.lectureForm.get('videoFile')?.value;

    if (pdfFile) formData.append('pdfFile', pdfFile);
    if (videoFile) formData.append('videoFile', videoFile);

    // Update the lecture via the service
    this.lectureService.updateLecture(this.lectureId, formData).subscribe({
      next: () => {
        this.alertService.showAlert('Lecture updated successfully', 'Success');
        this.router.navigate([`/backoffice/view-lectures`]); // Redirect to course detail
      },
      error: (err) => {
        console.error('Error updating lecture:', err);
        this.alertService.showAlert('Error updating lecture', 'Error');
      }
    });
  }

  // Handle file selection for PDF or Video
  onPdfSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.lectureForm.patchValue({ pdfFile: file });
    }
  }

  onVideoSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.lectureForm.patchValue({ videoFile: file });
    }
  }
  isMenuOpen = false;
 
  isTeacherMenuOpen = false;
 

 
  isVirtualClassroomMenuOpen = false;
  isVirtualClassroomSubMenuOpen = false;
  isLiveTutoringSubMenuOpen = false;


  isCodingGameMenuOpen = false;
  isForumMenuOpen = false;
  showSubMenu = false;


  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }


  toggleTeacherMenu() {
    this.isTeacherMenuOpen = !this.isTeacherMenuOpen;

  }
  toggleCoursesMenu() {
    this.isMenuOpenCourses = !this.isMenuOpenCourses;

  }

  toggleMenuForum() {
    this.isForumMenuOpen = !this.isForumMenuOpen;

  }

  toggleVirtualClassroomMenu() {
    this.isVirtualClassroomMenuOpen = !this.isVirtualClassroomMenuOpen;
  }

  toggleVirtualClassroomSubMenu() {
    this.isVirtualClassroomSubMenuOpen = !this.isVirtualClassroomSubMenuOpen;
  }

  toggleLiveTutoringSubMenu() {
    this.isLiveTutoringSubMenuOpen = !this.isLiveTutoringSubMenuOpen;
  }



isCertificatMenuOpen = false;
isExamMenuOpen=false;
isMenuOpenCourses=false;
toggleExamMenu() {
  this.isExamMenuOpen = !this.isExamMenuOpen;
}

toggleCertificatMenu() {
this.isCertificatMenuOpen = !this.isCertificatMenuOpen;
}




  toggleCodingGameMenu() {
    this.isCodingGameMenuOpen = !this.isCodingGameMenuOpen;
  }

  toggleForumMenu(): void {
    this.isForumMenuOpen = !this.isForumMenuOpen;
  }

  toggleSubMenu() {
    this.showSubMenu = !this.showSubMenu;
  }

}
