import { Component } from '@angular/core';
import { MarketplaceService } from "../../../Student-Pages/Marketplace/services/marketplace.service";
import { Router } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';  // Import MatSnackBar

@Component({
  selector: 'app-coupon-back',
  templateUrl: './coupon-back.component.html',
  styleUrls: ['./coupon-back.component.css']
})
export class CouponBackComponent {
  coupons: any[] = [];
  paginatedCoupons: any[] = [];  // Array for paginated coupons
  pageSize: number = 3;          // Number of coupons per page
  currentPage: number = 1;      // Current page number
  totalPages: number = 1;       // Total number of pages

  constructor(
      private marketplaceService: MarketplaceService,
      private router: Router,
      private snackbar: MatSnackBar  // Inject MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getCoupons();
  }

  getCoupons(): void {
    this.marketplaceService.getCoupons().subscribe(res => {
      this.coupons = res;
      this.totalPages = Math.ceil(this.coupons.length / this.pageSize);  // Calculate total pages
      this.updatePaginatedCoupons();
    });
  }

  updatePaginatedCoupons(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedCoupons = this.coupons.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedCoupons();
  }

  getPages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToAddCoupon(): void {
    this.router.navigate(['/backoffice/addCoupon']);
  }

  // Menu toggles
  isMenuOpen = false;
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  isTeacherMenuOpen = false;
  toggleTeacherMenu() {
    this.isTeacherMenuOpen = !this.isTeacherMenuOpen;
  }

  // Vérifier si le coupon est utilisé avant de le supprimer
  deleteCoupon(id: number): void {
    this.marketplaceService.isCouponUsed(id).subscribe({
      next: (isUsed) => {
        if (isUsed) {
          // Afficher une notification si le coupon est utilisé dans une commande
          this.snackbar.open('Ce coupon est déjà utilisé et ne peut pas être supprimé.', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        } else {
          // Supprimer le coupon si ce n'est pas utilisé
          this.marketplaceService.deleteCoupon(id).subscribe({
            next: () => {
              console.log(`Coupon with ID ${id} deleted successfully`);
              this.getCoupons(); // Recharge la liste des coupons après la suppression
              this.snackbar.open('Coupon supprimé avec succès.', 'Fermer', {
                duration: 3000,
                panelClass: ['success-snackbar']
              });
            },
            error: (error) => {
              console.error('Error deleting coupon:', error);
              this.snackbar.open('Erreur lors de la suppression du coupon.', 'Fermer', {
                duration: 3000,
                panelClass: ['error-snackbar']
              });
            }
          });
        }
      },
      error: (error) => {
        console.error('Error checking if coupon is used:', error);
        this.snackbar.open('Erreur lors de la vérification de l\'utilisation du coupon.', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }



  isVirtualClassroomMenuOpen = false;
  isVirtualClassroomSubMenuOpen = false;
  isLiveTutoringSubMenuOpen = false;


  isCodingGameMenuOpen = false;
  isForumMenuOpen = false;
  showSubMenu = false;




 
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
