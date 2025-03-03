import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MarketplaceService} from "../services/marketplace.service";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-view-ordered-products',
  templateUrl: './view-ordered-products.component.html',
  styleUrls: ['./view-ordered-products.component.css']
})
export class ViewOrderedProductsComponent {

  orderId: any = this.activatedRoute.snapshot.params['orderId'];
  ordererdProductDetailsList = []
  totalAmount: any;

  constructor(private activatedRoute:ActivatedRoute,
              private marketplaceService: MarketplaceService){}

  ngOnInit(){
    this.getOrderedProductDetailsByOrderId();
  }

  getOrderedProductDetailsByOrderId(){
    this.marketplaceService.getOrderedProducts(this.orderId).subscribe(res=>{
      res.productDtoList.forEach((element: any) => {
        element.processedImg = 'data:image/jpeg;base64,'+element.byteImg;
        // @ts-ignore
        this.ordererdProductDetailsList.push(element);
      });
      this.totalAmount = res.orderAmount;
    })
  }

}

