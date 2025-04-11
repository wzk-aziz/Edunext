import { Component } from '@angular/core';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent {
  isCertificatMenuOpen = false;
  isExamMenuOpen=false;

  toggleExamMenu() {
    this.isExamMenuOpen = !this.isExamMenuOpen;
  }

toggleCertificatMenu() {
  this.isCertificatMenuOpen = !this.isCertificatMenuOpen;
}
}
