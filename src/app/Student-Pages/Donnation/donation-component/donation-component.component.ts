import { Component, OnInit } from '@angular/core';
import { PaymentServiceService } from "../services/payment-service.service";
import { loadStripe, Stripe, StripeElements, StripeCardElement } from "@stripe/stripe-js";

@Component({
  selector: 'app-donation-component',
  templateUrl: './donation-component.component.html',
  styleUrls: ['./donation-component.component.css']
})
export class DonationComponentComponent implements OnInit {
  stripe!: Stripe | null;
  elements!: StripeElements | null;
  cardElement!: StripeCardElement | null;
  clientSecret: string = '';
  amount: number = 100;
  currency: string = 'USD';

  constructor(private paymentService: PaymentServiceService) {}

  async ngOnInit() {
    this.stripe = await loadStripe('pk_test_51QwtvpR88uyR8EQrqAq8qSIJ61ZsTAUtltcDU3EDqhVBgvQFVH08F5SUsngiPiu2AHTsx5feb7ejgLmfpNDQLiyN00hpHvt7Wk');

    if (!this.stripe) {
      console.error("Erreur: Impossible de charger Stripe !");
      return;
    }

    this.elements = this.stripe.elements();
    if (!this.elements) {
      console.error("Erreur: Impossible d'initialiser Stripe Elements !");
      return;
    }

    const cardContainer = document.getElementById('card-element');
    if (!cardContainer) {
      console.error("Erreur: Élément #card-element introuvable !");
      return;
    }

    this.cardElement = this.elements.create('card');
    this.cardElement.mount('#card-element');
    console.log("Élément Stripe monté avec succès !");
  }

  async makePayment() {
    if (!this.stripe || !this.elements || !this.cardElement) {
      console.error("Erreur: Stripe ou l'élément de paiement n'est pas chargé.");
      return;
    }

    this.paymentService.createPaymentIntent(this.amount, this.currency).subscribe(async (response) => {
      if (!response.clientSecret) {
        console.error("Erreur: Client Secret introuvable !");
        return;
      }

      this.clientSecret = response.clientSecret;

      const { paymentIntent, error } = await this.stripe!.confirmCardPayment(this.clientSecret, {
        payment_method: { card: this.cardElement! },
      });

      if (error) {
        console.error("Erreur de paiement:", error);
      } else {
        alert('Payment successful!');
        this.paymentService.saveDonation({
          amount: this.amount,
          currency: this.currency
        }).subscribe(() => {
          console.log('Donation enregistrée avec succès');
        });
      }
    });
  }
}
