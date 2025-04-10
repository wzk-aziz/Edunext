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

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
    }
    isTeacherMenuOpen = false;

    toggleTeacherMenu() {
        this.isTeacherMenuOpen = !this.isTeacherMenuOpen;
    }
}
