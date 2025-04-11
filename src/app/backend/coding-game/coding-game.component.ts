import { Component } from '@angular/core';

@Component({
  selector: 'app-coding-game',
  templateUrl: './coding-game.component.html',
  styleUrls: ['./coding-game.component.css']
})
export class CodingGameComponent {
  isCertificatMenuOpen = false;
  isExamMenuOpen=false;

  toggleExamMenu() {
    this.isExamMenuOpen = !this.isExamMenuOpen;
  }

toggleCertificatMenu() {
  this.isCertificatMenuOpen = !this.isCertificatMenuOpen;
}
}
