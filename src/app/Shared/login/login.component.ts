import { Component, OnInit } from '@angular/core';
import { AuthenticationRequest } from '../models/authentication-request';
import { AuthenticationResponse } from '../models/authentication-response';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  authRequest: AuthenticationRequest = {};
  authResponse: AuthenticationResponse = {};
  errorMessage: string | null = null;
  user: SocialUser | null = null;
  loggedIn: boolean = false;
  failedAttempts: number = 0;
  showForgotPasswordWarning: boolean = false;
  
  

  constructor(
    private authService: AuthenticationService,
    private socialAuthService: SocialAuthService,
    private router: Router,
    private translate: TranslateService
  ) {

    this.translate.setDefaultLang('en');

    // Initialize failedAttempts from localStorage or set to 0
    this.failedAttempts = Number(localStorage.getItem('failedAttempts')) || 0;
    
    // Check if we should reset attempts based on time
    this.checkAttemptsReset();
    
    // Set warning flag if we're past the threshold
    this.showForgotPasswordWarning = this.failedAttempts >= 3;
  }


  switchLang(lang: string) {
    this.translate.use(lang);
  }



  // Check if we should reset attempts based on last failed timestamp
  private checkAttemptsReset(): void {
    const lastAttemptTime = localStorage.getItem('lastFailedAttemptTime');
    if (lastAttemptTime) {
      const lastTime = new Date(lastAttemptTime);
      const currentTime = new Date();
      
      // Reset after 30 minutes (1800000 ms)
      if (currentTime.getTime() - lastTime.getTime() > 1800000) {
        this.failedAttempts = 0;
        localStorage.setItem('failedAttempts', '0');
        localStorage.removeItem('lastFailedAttemptTime');
      }
    }
  }

  ngOnInit() {
    this.socialAuthService.authState.subscribe({
      next: (user) => {
        this.user = user;
        this.loggedIn = (user != null);
        if (this.loggedIn) {
          console.log('Google user:', user);
          this.handleGoogleLogin(user);
        }
      },
      error: (error) => {
        console.error('Social auth state error:', error);
        this.errorMessage = 'Authentication service error';
      }
    });
  }

  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(user => {
        console.log('Google sign in successful:', user);
        this.handleGoogleLogin(user);
      })
      .catch(error => {
        console.error('Google sign in failed:', error);
        this.errorMessage = 'Google sign in failed';
      });
  }

  private handleGoogleLogin(user: SocialUser): void {
    console.log('Handling Google login for user:', user);
    
    const googleAuthRequest = {
      token: user.idToken,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      photoUrl: user.photoUrl
    };

    this.authService.googleLogin(googleAuthRequest).subscribe({
      next: (response) => {
        if (response.accessToken) {
          // Reset failed attempts on successful login
          this.resetFailedAttempts();
          
          localStorage.setItem('token', response.accessToken);
          
          const userRole = response.role?.toUpperCase();
          switch(userRole) {
            case 'ADMIN':
              this.router.navigate(['Teachers']);
              break;
            case 'TEACHER':
              this.router.navigate(['listTeachers']);
              break;
            case 'LEARNER':
              this.router.navigate(['studenthome']);
              break;
            default:
              this.router.navigate(['main']);
          }
        }
      },
      error: (err) => {
        console.error('Google login error:', err);
        this.errorMessage = 'Google authentication failed';
      }
    });
  }

  // Helper method to reset failed attempts
  private resetFailedAttempts(): void {
    this.failedAttempts = 0;
    this.showForgotPasswordWarning = false;
    localStorage.setItem('failedAttempts', '0');
    localStorage.removeItem('lastFailedAttemptTime');
  }

  authenticate() {
    if (!this.authRequest.email || !this.authRequest.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    // Show warning message if over threshold but still allow the attempt
    if (this.failedAttempts >= 3) {
      this.showForgotPasswordWarning = true;
    }

    this.authService.login(this.authRequest).subscribe({
      next: (response) => {
        this.authResponse = response;
        console.log("User role:", this.authResponse.role);

        // Reset failed attempts on successful login
        this.resetFailedAttempts();

        if (response.mfaEnabled) {
          // Redirect to verification component with email
          this.router.navigate(['verify'], { 
            queryParams: { email: this.authRequest.email }
          });
        } else {
          if (response.accessToken) {
            localStorage.setItem('token', response.accessToken);
            
            const userRole = this.authResponse.role?.toUpperCase();
            switch(userRole) {
              case 'ADMIN':
                this.router.navigate(['backoffice/teachers']);
                break;
              case 'TEACHER':
                this.router.navigate(['listTeachers']);
                break;
              case 'LEARNER':
                this.router.navigate(['studenthome']);
                break;
              default:
                this.router.navigate(['main']);
            }
          }
        }
      },
      error: (err) => {
        console.error('Authentication error:', err);
        
        // Increment failed attempts on error and save timestamp
        this.failedAttempts++;
        localStorage.setItem('failedAttempts', this.failedAttempts.toString());
        localStorage.setItem('lastFailedAttemptTime', new Date().toString());
        
        if (this.failedAttempts >= 3) {
          this.showForgotPasswordWarning = true;
          this.errorMessage = 'Invalid credentials. You have made ' + this.failedAttempts + ' unsuccessful attempts. Please use the Forgot Password option to reset your password or try again if you remember your password.';
        } else if (err.status === 400) {
          this.errorMessage = 'Invalid email format';
        } else if (err.status === 401) {
          this.errorMessage = 'Invalid credentials';
        } else {
          this.errorMessage = 'Authentication failed';
        }
      }
    });
  }
}