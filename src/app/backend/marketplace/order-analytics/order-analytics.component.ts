import {Component, OnInit} from '@angular/core';
import {MarketplaceService} from "../../../Student-Pages/Marketplace/services/marketplace.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-order-analytics',
  templateUrl: './order-analytics.component.html',
  styleUrls: ['./order-analytics.component.css']
})
export class OrderAnalyticsComponent implements OnInit {
  analyticsData: any;

  constructor(private marketplaceService: MarketplaceService,
  private router: Router) {}

  ngOnInit(): void {
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    this.marketplaceService.getOrderAnalytics().subscribe(
      (data) => {
        this.analyticsData = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des analyses', error);
      }
    );
  }
  isMenuOpen = false;
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  isTeacherMenuOpen = false;

  toggleTeacherMenu() {
    this.isTeacherMenuOpen = !this.isTeacherMenuOpen;
  }
  goTo(page: string): void {
    this.router.navigate([`/${page}`]);
  }
}
