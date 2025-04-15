import { CategoryService } from './../Services/category.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../Services/course.service';
import { CourseLevel, PackType } from 'src/app/model/course.model';
import { Category } from 'src/app/model/category.model';
import { GlobalAlertService } from 'src/app/Service/global-alert.service';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent implements OnInit, OnDestroy {
  @ViewChild('previewContainer') previewContainer: any;
  courseForm: FormGroup;
  thumbnailPreview: string | ArrayBuffer | null = null;
  isEditMode = false;
  courseId: number | null = null;
  selectedThumbnail: File | null = null;
  isMenuOpen = false;
  page: number = 1;
  categories: Category[] = [];

  // Inline category creation properties
  showNewCategory: boolean = false;
  newCategoryName: string = '';

  // Inline category editing properties
  editingCategory: boolean = false;
  editedCategoryName: string = '';

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private alertService: GlobalAlertService,
    private router: Router
  ) {
    // Initialize form with controls including new fields: duration and numberOfLectures.
    this.courseForm = this.fb.group({
      courseName: ['', Validators.required],
      courseDescription: ['', Validators.required],
      courseFormat: ['PDF', Validators.required],
      courseLevel: ['ALL_LEVELS', Validators.required],
      packType: [PackType.COPPER, Validators.required],
      pointsEarned: ['', [Validators.required, Validators.min(1)]],
      categoryId: [null, Validators.required],
      duration: ['', Validators.required],
      numberOfLectures: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.courseId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.courseId;
    // Load available categories
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        console.log('Fetched categories:', categories);
        this.categories = categories;
      },
      error: (err) => console.error('Error loading categories', err)
    });
    // If editing, load course data
    if (this.isEditMode && this.courseId) {
      this.courseService.getCourseById(this.courseId).subscribe({
        next: (course) => {
          this.courseForm.patchValue(course);
          if (course.category && course.category.id) {
            this.courseForm.get('categoryId')?.setValue(course.category.id);
          }
          if (course.thumbnailData) {
            this.thumbnailPreview = `data:image/png;base64,${course.thumbnailData}`;
          }
        },
        error: (error) => console.error('Error loading course', error)
      });
    }
  }

  ngOnDestroy(): void {
    // No file previews to revoke in this version
  }

  onThumbnailSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedThumbnail = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.thumbnailPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  getAcceptedFileTypes(): string {
    // Although courseFormat is still in the form, you may choose to show only the thumbnail file type.
    return 'image/*';
  }

  onSubmit(): void {
    if (this.courseForm.invalid) return;

    if (!this.isEditMode && !this.selectedThumbnail) {
      this.alertService.showAlert('Thumbnail is required for new courses', 'Validation Error');
      return;
    }

    const formData = new FormData();
    const formValues = this.courseForm.value;

    formData.append('courseName', formValues.courseName);
    formData.append('courseDescription', formValues.courseDescription);
    formData.append('courseFormat', formValues.courseFormat);
    formData.append('courseLevel', formValues.courseLevel);
    formData.append('packType', formValues.packType);
    formData.append('pointsEarned', formValues.pointsEarned.toString());
    formData.append('categoryId', formValues.categoryId);
    formData.append('duration', formValues.duration.toString());
    formData.append('numberOfLectures', formValues.numberOfLectures.toString());

    if (this.selectedThumbnail) {
      formData.append('thumbnail', this.selectedThumbnail, this.selectedThumbnail.name);
    }

    console.log('FormData entries:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    if (this.isEditMode && this.courseId) {
      this.courseService.updateCourse(this.courseId, formData).subscribe({
        next: () => this.router.navigate(['/backoffice/courseslist']),
        error: (err) => {
          console.error('Update error:', err);
          this.alertService.showAlert(`Error: ${err.error?.error || err.message}`, 'Update Failed');
        }
      });
    } else {
      this.courseService.createCourse(formData).subscribe({
        next: () => this.router.navigate(['/backoffice/courseslist']),
        error: (err) => {
          console.error('Creation error:', err);
          this.alertService.showAlert(`Error: ${err.error?.error || err.message}`, 'Creation Failed');
        }
      });
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  isTeacherMenuOpen = false;
  toggleTeacherMenu(): void {
    this.isTeacherMenuOpen = !this.isTeacherMenuOpen;
  }

  // Inline category creation methods
  toggleNewCategory(): void {
    this.showNewCategory = !this.showNewCategory;
    if (!this.showNewCategory) {
      this.newCategoryName = '';
    }
  }

  createNewCategory(): void {
    if (!this.newCategoryName.trim()) {
      this.alertService.showAlert('Category name is required', 'Validation Error');
      return;
    }
    const newCategory: Category = { name: this.newCategoryName.trim() };
    this.categoryService.createCategory(newCategory).subscribe({
      next: (createdCategory) => {
        console.log('Created category:', createdCategory);
        this.categories.push(createdCategory);
        this.courseForm.get('categoryId')?.setValue(createdCategory.id);
        this.toggleNewCategory();
      },
      error: (err) => console.error('Error creating category', err)
    });
  }

  // Inline category editing methods
  toggleEditCategory(): void {
    const selectedCategoryId = this.courseForm.get('categoryId')?.value;
    if (!selectedCategoryId) {
      this.alertService.showAlert('Please select a category to edit.', 'Validation Error');
      return;
    }
    const category = this.categories.find(c => c.id === selectedCategoryId);
    if (category) {
      this.editedCategoryName = category.name;
      this.editingCategory = true;
    }
  }

  updateCategory(): void {
    if (!this.editedCategoryName.trim()) {
      this.alertService.showAlert('Category name is required', 'Validation Error');
      return;
    }
    const selectedCategoryId = this.courseForm.get('categoryId')?.value;
    if (selectedCategoryId) {
      const updatedCategory: Category = {
        id: selectedCategoryId,
        name: this.editedCategoryName.trim()
      };
      this.categoryService.updateCategory(updatedCategory).subscribe({
        next: (cat) => {
          const index = this.categories.findIndex(c => c.id === cat.id);
          if (index !== -1) {
            this.categories[index] = cat;
          }
          this.courseForm.get('categoryId')?.setValue(cat.id);
          this.editingCategory = false;
          this.editedCategoryName = '';
        },
        error: (err) => console.error('Error updating category', err)
      });
    }
  }

  cancelEditCategory(): void {
    this.editingCategory = false;
    this.editedCategoryName = '';
  }

  deleteSelectedCategory(): void {
    const selectedCategoryId = this.courseForm.get('categoryId')?.value;
    if (!selectedCategoryId) {
      this.alertService.showAlert('No category selected to delete.', 'Validation Error');
      return;
    }
    this.alertService.showConfirm(
      'Are you sure you want to delete this category?',
      () => {
        this.categoryService.deleteCategory(selectedCategoryId).subscribe({
          next: () => {
            this.categories = this.categories.filter(c => c.id !== selectedCategoryId);
            this.courseForm.get('categoryId')?.setValue(null);
          },
          error: (err) => console.error('Error deleting category', err)
        });
      },
      () => { /* Do nothing on cancel */ },
      'Confirm Deletion'
    );
  }

  trackByCategoryId(index: number, category: Category): number {
    return category.id!;
  }
}
