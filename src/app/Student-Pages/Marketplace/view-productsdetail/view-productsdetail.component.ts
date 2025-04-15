import { Component } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute} from "@angular/router";
import {MarketplaceService} from "../services/marketplace.service";

@Component({
  selector: 'app-view-productsdetail',
  templateUrl: './view-productsdetail.component.html',
  styleUrls: ['./view-productsdetail.component.css']
})
export class ViewProductsdetailComponent {

  productId: number = this.activatedRoute.snapshot.params["productId"];


  product: any;
  FAQS: any[] = [];
  reviews: any[] = [];

  ngOnInit() { this.getProductDetailById(); }

  constructor(private snackBar: MatSnackBar,
              private marketplaceService: MarketplaceService,
              private activatedRoute: ActivatedRoute) { }

  getProductDetailById() {
    this.marketplaceService.getProductDetailById(this.productId).subscribe(res => {
      this.product = res.productDto;
      this.product.processedImg = 'data:image/png;base64,' + res.productDto.byteImg;

      this.FAQS = res.faqDtoList;

      res.reviewDtoList.forEach((element:any) => {
        element.processedImg = 'data:image/png;base64,' + element.returnedImg;
        this.reviews.push(element);
      });

    })
  }

  addToWishlist(){
    const wishListDto = {
      productId : this.productId,
    }
    this.marketplaceService.addProductToWishlist(wishListDto).subscribe(res=>{
      if(res.id !=null){
        this.snackBar.open('Product Added to wishlist Successfully!','Close',{
          duration:5000
        });
      }else{
        this.snackBar.open("Already in Wishlist","WRROR",{
          duration:5000
        })
      }
    })
  }



}
