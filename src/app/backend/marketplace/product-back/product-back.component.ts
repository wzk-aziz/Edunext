import { Component, OnInit } from '@angular/core';
import { MarketplaceService } from "../../../Student-Pages/Marketplace/services/marketplace.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-product-back',
  templateUrl: './product-back.component.html',
  styleUrls: ['./product-back.component.css']
})
export class ProductBackComponent implements OnInit {
  products: any[] = [];
  searchProductForm!: FormGroup;
  categories: any[] = [];
  totalProducts: number = 0;
  pageSize: number = 4; // Nombre de produits par page
  totalPages: number = 1;
  paginatedProducts: any[] = [];
  currentPage: number = 1;
  allProducts: any[] = [];

  constructor(
    private marketplaceService: MarketplaceService,
    private snackbar: MatSnackBar,
    private router: Router,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.getCategories();
    this.getProducts();
    this.searchProductForm = this.fb.group({
      title: [null, [Validators.required]],
    });
  }

  getCategories(): void {
    this.marketplaceService.getAllCategories().subscribe({
      next: (res: any[]) => {
        console.log("Catégories reçues :", res);
        this.categories = res;
      },
      error: (err) => console.error("Erreur lors de la récupération des catégories :", err)
    });
  }

  downloadPdf(productId: number): void {
    this.marketplaceService.downloadProductPdf(productId).subscribe(
      (response: Blob) => {
        // Créez un lien pour télécharger le fichier PDF
        const blob = response;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `product_${productId}.pdf`; // Nom du fichier PDF à télécharger
        a.click();
        window.URL.revokeObjectURL(url); // Libère la ressource
      },
      (error) => {
        console.error('Erreur lors du téléchargement du PDF', error);
      }
    );
  }
  getProducts(): void {
    this.marketplaceService.getAllProducts().subscribe(
      (data: any[]) => {
        this.allProducts = data.map((element: any) => ({
          ...element,
          processedImg: 'data:image/jpeg;base64,' + element.byteImg
        }));
        this.products = [...this.allProducts];  // Réinitialiser les produits
        this.totalProducts = this.products.length;
        this.totalPages = Math.ceil(this.products.length / this.pageSize);
        this.updatePaginatedProducts();
        console.log("Produits reçus :", this.products);
      },
      (error) => {
        console.error('Erreur lors de la récupération des produits', error);
      }
    );
  }

  updatePaginatedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.products.slice(startIndex, endIndex);
  }

  editProduct(productId: number): void {
    this.router.navigate(['/backoffice/edit-product', productId]);
  }

  deleteProduct(productId: number): void {
    this.marketplaceService.deleteProduct(productId).subscribe(
      () => {
        this.snackbar.open('Produit supprimé avec succès', 'Fermer', { duration: 2000 });
        this.getProducts();
      },
      (error) => {
        console.error('Erreur lors de la suppression', error);
      }
    );
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedProducts();
  }

  getPages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  filterProductsByCategory(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedCategory = target.value;
    this.applyCategoryFilter(selectedCategory);
  }

  applyCategoryFilter(selectedCategory: string): void {
    if (selectedCategory) {
      this.products = this.allProducts.filter(
        product => product.categoryName === selectedCategory
      );
    } else {
      this.products = [...this.allProducts];
    }
    this.totalProducts = this.products.length;
    this.totalPages = Math.ceil(this.products.length / this.pageSize);
    this.currentPage = 1;  // Réinitialiser la page à 1
    this.updatePaginatedProducts();
  }

  goToAddProduct(): void {
    this.router.navigate(['/backoffice/add-product']);
  }

  onSearchChange(): void {
    const searchValue = this.searchProductForm.get('title')?.value.trim().toLowerCase();
    if (searchValue === '') {
      this.getProducts();
    } else {
      this.searchProducts();
    }
  }

  searchProducts(): void {
    const query = this.searchProductForm.value.title;
    if (!query) {
      this.snackbar.open('Veuillez entrer un mot-clé pour la recherche.', 'Fermer', { duration: 3000 });
      return;
    }
    this.marketplaceService.searchProducts(query).subscribe((res) => {
      this.allProducts = res.map((element: any) => ({
        ...element,
        processedImg: 'data:image/jpeg;base64,' + element.byteImg,
      }));
      this.products = [...this.allProducts];
      this.totalPages = Math.ceil(this.products.length / this.pageSize);
      this.updatePaginatedProducts();
    });
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
