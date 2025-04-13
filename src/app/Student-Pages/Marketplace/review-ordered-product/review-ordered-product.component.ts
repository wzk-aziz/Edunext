import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, Router} from "@angular/router";
import {MarketplaceService} from "../services/marketplace.service";

@Component({
  selector: 'app-review-ordered-product',
  templateUrl: './review-ordered-product.component.html',
  styleUrls: ['./review-ordered-product.component.css']
})
export class ReviewOrderedProductComponent {

  productId: number = this.activatedRoute.snapshot.params['productId'];
  reviewForm!: FormGroup;
  selectedFile: File | null | undefined;
  imagePreview: string | ArrayBuffer | null | undefined;

  constructor(private fb: FormBuilder,
              private snackBar: MatSnackBar,
              private marketplaceService: MarketplaceService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(){
    this.reviewForm = this.fb.group({
      rating: [null,[Validators.required]],
      description: [null,[Validators.required]],
    })
  }

  onFileSelected(event:any){
    this.selectedFile =  event.target.files[0];
    this.previewImage();
  }

  previewImage(){
    const reader = new FileReader();
    reader.onload= () =>{
      this.imagePreview = reader.result;
    }
    // @ts-ignore
      reader.readAsDataURL(this.selectedFile);
  }

  submitForm(){
    const formData : FormData = new FormData();

    if (this.selectedFile) {
      formData.append('img', this.selectedFile);
    }

    formData.append('productId',this.productId.toString());
    // @ts-ignore
      formData.append('rating',this.reviewForm.get('rating').value);
    // @ts-ignore
      formData.append('description',this.reviewForm.get('description').value);

    this.marketplaceService.giveReview(formData).subscribe(res=>{
      if(res.id != null){
        this.snackBar.open('review posted successfully ','Close',{
          duration:5000
        });
        this.router.navigateByUrl('customer/my_orders');
      }else{
        this.snackBar.open('something went wrong ','Close',{
          duration:5000,
          panelClass:'error-snackbar'
        });
      }
    })

  }

}
