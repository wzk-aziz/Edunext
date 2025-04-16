import { Component, OnInit } from '@angular/core';
import { MarketplaceService } from "../../../Student-Pages/Marketplace/services/marketplace.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: 'app-order-back',
  templateUrl: './order-back.component.html',
  styleUrls: ['./order-back.component.css']
})
export class OrderBackComponent implements OnInit {
  orders: any[] = [];
  paginatedOrders: any[] = [];
  isLoading: boolean = false;
  error: string = '';
  pageSize: number = 8;
  currentPage: number = 1;
  totalPages: number = 1;
  searchOrderForm!: FormGroup;
  isMenuOpen = false;
  isTeacherMenuOpen = false;

  constructor(private marketplaceService: MarketplaceService, private matSnackBar: MatSnackBar) { }

  ngOnInit() {
    this.searchOrderForm = new FormGroup({
      search: new FormControl('')
    });
    this.getPlacedOrders();
  }

  getPlacedOrders() {
    this.isLoading = true;
    this.marketplaceService.getPlacedOrders().subscribe({
      next: (res) => {
        this.orders = res;
        this.updatePagination();
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des commandes';
        this.isLoading = false;
      }
    });
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.orders.length / this.pageSize);
    this.changePage(1);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedOrders = this.orders.slice(startIndex, startIndex + this.pageSize);
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onSearchChange(): void {
    const searchValue = this.searchOrderForm.get('search')?.value.trim().toLowerCase();
    if (!searchValue) {
      this.getPlacedOrders();
      return;
    }
    this.paginatedOrders = this.orders.filter(order => order.id.toString().includes(searchValue));
  }

  changeOrderStatus(orderId: number, status: string) {
    this.marketplaceService.changeOrderStatus(orderId, status).subscribe({
      next: (res) => {
        if (res.id != null) {
          this.matSnackBar.open("Statut de la commande mis à jour!", "Fermer", { duration: 5000 });
          this.getPlacedOrders();
        } else {
          this.matSnackBar.open("Une erreur s'est produite", "Fermer", { duration: 5000 });
        }
      }
    });
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'Shipped': return 'status-shipped';
      case 'Delivered': return 'status-delivered';
      case 'Pending': return 'status-pending';
      case 'Cancelled': return 'status-cancelled';
      default: return '';
    }
  }


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
