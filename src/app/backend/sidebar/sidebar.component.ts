import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  isTeacherMenuOpen = false;

toggleTeacherMenu() {
    this.isTeacherMenuOpen = !this.isTeacherMenuOpen;
}
  showSubMenu = false;


  toggleSubMenu() {
    this.showSubMenu = !this.showSubMenu;
  }


}
