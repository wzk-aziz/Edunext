import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MarketplaceService} from "../../../Student-Pages/Marketplace/services/marketplace.service";

@Component({
  selector: 'app-categorie-form',
  templateUrl: './categorie-form.component.html',
  styleUrls: ['./categorie-form.component.css']
})
export class CategorieFormComponent {
  categoryForm!: FormGroup;

  constructor(
      private fb: FormBuilder,
      private router:Router,
      private snackBar:MatSnackBar,
      private marketplaceService:MarketplaceService
  ){}

  ngOnInit():void{
    this.categoryForm = this.fb.group(
        {
          name: [null,[Validators.required]],
          description: [null,[Validators.required]],
        }
    )
  }

  addCategory():void{
    if(this.categoryForm.valid){
      this.marketplaceService.addCategory(this.categoryForm.value).subscribe(
          (res)=>{
            if(res.id!=null){
              this.snackBar.open('category created!','close',{duration:5000});
                this.router.navigate(['/backoffice/categorieBack']);
            }else{
              this.snackBar.open(res.message,'close',{duration:5000,panelClass: 'error-snackbar'});
            }
          }
      )
    }else{
      this.categoryForm.markAllAsTouched();
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
