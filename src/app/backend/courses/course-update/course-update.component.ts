import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../Services/course.service';
import { Course } from 'src/app/model/course.model';
import { Category } from 'src/app/model/category.model';
import { CategoryService } from '../Services/category.service';

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

  // For category dropdown and inline editing
  categories: Category[] = [];
  editingCategory: boolean = false;
  editedCategoryName: string = '';
  selectedCategoryId: number | null = null;


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private categoryService: CategoryService
    
  ) {
    // Initialize the reactive form including new fields: packType, duration, and numberOfLectures.
    this.courseForm = this.fb.group({
      courseName: ['', Validators.required],
      courseDescription: ['', Validators.required],
      courseLevel: ['ALL_LEVELS', Validators.required],
      packType: ['', Validators.required],
      pointsEarned: [1, [Validators.required, Validators.min(1)]],
      duration: ['', Validators.required],
      numberOfLectures: ['', [Validators.required, Validators.min(1)]],
      categoryId: [null, Validators.required]
      // File inputs (thumbnail, pdfFile, videoFile) are handled separately.
    });
  }

  ngOnInit(): void {
    this.courseId = this.route.snapshot.params['id'];
    this.loadCourseData();
    this.loadCategories();

  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => this.categories = categories,
      error: (err) => console.error('Error loading categories:', err)
    });
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
      courseLevel: course.courseLevel,
      packType: course.packType,
      pointsEarned: course.pointsEarned,
      duration: course.duration,
      numberOfLectures: course.numberOfLectures,
      categoryId: course.category ? course.category.id : null
    });
    // Set current file previews if available
    if (course.thumbnailFileName) {
      this.thumbnailPreview = `data:${course.thumbnailFileType};base64,${course.thumbnailData}`;
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
    formData.append('courseLevel', this.courseForm.get('courseLevel')?.value);
    formData.append('packType', this.courseForm.get('packType')?.value);
    formData.append('pointsEarned', this.courseForm.get('pointsEarned')?.value.toString());
    formData.append('duration', this.courseForm.get('duration')?.value.toString());
    formData.append('numberOfLectures', this.courseForm.get('numberOfLectures')?.value.toString());
    formData.append('categoryId', this.courseForm.get('categoryId')?.value);


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
        this.router.navigate(['/backoffice/courseslist']);
      },
      error: (err) => console.error('Update failed:', err)
    });
  }

   // Inline category editing methods

   toggleEditCategory(): void {
    const currentCategoryId = this.courseForm.get('categoryId')?.value;
    if (!currentCategoryId) {
      alert("Please select a category to edit.");
      return;
    }
    // Find the selected category from the list
    const category = this.categories.find(c => c.id === currentCategoryId);
    if (category) {
      this.selectedCategoryId = category.id!;
      this.editedCategoryName = category.name;
      this.editingCategory = true;
    }
  }

  updateCategory(): void {
    if (!this.editedCategoryName.trim()) {
      alert("Category name is required");
      return;
    }
    if (this.selectedCategoryId) {
      const updatedCategory: Category = {
        id: this.selectedCategoryId,
        name: this.editedCategoryName.trim()
      };
      this.categoryService.updateCategory(updatedCategory).subscribe({
        next: (cat) => {
          // Update local array
          const index = this.categories.findIndex(c => c.id === cat.id);
          if (index !== -1) {
            this.categories[index] = cat;
          }
          this.courseForm.get('categoryId')?.setValue(cat.id);
          this.editingCategory = false;
          this.editedCategoryName = '';
        },
        error: (err) => console.error("Error updating category", err)
      });
    }
  }

  cancelEditCategory(): void {
    this.editingCategory = false;
    this.editedCategoryName = '';
  }

  // TrackBy function (optional)
  trackByCategoryId(index: number, category: Category): number {
    return category.id!;
  }


  
  isVirtualClassroomMenuOpen = false;
  isVirtualClassroomSubMenuOpen = false;
  isLiveTutoringSubMenuOpen = false;


  isCodingGameMenuOpen = false;
  isForumMenuOpen = false;
  showSubMenu = false;


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
