import { Component } from '@angular/core';
import {MarketplaceService} from "../services/marketplace.service";

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.css']
})
export class MyOrderComponent {
  myOrders: any;
  constructor(private marketplaceService: MarketplaceService) { }

  ngOnInit(){
    this.getMyOrders();
  }

  getMyOrders(){
    this.marketplaceService.getOrders().subscribe(res=>{
      this.myOrders=res;
    })
  }
  viewOrderDetails(order: any) {
    console.log("Détails de la commande :", order);
    alert(`Commande Réf: ${order.reference}\nDate: ${order.date}\nTotal: ${order.total}€\nStatut: ${order.status}`);
  }

}

