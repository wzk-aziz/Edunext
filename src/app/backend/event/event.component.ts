import { Component } from '@angular/core';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent {
  isCertificatMenuOpen = false;
  isExamMenuOpen=false;

  toggleExamMenu() {
    this.isExamMenuOpen = !this.isExamMenuOpen;
  }

toggleCertificatMenu() {
  this.isCertificatMenuOpen = !this.isCertificatMenuOpen;
}
}
