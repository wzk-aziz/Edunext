import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MarketplaceService} from "../../../Student-Pages/Marketplace/services/marketplace.service";

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent {
  productForm!: FormGroup;
  listOfCategories: any = [];
  selectedFile: File = new File([], "placeholder.txt");
  imagepreview!: string | ArrayBuffer | null;
  productId = this.activatedRoute.snapshot.params['productId'];
  existingImage : string | null = null;

  imgChanged = false;



  constructor(
      private fb: FormBuilder,
      private router: Router,
      private snackbar: MatSnackBar,
      private marketplaceService: MarketplaceService,
      private activatedRoute: ActivatedRoute
  ) { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.previewImage();
    this.imgChanged = true;
    this.existingImage = null;
  }

  previewImage() {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagepreview = reader.result;
    }
    reader.readAsDataURL(this.selectedFile);
  }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      categoryId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      price: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });
    this.getAllCategories();
    this.getProductById();
  }

  getAllCategories() {
    this.marketplaceService.getAllCategories().subscribe(res => {
      this.listOfCategories = res;
    })
  }

  getProductById(){
    this.marketplaceService.getProductById(this.productId).subscribe(res=>{
      this.productForm.patchValue(res);
      this.existingImage = 'data:image/jpeg;base64,' + res.byteImg;
    })
  }

  updateProduct(): void {
    if (this.productForm.valid) {
      const formData: FormData = new FormData();

      if(this.imgChanged && this.selectedFile){
        formData.append('img', this.selectedFile);
      }

      formData.append('categoryId', this.productForm.get('categoryId')?.value || '');
      formData.append('name', this.productForm.get('name')?.value || '');
      formData.append('description', this.productForm.get('description')?.value || '');
      formData.append('price', this.productForm.get('price')?.value || '');
      this.marketplaceService.updateProduct(this.productId, formData).subscribe((res) => {
        if (res.id!=null) {
          this.snackbar.open('Product Updated Successfully!', 'close', {
            duration: 5000
          });
          this.router.navigate(['/backoffice/productBack']);
        } else {
          this.snackbar.open('Unexpected response status: ' + res.status, 'ERROR', {
            duration: 5000
          });
        }
      })
    } else {
      for (const i in this.productForm.contains) {
        this.productForm.controls[i].markAsDirty();
        this.productForm.controls[i].updateValueAndValidity();
      }
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
