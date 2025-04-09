import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MarketplaceService} from "../services/marketplace.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {PlaceOrderComponent} from "../place-order/place-order.component";

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
              private snackBar: MatSnackBar,
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

    this.marketplaceService.applyCoupon(couponCode).subscribe(res => {
      this.snackBar.open("Coupon applied successfully!", 'Close', {
        duration: 5000
      });
      this.getCart(); // Mettre à jour le panier après l'application du coupon
    }, error => {
      // Vérifier si error.error est une chaîne et contient "expired"
      if (typeof error.error === 'string' && error.error.includes("expired")) {
        this.snackBar.open("Coupon expired. Please use a valid coupon.", 'Close', {
          duration: 5000
        });
      } else {
        // Si error.error n'est pas une chaîne, vérifier si c'est un objet ou autre
        this.snackBar.open(error.error?.message || "An error occurred. Please try again.", 'Close', {
          duration: 5000
        });
      }
    });
  }



  getCart() {
    this.cartItems = [];
    this.marketplaceService.getCart().subscribe(res => {
      console.log('Cart Items:', res.cartItems); // Vérifier combien d'articles sont retournés
    });

    this.marketplaceService.getCart().subscribe(res => {
      this.order = res;
      res.cartItems.forEach((element: { processedImg: string; returnedImage: string; }) => {
        element.processedImg = 'data:image/jpeg;base64,' + element.returnedImage;
        this.cartItems.push(element);
      });
    });
  }



  increaseQuantity(productId:any){
    this.marketplaceService.increaseProductQuantity(productId).subscribe(res=>{
      this.snackBar.open('Product quantity increased. ','Close',{
        duration:5000
      });
      this.getCart();
    })
  }

  decreaseQuantity(productId:any){
    this.marketplaceService.decreaseProductQuantity(productId).subscribe(res=>{
      this.snackBar.open('Product quantity decreased. ','Close',{
        duration:5000
      });
      this.getCart();
    })
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
