import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MarketplaceService } from '../services/marketplace.service';
import { Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentServiceService } from "../../Donnation/services/payment-service.service";
import {AuthenticationService} from "../../../Shared/services/authentication.service";

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent implements OnInit {
  orderForm!: FormGroup;
  stripeClientSecret: string = '';  // Store the client secret
  stripe: any;  // Stripe instance
  elements: any;  // Stripe Elements instance
  cardElement: any;  // Card element
  cardError: string = '';  // Error message for card payment
  totalAmount: number;  // Total Amount passed from CartComponent


  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private marketplaceService: MarketplaceService,
    private paymentService: PaymentServiceService,  // Inject Payment service
    private authService: AuthenticationService,
    private router: Router,
    private dialog: MatDialog,

    @Inject(MAT_DIALOG_DATA) public data: any  // Inject the data passed from CartComponent
  ) {
    this.totalAmount = data.totalAmount;  // Retrieve the totalAmount passed from CartComponent
  }

  async ngOnInit() {
    // Initialize Stripe
    this.stripe = await this.paymentService.getStripe();
    if (!this.stripe) {
      console.error("Error: Could not load Stripe!");
      return;
    }

    // Initialize Stripe Elements
    this.elements = this.stripe.elements();
    const cardContainer = document.getElementById('card-element');
    if (cardContainer) {
      this.cardElement = this.elements.create('card');
      this.cardElement.mount('#card-element');
    } else {
      console.error("Error: #card-element not found!");
    }

    // Initialize the order form
    this.orderForm = this.fb.group({
      address: [null, [Validators.required]],
      orderDescription: [null],
      orderAmount: [this.totalAmount, [Validators.required, Validators.min(1)]],  // Use totalAmount here
    });
  }

  placeOrder() {
    const orderAmount = this.orderForm.get('orderAmount')?.value;  // Get dynamic amount

    if (!orderAmount || orderAmount <= 0) {
      this.snackBar.open("Invalid order amount.", 'Close', { duration: 5000 });
      return;
    }

    // Create PaymentIntent with the dynamic amount
    this.paymentService.createPaymentIntent(orderAmount * 1, 'usd').subscribe((response) => {
      if (!response.clientSecret) {
        console.error("Error: Client Secret not found!");
        return;
      }

      this.stripeClientSecret = response.clientSecret;

      // Confirm payment with Stripe
      this.stripe.confirmCardPayment(this.stripeClientSecret, {
        payment_method: { card: this.cardElement }
      }).then((result: any) => {
        if (result.error) {
          console.error("Payment Error:", result.error);
          this.snackBar.open("Payment failed, please try again.", 'Close', { duration: 5000 });
        } else if (result.paymentIntent.status === 'succeeded') {
          // If payment succeeded, place the order
          const userId = this.authService.getUserId(); // Récupérer l'ID utilisateur depuis le service d'authentification

          if (!userId) {
            this.snackBar.open('User not logged in', 'Close', { duration: 5000 });
            return;
          }

          const orderData = {
            address: this.orderForm.get('address')?.value,
            orderDescription: this.orderForm.get('orderDescription')?.value,
            totalAmount: this.totalAmount,
          };

          // Now pass both the userId and orderData to placeOrder
          this.marketplaceService.placeOrder(userId, orderData).subscribe((res) => {
            if (res.id != null) {
              this.snackBar.open("Order placed successfully", 'Close', { duration: 5000 });
              this.router.navigateByUrl("/produitList");
              this.closeForm();
            } else {
              this.snackBar.open("An error occurred.", 'Close', { duration: 5000 });
            }
          });
        }
      }).catch((error: any) => {
        console.error("Error during payment confirmation", error);
        this.snackBar.open("Payment confirmation failed", 'Close', { duration: 5000 });
      });
    });
  }


  closeForm() {
    this.dialog.closeAll();
  }
}

