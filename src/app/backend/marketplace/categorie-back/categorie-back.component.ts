import { Component, OnInit } from '@angular/core';
import { MarketplaceService } from "../../../Student-Pages/Marketplace/services/marketplace.service";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: 'app-categorie-back',
  templateUrl: './categorie-back.component.html',
  styleUrls: ['./categorie-back.component.css']
})
export class CategorieBackComponent implements OnInit {
  categories: any[] = [];
  paginatedCategories: any[] = [];  // Tableau des catégories paginées
  isLoading: boolean = false;
  error: string = '';
  pageSize: number = 4; // Nombre de catégories par page
  currentPage: number = 1;
  totalPages: number = 1;
  allCategories: any[] = [];
  searchCategoryForm!: FormGroup;

  constructor(
    private marketplaceService: MarketplaceService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.searchCategoryForm = new FormGroup({
      name: new FormControl(''),  // Correspond maintenant à 'name' dans le formulaire
    });
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.marketplaceService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.totalPages = Math.ceil(this.categories.length / this.pageSize);  // Calcul du nombre total de pages
        this.updatePaginatedCategories();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des catégories';
        this.isLoading = false;
      }
    });
  }

  updatePaginatedCategories(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedCategories = this.categories.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedCategories();
  }

  getPages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToAddCategorie(): void {
    this.router.navigate(['/backoffice/add-categorie']);
  }

  getCategories(): void {
    this.marketplaceService.getAllCategories().subscribe((res) => {
      this.allCategories = res;
      this.categories = [...this.allCategories];
      this.totalPages = Math.ceil(this.categories.length / this.pageSize);
      this.updatePaginatedCategories();
    });
  }

  onSearchChange(): void {
    const searchValue = this.searchCategoryForm.get('name')?.value.trim().toLowerCase();
    console.log("Search Value: ", searchValue);  // Vérification de la valeur recherchée

    // Si la valeur de recherche est vide, on récupère toutes les catégories
    if (searchValue === '') {
      this.getCategories();
    } else {
      this.searchCategory(searchValue);  // Passer la valeur de recherche
    }
  }

  searchCategory(query: string): void {
    // Vérifiez si le champ de recherche est vide
    if (!query) {
      this.snackbar.open('Veuillez entrer un mot-clé pour la recherche.', 'Fermer', { duration: 3000 });
      return;
    }

    // Appelez la méthode du service pour rechercher les catégories
    this.marketplaceService.searchCategories(query).subscribe((res) => {
      console.log('Categories Search Result:', res);  // Affiche les résultats de la recherche

      this.allCategories = res.map((element: any) => ({
        ...element,
        processedImg: 'data:image/jpeg;base64,' + element.byteImg,
      }));

      this.categories = [...this.allCategories];
      this.totalPages = Math.ceil(this.categories.length / this.pageSize);
      this.updatePaginatedCategories();
    });
  }

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

  editCategory(categoryId: number): void {
    this.router.navigate(['/backoffice/edit-category', categoryId]);
  }

  isMenuOpen = false;
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  isTeacherMenuOpen = false;
  toggleTeacherMenu() {
    this.isTeacherMenuOpen = !this.isTeacherMenuOpen;
  }
}
