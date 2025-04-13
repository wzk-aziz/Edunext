import { Component } from '@angular/core';

@Component({
  selector: 'app-video-class',
  templateUrl: './video-class.component.html',
  styleUrls: ['./video-class.component.css']
})
export class VideoClassComponent {

  isCertificatMenuOpen = false;
  isExamMenuOpen=false;

  toggleExamMenu() {
    this.isExamMenuOpen = !this.isExamMenuOpen;
  }

toggleCertificatMenu() {
  this.isCertificatMenuOpen = !this.isCertificatMenuOpen;
}

}
