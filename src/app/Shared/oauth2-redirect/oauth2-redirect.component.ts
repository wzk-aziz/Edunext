// oauth2-redirect.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-oauth-callback',
  template: '<p>Processing authentication...</p>'
})
export class OAuth2RedirectComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
      //  this.authService.handleAuthentication({ accessToken: token });
        this.router.navigate(['/']); // Redirect to home or previous URL
      } else {
        this.router.navigate(['/login']); // Redirect to login if error
      }
    });
  }
}
