import { Component } from '@angular/core';
import {MarketplaceService} from "../services/marketplace.service";
import {MatSnackBar} from "@angular/material/snack-bar";

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

    getWishlist(){
        this.marketplaceService.getWishlist().subscribe(res=>{
            res.forEach((element:any) => {
                element.processedImg = 'data:image/jpeg;base64,'+element.returnedImg;
                this.products.push(element);
            });
        })
    }

  removeFromWishlist(wishlistId: number): void {
    this.marketplaceService.deleteFromWishlist(wishlistId).subscribe(
      () => {
        this.snackbar.open('Produit supprimé avec succès', 'Fermer', { duration: 2000 });
        this.getWishlist(); // 🔄 Recharge la liste depuis le serveur
      },
      (error) => {
        console.error("Erreur lors de la suppression de l'article de la wishlist :", error);
      }
    );
  }

}

