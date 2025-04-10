import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class PaymentServiceService {
  private stripePromise = loadStripe('pk_test_51QwtvpR88uyR8EQrqAq8qSIJ61ZsTAUtltcDU3EDqhVBgvQFVH08F5SUsngiPiu2AHTsx5feb7ejgLmfpNDQLiyN00hpHvt7Wk');
  private apiUrl = 'http://localhost:8087/api';

  constructor(private http: HttpClient) {}

  createPaymentIntent(amount: number, currency: string) {
    return this.http.post<{ clientSecret: string }>(
      `${this.apiUrl}/payments/create-payment-intent`,
      { amount, currency }
    );
  }
  saveDonation(donation: any) {
    return this.http.post(`${this.apiUrl}/donations/create`, donation);
  }
  getDonations():Observable<any> {
    return this.http.get(`${this.apiUrl}/donations/list`);
  }

  async getStripe() {
    return this.stripePromise;
  }
}
