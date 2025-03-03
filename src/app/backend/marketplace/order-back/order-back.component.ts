import { Component } from '@angular/core';
import {MarketplaceService} from "../../../Student-Pages/Marketplace/services/marketplace.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-order-back',
  templateUrl: './order-back.component.html',
  styleUrls: ['./order-back.component.css']
})
export class OrderBackComponent {
  orders: any;
  constructor(private marketplaceService: MarketplaceService,
              private matSnackBar: MatSnackBar) { }

  ngOnInit() {
    this.getPlacedOrders();
  }

  getPlacedOrders() {
    this.marketplaceService.getPlacedOrders().subscribe(res => {
          this.orders = res;
        }, error => {
          console.error('Error fetching placed orders:', error);
          this.matSnackBar.open('Error fetching placed orders', 'Close', {
            duration: 3000,
            panelClass: 'snackbar-error'
          });
        }
    );
  }

  changeOrderStatus(orderId: number, status: string) {
    this.marketplaceService.changeOrderStatus(orderId, status).subscribe(res => {
      if (res.id != null) {
        this.matSnackBar.open("order Status changed Successfully!! ", "Close", { duration: 5000 });
        this.getPlacedOrders();
      } else {
        this.matSnackBar.open("something went wrong", "Close", { duration: 5000 });
      }
    })
  }
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  isTeacherMenuOpen = false;

  toggleTeacherMenu() {
    this.isTeacherMenuOpen = !this.isTeacherMenuOpen;
  }
}
