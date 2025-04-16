import { Component, OnInit } from '@angular/core';
import { MarketplaceService } from "../services/marketplace.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {AuthenticationService} from "../../../Shared/services/authentication.service";

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
  filteredProducts: any[] = [];
  allProducts: any[] = [];


  constructor(
    private marketplaceService: MarketplaceService,
    private authService: AuthenticationService,
    private snackbar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.getCategories();  // Récupérer les catégories au démarrage
    const userId = this.authService.getUserId();
    this.loadWishlist(userId);   // Charger l'état de la wishlist depuis le backend ou autre source persistante
    this.getAllProducts();
    this.searchProductForm = this.fb.group({
      title: [null, [Validators.required]],
    });
    this.filterForm = this.fb.group({
      category: [null],
      sortBy: ['name']
    });
  }

  downloadPdf(productId: number): void {
    this.marketplaceService.downloadProductPdf(productId).subscribe(
      (response: Blob) => {
        // Créez un lien pour télécharger le fichier PDF
        const blob = response;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `product_${productId}.pdf`; // Nom du fichier PDF à télécharger
        a.click();
        window.URL.revokeObjectURL(url); // Libère la ressource
      },
      (error) => {
        console.error('Erreur lors du téléchargement du PDF', error);
      }
    );
  }
  loadWishlist(userId: number): void {
    // Charger la wishlist depuis le service (qui combine localStorage et backend)
    this.marketplaceService.getWishlist(userId).subscribe({
      next: (wishlist: number[]) => {
        this.wishlist = new Set(wishlist);  // Charger les produits dans la wishlist
        console.log("Wishlist chargée", this.wishlist);
      },
      error: (err) => {
        console.error("Erreur lors du chargement de la wishlist :", err);
        // En cas d'erreur, on peut toujours essayer de récupérer depuis localStorage
        const localWishlist = localStorage.getItem('user_wishlist_items');
        if (localWishlist) {
          this.wishlist = new Set(JSON.parse(localWishlist));
        }
      }
    });
  }

  isInWishlist(productId: number): boolean {
    return this.wishlist.has(productId);
  }


  // Récupérer les catégories
  // Récupérer les catégories depuis l'API
  getCategories(): void {
    this.marketplaceService.getAllCategories().subscribe({
      next: (res: any[]) => {
        console.log("Catégories reçues :", res);
        this.categories = res;
      },
      error: (err) => console.error("Erreur lors de la récupération des catégories :", err)
    });
  }

  // Récupérer tous les produits depuis l'API
  getAllProducts(): void {
    this.marketplaceService.getAllProducts().subscribe({
      next: (res: any[]) => {
        // Traitez chaque produit
        this.products = res.map((element: any) => ({
          ...element,
          processedImg: 'data:image/jpeg;base64,' + element.byteImg,
        }));
        this.allProducts = this.products;
        this.totalProducts = this.products.length;
        this.totalPages = Math.ceil(this.products.length / this.pageSize);
        this.updatePaginatedProducts();
        console.log("Produits reçus :", this.products);
      },
      error: (err) => console.error("Erreur lors de la récupération des produits :", err)
    });
  }


  // Récupérer tous les produits


  // Mettre à jour les produits à afficher pour la page courante
  updatePaginatedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.products.slice(startIndex, endIndex);
  }


    toggleWishlist(productId: number): void {
        const userId = this.authService.getUserId(); // Assure-toi que ça retourne bien un ID
        if (this.wishlist.has(productId)) {
            this.marketplaceService.deleteFromWishlist(userId, productId).subscribe({
                next: () => {
                    this.wishlist.delete(productId);
                    this.snackbar.open('Produit retiré de la wishlist', 'Fermer', { duration: 3000 });
                },
                error: (error) => {
                    console.error('Erreur lors de la suppression de la wishlist :', error);
                    this.snackbar.open('Erreur lors de la suppression de la wishlist', 'Fermer', { duration: 3000 });
                }
            });
        } else {
            const wishlistDto = { productId };
            this.marketplaceService.addProductToWishlist(userId, wishlistDto).subscribe({
                next: () => {
                    this.wishlist.add(productId);
                    this.snackbar.open('Produit ajouté à la wishlist', 'Fermer', { duration: 3000 });
                },
                error: (error) => {
                    console.error('Produit déja existe dans la wishlist :', error);
                    this.snackbar.open('Produit déja existe dans la wishlist !', 'Fermer', { duration: 3000 });
                }
            });
        }
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
  // Filtrer les produits selon la catégorie sélectionnée
  filterProductsByCategory(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedCategory = target.value;

    // Si une catégorie est sélectionnée, appliquez le filtre
    this.applyCategoryFilter(selectedCategory);
  }


  applyCategoryFilter(selectedCategory: string): void {
    if (selectedCategory) {
      // Filtrage des produits en fonction de categoryName, et non de category
      this.products = this.allProducts.filter(
        product => product.categoryName === selectedCategory
      );
    } else {
      // Si aucune catégorie n'est sélectionnée, affichez tous les produits
      this.products = this.allProducts;
    }

    // Mettez à jour le nombre de produits et la pagination
    this.totalProducts = this.products.length;
    this.totalPages = Math.ceil(this.products.length / this.pageSize);
    this.currentPage = 1;
    this.updatePaginatedProducts();
  }

  addToCart(productId: number): void {
    const userId = this.authService.getUserId(); // Assure-toi que ça renvoie bien l’ID de l’utilisateur connecté

    if (!userId) {
      this.snackbar.open('Vous devez être connecté pour ajouter au panier.', 'Fermer', { duration: 3000 });
      return;
    }

    const cartDto = { productId };

    this.marketplaceService.addToCart(userId, cartDto).subscribe({
      next: () => {
        this.snackbar.open('Produit ajouté au panier avec succès!', 'Fermer', { duration: 3000 });
      },
      error: (error) => {
        console.error('Produit ajouté au panier avec succès! :', error);
        this.snackbar.open('Produit ajouté au panier avec succès!', 'Fermer', { duration: 3000 });
      }
    });

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
