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
          this.router.navigateByUrl('backoffice/coupon');
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
  isMenuOpen = false;
  isTeacherMenuOpen = false;
  isVirtualClassroomMenuOpen = false;
  isVirtualClassroomSubMenuOpen = false;
  isLiveTutoringSubMenuOpen = false;


  isCodingGameMenuOpen = false;
  isForumMenuOpen = false;
  showSubMenu = false;


  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }


  toggleTeacherMenu() {
    this.isTeacherMenuOpen = !this.isTeacherMenuOpen;

  }
  toggleCoursesMenu() {
    this.isMenuOpenCourses = !this.isMenuOpenCourses;

  }

  toggleMenuForum() {
    this.isForumMenuOpen = !this.isForumMenuOpen;

  }

  toggleVirtualClassroomMenu() {
    this.isVirtualClassroomMenuOpen = !this.isVirtualClassroomMenuOpen;
  }

  toggleVirtualClassroomSubMenu() {
    this.isVirtualClassroomSubMenuOpen = !this.isVirtualClassroomSubMenuOpen;
  }

  toggleLiveTutoringSubMenu() {
    this.isLiveTutoringSubMenuOpen = !this.isLiveTutoringSubMenuOpen;
  }



isCertificatMenuOpen = false;
isExamMenuOpen=false;
isMenuOpenCourses=false;
toggleExamMenu() {
  this.isExamMenuOpen = !this.isExamMenuOpen;
}

toggleCertificatMenu() {
this.isCertificatMenuOpen = !this.isCertificatMenuOpen;
}




  toggleCodingGameMenu() {
    this.isCodingGameMenuOpen = !this.isCodingGameMenuOpen;
  }

  toggleForumMenu(): void {
    this.isForumMenuOpen = !this.isForumMenuOpen;
  }

  toggleSubMenu() {
    this.showSubMenu = !this.showSubMenu;
  }
}
