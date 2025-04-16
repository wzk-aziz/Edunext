import { Component, OnInit } from '@angular/core';
import {PaymentServiceService} from "../../../Student-Pages/Donnation/services/payment-service.service";

@Component({
  selector: 'app-donations-list',
  templateUrl: './donations-list.component.html',
  styleUrls: ['./donations-list.component.css']
})
export class DonationsListComponent implements OnInit {
  donations: any[] = [];

  constructor(private paymentService: PaymentServiceService) { }

  ngOnInit(): void {
    this.loadDonations();
  }

  loadDonations(): void {
    this.paymentService.getDonations().subscribe((data: any[]) => {
      this.donations = data;
    }, error => {
      console.error('Erreur lors du chargement des donations:', error);
    });
  }
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  isTeacherMenuOpen = false;

  toggleTeacherMenu() {
    this.isTeacherMenuOpen = !this.isTeacherMenuOpen;
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
