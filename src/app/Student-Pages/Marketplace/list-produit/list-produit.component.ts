import { Component, OnInit } from '@angular/core';
import { MarketplaceService } from "../services/marketplace.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-list-produit',
  templateUrl: './list-produit.component.html',
  styleUrls: ['./list-produit.component.css']
})
export class ListProduitComponent implements OnInit {
  hover: boolean = false;
  clicked: boolean = false;
  paginatedProducts: any[] = [];
  currentPage: number = 1;
  pageSize: number = 4; // Nombre de produits par page
  totalPages: number = 1;
  products: any[] = [];
  wishlist: Set<number> = new Set(); // Un ensemble pour garder track des produits dans la wishlist
  productId: number = this.activatedRoute.snapshot.params["productId"];
  searchProductForm!: FormGroup;
  filterForm!: FormGroup;
  categories: any[] = [];
  totalProducts: number = 0;
  selectedSort: string = 'name'; // Default sort option

  constructor(
    private marketplaceService: MarketplaceService,
    private snackbar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.getCategories();  // Récupérer les catégories au démarrage
    this.getAllProducts();
    this.searchProductForm = this.fb.group({
      title: [null, [Validators.required]],
    });
    this.filterForm = this.fb.group({
      category: [null],
      sortBy: ['name']
    });
  }

  // Récupérer les catégories
  getCategories(): void {
    this.marketplaceService.getAllCategories().subscribe((res: any[]) => {
      this.categories = res;
    });
  }

  // Récupérer tous les produits
  getAllProducts(): void {
    this.marketplaceService.getAllProducts().subscribe(res => {
      this.products = res.map((element: any) => ({
        ...element,
        processedImg: 'data:image/jpeg;base64,' + element.byteImg,
      }));
      this.totalProducts = this.products.length; // Stocke le nombre total de produits
      this.totalPages = Math.ceil(this.products.length / this.pageSize);
      this.updatePaginatedProducts();
    });
  }

  // Mettre à jour les produits à afficher pour la page courante
  updatePaginatedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.products.slice(startIndex, endIndex);
  }

  // Changer de page
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedProducts();
  }

  // Calculer les pages à afficher dans la pagination
  getPages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  addToCart(productId: number): void {
    const addProductInCartDto = { productId };
    this.marketplaceService.addToCart(addProductInCartDto).subscribe(response => {
      console.log('Produit ajouté au panier', response);
    });
  }


    // Ajouter ou retirer un produit de la wishlist
    addToWishlist(productId: number): void {
        if (this.wishlist.has(productId)) {
            // Si le produit est déjà dans la wishlist, le retirer
            this.marketplaceService.deleteFromWishlist(productId).subscribe(
                (res) => {
                    if (res.success) { // Assurez-vous que la réponse contient un champ 'success' ou similaire
                        this.wishlist.delete(productId); // Supprimer localement le produit
                        this.snackbar.open('Product removed from wishlist', 'Close', { duration: 5000 });
                    } else {
                        // Si la suppression échoue côté serveur
                        this.snackbar.open('Failed to remove product from wishlist', 'Close', { duration: 5000 });
                    }
                },
                (error) => {
                    console.error('Error removing from wishlist:', error);
                    this.snackbar.open('Error removing from wishlist', 'Close', { duration: 5000 });
                }
            );
        } else {
            // Si le produit n'est pas dans la wishlist, l'ajouter
            const wishListDto = { productId };
            this.marketplaceService.addProductToWishlist(wishListDto).subscribe(
                (res) => {
                    if (res.id != null) {  // Assurez-vous que la réponse contient un champ 'id'
                        this.wishlist.add(productId);  // Ajouter le produit dans la wishlist localement
                        this.snackbar.open('Product added to wishlist successfully!', 'Close', { duration: 5000 });
                    } else {
                        // Si l'ajout échoue côté serveur
                        this.snackbar.open('Failed to add product to wishlist', 'Close', { duration: 5000 });
                    }
                },
                (error) => {
                    console.error('Error adding to wishlist:', error);
                    this.snackbar.open('Error adding to wishlist', 'Close', { duration: 5000 });
                }
            );
        }
    }


    // Méthode pour vérifier si le produit est dans la wishlist
    isInWishlist(productId: number): boolean {
        return this.wishlist.has(productId);
    }



// Méthode pour la recherche en temps réel
  searchProducts(): void {
    const query = this.searchProductForm.value.title; // Récupérer la valeur du champ de recherche
    if (!query) {
      this.snackbar.open('Veuillez entrer un mot-clé pour la recherche.', 'Fermer', { duration: 3000 });
      return;
    }
    this.marketplaceService.searchProducts(query).subscribe((res) => {
      this.products = res.map((element: any) => ({
        ...element,
        processedImg: 'data:image/jpeg;base64,' + element.byteImg,
      }));
      this.totalPages = Math.ceil(this.products.length / this.pageSize);
      this.updatePaginatedProducts();
    });
  }

  // Appliquer les filtres
    applyFilters(): void {
        const filters = this.filterForm.value;  // Récupère les valeurs du formulaire de filtres

        const category = filters.category || '';
        const sortBy = filters.sortBy || 'name';

        console.log('Filters applied:', { category, sortBy }); // Affiche les valeurs dans la console

        this.marketplaceService.getAllProductsByName({ category, sortBy }).subscribe(res => {
            if (res && res.length > 0) {
                this.products = res.map((element: any) => ({
                    ...element,
                    processedImg: 'data:image/jpeg;base64,' + element.byteImg,
                }));
                this.totalPages = Math.ceil(this.products.length / this.pageSize);
                this.updatePaginatedProducts();  // Mettre à jour les produits à afficher pour la page courante
            } else {
                this.products = [];
                this.totalPages = 1;
                this.updatePaginatedProducts();
                this.snackbar.open('Aucun produit trouvé avec ces critères.', 'Fermer', { duration: 3000 });
            }
        });
    }



    // Fonction d'appel en temps réel pour la recherche
  onSearchChange(): void {
    const searchValue = this.searchProductForm.get('title')?.value.trim().toLowerCase();
    if (searchValue === '') {
      this.getAllProducts(); // Recharge tous les produits si la recherche est vide
    } else {
      this.searchProducts();
    }
  }
}
