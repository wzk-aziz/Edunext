import { Component, OnInit } from '@angular/core';
import { MarketplaceService } from "../../../Student-Pages/Marketplace/services/marketplace.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-product-back',
  templateUrl: './product-back.component.html',
  styleUrls: ['./product-back.component.css']
})
export class ProductBackComponent implements OnInit {
  products: any[] = [];
  searchProductForm!: FormGroup;

  constructor(
    private marketplaceService: MarketplaceService,
    private snackbar: MatSnackBar,
    private router: Router,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.getProducts();
    this.searchProductForm = this.fb.group({
      title: [null,[Validators.required]]
    })
  }

  /**
   * Récupère la liste des produits
   */
  getProducts(): void {
    this.marketplaceService.getAllProducts().subscribe(
      (data: any[]) => {
        this.products = data.map((element: any) => ({
          ...element,
          processedImg: 'data:image/jpeg;base64,' + element.byteImg
        }));
        console.log('Produits récupérés:', this.products);
      },
      (error) => {
        console.error('Erreur lors de la récupération des produits', error);
      }
    );
  }

  /**
   * Redirige vers la page d'édition du produit
   */
  editProduct(productId: number): void {
    this.router.navigate(['/backoffice/edit-product', productId]);
  }

  /**
   * Supprime un produit et met à jour la liste après suppression
   */
  deleteProduct(productId: number): void {
    this.marketplaceService.deleteProduct(productId).subscribe(
      () => {
        this.snackbar.open('Produit supprimé avec succès', 'Fermer', { duration: 2000 });
        this.getProducts(); // Rafraîchit la liste après suppression
      },
      (error) => {
        console.error('Erreur lors de la suppression', error);
      }
    );
  }

  /**
   * Redirige vers la page d'ajout d'un nouveau produit
   */
  goToAddProduct(): void {
    this.router.navigate(['/backoffice/add-product']);
  }
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  isTeacherMenuOpen = false;

  toggleTeacherMenu() {
    this.isTeacherMenuOpen = !this.isTeacherMenuOpen;
  }
  showSubMenu = false;
  submitForm(){
    this.products = [];
    const title= this.searchProductForm.get('title')!.value;
    this.marketplaceService.getAllProductsByName(title).subscribe(res => {
      res.forEach((element:any) => {
        element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
        this.products.push(element);
      });
    })
  }
}
