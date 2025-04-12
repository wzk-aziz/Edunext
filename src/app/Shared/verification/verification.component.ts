import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { VerificationRequest } from '../models/verification-request';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {
  email: string = '';
  otpCode: string = '';
  message: string = '';
  isOkay: boolean = true;
  submitted: boolean = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      if (!this.email) {
        this.message = 'Email is missing. Please return to login.';
        this.submitted = true;
        this.isOkay = false;
      }
    });
  }

  onCodeCompleted(code: string) {
    this.confirmAccount(code);
  }

  verifyCode() {
    if (!this.otpCode) {
      this.message = 'Please enter verification code';
      this.submitted = true;
      this.isOkay = false;
      return;
    }
    this.confirmAccount(this.otpCode);
  }

  private confirmAccount(code: string) {
    const verifyRequest: VerificationRequest = {
      email: this.email,
      code: code
    };

    this.authService.verifyCode(verifyRequest).subscribe({
      next: (response) => {
        if (response.accessToken) {
          localStorage.setItem('token', response.accessToken);

          const userRole = response.role?.toUpperCase();
          switch (userRole) {
            case 'ADMIN':
              this.router.navigate(['backoffice']);
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
        } else {
          this.message = 'Invalid verification response';
          this.isOkay = false;
          this.submitted = true;
        }
      },
      error: (err) => {
        console.error('Verification error:', err);
        this.message = err.error?.message || 'Verification failed';
        this.isOkay = false;
        this.submitted = true;
      }
    });
  }

  redirectToLogin() {
    this.router.navigate(['login']);
  }
}
