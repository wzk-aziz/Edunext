import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MarketplaceService } from "../../../Student-Pages/Marketplace/services/marketplace.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  listOfCategories: any = [];
  selectedFile: File = new File([], "placeholder.txt");
  imagepreview!: string | ArrayBuffer | null;
  selectedPdfFile: File | null = null;  // Ajout pour gérer le fichier PDF

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackbar: MatSnackBar,
    private marketplaceService: MarketplaceService
  ) { }

  // Fonction pour la sélection du fichier image
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.previewImage();
  }

  // Prévisualiser l'image sélectionnée
  previewImage() {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagepreview = reader.result;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  // Fonction pour la sélection du fichier PDF
  onPdfFileSelected(event: any) {
    this.selectedPdfFile = event.target.files[0];
  }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      categoryId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      price: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });
    this.getAllCategories();
  }

  getAllCategories() {
    this.marketplaceService.getAllCategories().subscribe(res => {
      this.listOfCategories = res;
    });
  }

  // Fonction pour ajouter un produit
  addProduct(): void {
    if (this.productForm.valid) {
      const formData: FormData = new FormData();
      formData.append('img', this.selectedFile);
      formData.append('categoryId', this.productForm.get('categoryId')?.value || '');
      formData.append('name', this.productForm.get('name')?.value || '');
      formData.append('description', this.productForm.get('description')?.value || '');
      formData.append('price', this.productForm.get('price')?.value || '');

      // Ajout du fichier PDF s'il est sélectionné
      if (this.selectedPdfFile) {
        formData.append('pdf', this.selectedPdfFile);
      }

      this.marketplaceService.addProduct(formData).subscribe((res) => {
        if (res.id != null) {
          this.snackbar.open('Product Posted Successfully!', 'close', {
            duration: 5000
          });
          this.router.navigate(['/backoffice/productBack']);
        } else {
          this.snackbar.open(res.message, 'ERROR', {
            duration: 5000
          });
        }
      });
    } else {
      for (const i in this.productForm.controls) {
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
