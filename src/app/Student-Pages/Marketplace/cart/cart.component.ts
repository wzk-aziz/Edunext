import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MarketplaceService} from "../services/marketplace.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {PlaceOrderComponent} from "../place-order/place-order.component";
import {AuthenticationService} from "../../../Shared/services/authentication.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {



  cartItems: any[] = [];
  order: any;
  couponForm!: FormGroup;

  constructor(private marketplaceService: MarketplaceService,
              private authService: AuthenticationService,
              private snackBar: MatSnackBar,
              private snackbar: MatSnackBar,
              private fb: FormBuilder,
              public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.couponForm = this.fb.group({
      code: [null, [Validators.required]],
    });
    this.getCart();
  }

  applyCoupon() {
    const couponCode = this.couponForm.get(['code'])!.value;
    const userId = this.authService.getUserId(); // À adapter selon ta logique d'auth

    this.marketplaceService.applyCoupon(userId, couponCode).subscribe({
      next: (res) => {
        this.snackBar.open("Coupon applied successfully!", 'Close', {
          duration: 5000
        });
        this.getCart(); // Mise à jour du panier
      },
      error: (error) => {
        if (typeof error.error === 'string' && error.error.includes("expired")) {
          this.snackBar.open("Coupon expired. Please use a valid coupon.", 'Close', {
            duration: 5000
          });
        } else {
          this.snackBar.open(error.error?.message || "An error occurred. Please try again.", 'Close', {
            duration: 5000
          });
        }
      }
    });
  }


  getCart() {
    this.cartItems = [];

    const userId = this.authService.getUserId(); // Assure-toi que cette méthode existe et fonctionne

    if (!userId) {
      this.snackbar.open('Utilisateur non connecté.', 'Fermer', { duration: 3000 });
      return;
    }

    this.marketplaceService.getCart(userId).subscribe(res => {
      console.log('Cart Items:', res.cartItems);
      this.order = res;

      res.cartItems.forEach((element: { processedImg: string; returnedImage: string; }) => {
        element.processedImg = 'data:image/jpeg;base64,' + element.returnedImage;
        this.cartItems.push(element);
      });
    }, error => {
      console.error('Erreur lors de la récupération du panier :', error);
      this.snackbar.open('Erreur lors de la récupération du panier.', 'Fermer', { duration: 3000 });
    });
  }



  increaseQuantity(productId: any) {
    const userId = this.authService.getUserId();
    this.marketplaceService.increaseProductQuantity(productId, userId).subscribe(res => {
      this.snackBar.open('Product quantity increased.', 'Close', {
        duration: 5000
      });
      this.getCart();
    });
  }

  decreaseQuantity(productId: any) {
    const userId = this.authService.getUserId();
    this.marketplaceService.decreaseProductQuantity(productId, userId).subscribe(res => {
      this.snackBar.open('Product quantity decreased.', 'Close', {
        duration: 5000
      });
      this.getCart();
    });
  }


  placeOrder() {
    // Calculate the total amount from cart items
    let totalAmount = this.cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);  // Assuming each item has 'price' and 'quantity'
    }, 0);

    // Open the PlaceOrderComponent dialog and pass the totalAmount
    const dialogRef = this.dialog.open(PlaceOrderComponent, {
      data: {
        totalAmount: totalAmount  // Pass totalAmount to the PlaceOrderComponent
      }
    });
  }



}
