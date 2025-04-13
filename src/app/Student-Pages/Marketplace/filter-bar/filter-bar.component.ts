import {Component, EventEmitter, Output} from '@angular/core';
import {MarketplaceService} from "../services/marketplace.service";

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.css']
})
export class FilterBarComponent {
  categories: any[] = [];
  selectedCategory: string = '';

  // Émet l'événement de sélection vers le composant parent pour filtrer la liste
  @Output() categorySelected = new EventEmitter<string>();

  constructor(private marketplaceService: MarketplaceService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.marketplaceService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data; // On suppose que data est un tableau d'objets catégorie
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories', error);
      }
    });
  }

  onCategoryChange(): void {
    // Envoi de la catégorie sélectionnée au composant parent
    this.categorySelected.emit(this.selectedCategory);
  }
}
