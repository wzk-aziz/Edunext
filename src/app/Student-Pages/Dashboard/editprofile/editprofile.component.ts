import { Component } from '@angular/core';

import { AuthenticationService } from 'src/app/Shared/services/authentication.service';

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.css']
})


export class EditprofileComponent {
  constructor(private authService: AuthenticationService){
  }

  logout() {
    this.authService.logout();
  }


}
