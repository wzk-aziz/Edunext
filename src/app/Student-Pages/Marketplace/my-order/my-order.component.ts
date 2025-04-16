import { Component } from '@angular/core';
import {MarketplaceService} from "../services/marketplace.service";
import {AuthenticationService} from "../../../Shared/services/authentication.service";

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.css']
})
export class MyOrderComponent {


  orders: any[] = [];
  errorMessage: string = '';

  constructor(private marketplaceService: MarketplaceService, private authService: AuthenticationService) {}

  ngOnInit() {
    this.loadUserOrders();
  }

  loadUserOrders() {
    const userId = this.authService.getUserId();  // Récupérer l'ID de l'utilisateur
    if (userId) {
      this.marketplaceService.getMyOrders(Number(userId)).subscribe(
        (data) => {
          this.orders = data;
        },
        (error) => {
          this.errorMessage = 'Could not load orders. Please try again later.';
        }
      );
    } else {
      this.errorMessage = 'User is not logged in.';
    }
  }
  getStatusClass(status: string) {
    switch (status) {
      case 'Shipped': return 'status-shipped';
      case 'Delivered': return 'status-delivered';
      case 'Pending': return 'status-pending';
      case 'Cancelled': return 'status-cancelled';
      default: return '';
    }
  }

}

