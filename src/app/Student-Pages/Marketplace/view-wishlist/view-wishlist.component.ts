import { Component } from '@angular/core';
import { MarketplaceService } from "../services/marketplace.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-view-wishlist',
  templateUrl: './view-wishlist.component.html',
  styleUrls: ['./view-wishlist.component.css']
})
export class ViewWishlistComponent {
  products: any[] = [];

  constructor(private marketplaceService: MarketplaceService,
              private snackbar: MatSnackBar) { }

  ngOnInit(){
    this.getWishlist();
  }

  getWishlist() {
    this.marketplaceService.getWishlist().subscribe(
      res => {
        res.forEach((element: any) => {
          // Si wishlistId est manquant, on ignore ou on affecte une valeur par défaut
          if (!element.productId) {
            console.error('productId manquant pour le produit', element);
          }
          // Vérifier la présence de l'image et la transformer
          if (element.returnedImg) {
            element.processedImg = 'data:image/jpeg;base64,' + element.returnedImg;
          }
          this.products.push(element); // Ajouter à la liste des produits
        });
      },
      error => {
        console.error("Erreur lors du chargement de la wishlist:", error);
        this.snackbar.open("Une erreur est survenue lors du chargement de la wishlist", "Fermer", { duration: 3000 });
      }
    );
  }

  // Modification de la méthode de suppression en utilisant productId
  removeFromWishlist(productId: number): void {
    if (!productId) {
      console.error("productId est invalide :", productId);
      return;
    }

    const index = this.products.findIndex(p => p.productId === productId);  // Rechercher par productId

    if (index === -1) {
      console.error("Produit non trouvé pour productId :", productId);
      return;
    }

    console.log("Suppression du produit avec productId :", productId);

    // Suppression du produit via le service backend
    this.marketplaceService.deleteFromWishlist(productId).subscribe(
      () => {
        this.snackbar.open('Produit supprimé avec succès', 'Fermer', { duration: 2000 });
        this.products.splice(index, 1);  // Supprimer de la liste locale
      },
      (error) => {
        console.error("Erreur lors de la suppression de l'article de la wishlist :", error);
      }
    );
  }
}
