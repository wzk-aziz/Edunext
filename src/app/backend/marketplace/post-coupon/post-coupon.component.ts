import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MarketplaceService} from "../../../Student-Pages/Marketplace/services/marketplace.service";

@Component({
  selector: 'app-post-coupon',
  templateUrl: './post-coupon.component.html',
  styleUrls: ['./post-coupon.component.css']
})
export class PostCouponComponent {
  couponForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar:MatSnackBar,
    private marketplaceService: MarketplaceService
  ){}

  ngOnInit(){
    this.couponForm = this.fb.group({
      name: [null,[Validators.required]],
      code: [null,[Validators.required]],
      discount: [null,[Validators.required]],
      expirationDate: [null,[Validators.required]],

    })
  }

  addCoupon(){
    if(this.couponForm.valid){
      this.marketplaceService.addCoupon(this.couponForm.value).subscribe(res=>{
        if(res.id != null){
          this.snackBar.open('Coupon Posted Successfully !','Close',{
            duration:5000
          });
          this.router.navigateByUrl('admin/dashboard');
        }else{
          this.snackBar.open(res.message,'Close',{
            duration:5000,
            panelClass:'error-snackbar'
          });
        }
      })
    }else{
      this.couponForm.markAllAsTouched();
    }
  }
}
