import { Component, OnInit } from '@angular/core';
import {MarketplaceService} from "../../../Student-Pages/Marketplace/services/marketplace.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
  // Assurez-vous d'importer le service

@Component({
  selector: 'app-categorie-back',
  templateUrl: './categorie-back.component.html',
  styleUrls: ['./categorie-back.component.css']
})
export class CategorieBackComponent implements OnInit {
  categories: any[] = [];  // Tableau pour stocker les catégories
  isLoading: boolean = false;  // Variable pour indiquer si les données sont en cours de chargement
  error: string = '';  // Variable pour gérer les erreurs


  constructor(private marketplaceService: MarketplaceService,
  private router: Router,
              private snackbar: MatSnackBar  // Utilisation de MatSnackBar pour afficher des notifications
  ) {}

  ngOnInit(): void {
    this.loadCategories();  // Charger les catégories au démarrage du composant
  }

  loadCategories(): void {
    this.isLoading = true;
    this.marketplaceService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;  // Assurez-vous que 'data' contient bien les catégories
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des catégories';
        this.isLoading = false;
      }
    });
  }
  goToAddCategorie(): void {
    this.router.navigate(['/backoffice/add-categorie']);
  }


  /**
   * Supprime une catégorie et met à jour la liste après suppression
   */
  deleteCategory(categoryId: number): void {
    this.marketplaceService.deleteCategory(categoryId).subscribe(
        () => {
          this.snackbar.open('Catégorie supprimée avec succès', 'Fermer', { duration: 2000 });
          this.loadCategories();  // Rafraîchit la liste après suppression
        },
        (error) => {
          console.error('Erreur lors de la suppression', error);
          this.snackbar.open('Erreur lors de la suppression de la catégorie', 'Fermer', { duration: 2000 });
        }
    );
  }
  isMenuOpen = false;

  editCategory(categoryId: number): void {
    this.router.navigate(['/backoffice/edit-category', categoryId]);
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  isTeacherMenuOpen = false;

  toggleTeacherMenu() {
    this.isTeacherMenuOpen = !this.isTeacherMenuOpen;
  }
}
