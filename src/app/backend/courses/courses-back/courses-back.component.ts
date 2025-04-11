import { Component } from '@angular/core';

@Component({
  selector: 'app-courses-back',
  templateUrl: './courses-back.component.html',
  styleUrls: ['./courses-back.component.css']
})
export class CoursesBackComponent {
  isCertificatMenuOpen = false;
  isExamMenuOpen=false;

  toggleExamMenu() {
    this.isExamMenuOpen = !this.isExamMenuOpen;
  }

toggleCertificatMenu() {
  this.isCertificatMenuOpen = !this.isCertificatMenuOpen;
}
}
