import { Component } from '@angular/core';
import { MarketplaceService } from "../services/marketplace.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import {AuthenticationService} from "../../../Shared/services/authentication.service";

@Component({
  selector: 'app-view-wishlist',
  templateUrl: './view-wishlist.component.html',
  styleUrls: ['./view-wishlist.component.css']
})
export class ViewWishlistComponent {
  products: any[] = [];

  constructor(private marketplaceService: MarketplaceService,
              private authService: AuthenticationService,
              private snackbar: MatSnackBar) { }

  ngOnInit() {
    const userId = this.authService.getUserId(); // Récupérer l'ID de l'utilisateur connecté
    console.log("UserId récupéré:", userId);  // Ajoute un log pour vérifier l'ID
    if (userId) {
      this.getWishlist(userId);
    } else {
      console.error("Utilisateur non connecté !");
      this.snackbar.open("Veuillez vous connecter pour voir la wishlist.", "Fermer", { duration: 3000 });
    }
  }


  getWishlist(userId: number) {
    this.marketplaceService.getWishlist(userId).subscribe(
      res => {
        console.log("Réponse de la wishlist:", res);  // Log pour inspecter la réponse
        res.forEach((element: any) => {
          if (!element.productId) {
            console.error('productId manquant pour le produit', element);
          }
          if (element.returnedImg) {
            element.processedImg = 'data:image/jpeg;base64,' + element.returnedImg;
          }
          this.products.push(element);
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

    const index = this.products.findIndex(p => p.productId === productId);

    if (index === -1) {
      console.error("Produit non trouvé pour productId :", productId);
      return;
    }

    console.log("Suppression du produit avec productId :", productId);

    const userId = this.authService.getUserId(); // Récupérer l'ID de l'utilisateur connecté

    this.marketplaceService.deleteFromWishlist(userId, productId).subscribe(
      () => {
        this.snackbar.open('Produit supprimé avec succès', 'Fermer', { duration: 2000 });
        this.products.splice(index, 1); // Supprimer localement
      },
      (error) => {
        console.error("Erreur lors de la suppression de l'article de la wishlist :", error);
      }
    );
  }
}
