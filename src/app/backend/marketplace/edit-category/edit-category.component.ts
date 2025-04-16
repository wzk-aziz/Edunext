import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MarketplaceService } from "../../../Student-Pages/Marketplace/services/marketplace.service";

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {

  categoryForm!: FormGroup;
  categoryId!: string | null;
  selectedFile: File | null = null;
  imagePreview!: string | ArrayBuffer | null;
  existingImage: string | null = null;
  imgChanged = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private marketplaceService: MarketplaceService
  ) { }

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('categoryId');
    console.log("Category ID:", this.categoryId); // Vérifier si l'ID est bien récupéré

    this.categoryForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });

    if (this.categoryId) {
      this.getCategoryById();
    }
  }


  getCategoryById(): void {
    this.marketplaceService.getCategoryById(this.categoryId).subscribe(
      (category) => {
        console.log("Category Data:", category); // Vérifier si les données sont bien récupérées
        if (category) {
          this.categoryForm.patchValue(category);
        }
      },
      (error) => {
        console.error('Erreur de récupération de la catégorie:', error);
      }
    );
  }


  updateCategory(): void {
    if (this.categoryForm.valid) {
      // Créer un objet avec les données du formulaire
      const categoryData = {
        name: this.categoryForm.get('name')?.value || '',
        description: this.categoryForm.get('description')?.value || ''
      };

      // Appel au service pour mettre à jour la catégorie
      this.marketplaceService.updateCategory(this.categoryId, categoryData).subscribe(
        (res) => {
          if (res.id != null) {
            // Si la mise à jour est réussie, afficher un message de succès
            this.snackbar.open('Catégorie mise à jour avec succès !', 'Fermer', { duration: 5000 });
            this.router.navigate(['/backoffice/categorieBack']);
          } else {
            // Si la réponse est inattendue, afficher un message d'erreur
            this.snackbar.open('Réponse inattendue: ' + res.status, 'Erreur', { duration: 5000 });
          }
        },
        (error) => {
          // Gestion des erreurs lors de la mise à jour
          console.error('Erreur lors de la mise à jour de la catégorie:', error);
          this.snackbar.open('Erreur lors de la mise à jour de la catégorie', 'Fermer', { duration: 5000 });
        }
      );
    } else {
      // Si le formulaire n'est pas valide, marquer tous les champs comme touchés
      this.categoryForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.router.navigate(['/backoffice/categorieBack']);
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
