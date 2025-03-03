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
    this.marketplaceService.applyCoupon(this.couponForm.get(['code'])!.value).subscribe(res => {
      this.snackBar.open("coupon applied successfully! ", 'Close', {
        duration: 5000
      });
      this.getCart();
    }, error => {
      this.snackBar.open(error.error, 'Close', {
        duration: 500
      })
    })
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

  placeOrder(){
    this.dialog.open(PlaceOrderComponent);
  }

}
