import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user/user.service';  

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent {
  email: string = '';
  token: string = '';
  newPassword: string = '';
  message: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  step: 'request' | 'validate' | 'reset' = 'request';
  emailSent: boolean = false; // Track if email was sent regardless of response type

  constructor(
    private userService: UserService, 
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Check if there's a token in the URL (for direct links from email)
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.token = params['token'];
        this.step = 'validate';
      }
    });
  }

  // Trigger forgot password request
  forgotPassword() {
    if (!this.email) {
      this.errorMessage = 'Please enter your email address';
      return;
    }
    
    this.isLoading = true;
    this.message = '';
    this.errorMessage = '';
    
    this.userService.forgotPassword(this.email).subscribe({
      next: (response) => {
        this.message = 'Password reset email sent successfully. Please check your inbox for the reset token.';
        this.isLoading = false;
        this.emailSent = true; // Mark that email was sent
      },
      error: (error) => {
        // Even if there's an error, we might still want to show a message that allows proceeding
        // This is because some APIs return errors even when the email is actually sent
        console.log('API error response:', error);
        
        if (error.status === 200 || error.status === 202) {
          // Some APIs return 200/202 but with an error structure
          this.message = 'Password reset email sent. Please check your inbox for the reset token.';
          this.emailSent = true;
        } else {
          this.errorMessage = 'Enter a vaild email address. If you received an email with a reset token, please click "I Have a Token" to continue.';
        }
        this.isLoading = false;
      }
    });
  }

  // Validate reset token
  validateToken() {
    if (!this.token) {
      this.errorMessage = 'Please enter the reset token from your email';
      return;
    }
    
    this.isLoading = true;
    this.message = '';
    this.errorMessage = '';
    
    this.userService.validateResetToken(this.token).subscribe({
      next: (response) => {
        this.message = 'Token verification successful. You can now reset your password.';
        this.isLoading = false;
        this.step = 'reset'; // Move to password reset step
      },
      error: (error) => {
        console.log('Token validation error:', error);
        // Some APIs might not have a token validation endpoint or might return errors
        // Let's provide an option to proceed anyway if the user is confident
        this.errorMessage = 'We couldn\'t validate your token, but you can still try to reset your password.';
        this.isLoading = false;
      }
    });
  }

  resetPassword() {
    if (!this.newPassword) {
      this.errorMessage = 'Please enter a new password';
      return;
    }
    
    if (this.newPassword.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters long';
      return;
    }
    
    this.isLoading = true;
    this.message = '';
    this.errorMessage = '';
    
    this.userService.resetPassword(this.token, this.newPassword).subscribe({
      next: (response) => {
        this.handleSuccessfulReset();
      },
      error: (error) => {
        console.log('Password reset API response:', error);
        
        // Check if the error status indicates success
        // Some APIs return error codes even when operations succeed
        if (error.status === 200 || error.status === 202 || 
            (error.error && typeof error.error === 'string' && 
             error.error.toLowerCase().includes('success'))) {
          this.handleSuccessfulReset();
        } else {
          this.errorMessage = error.error?.message || 'Failed to reset password. Please try again or request a new token.';
          this.isLoading = false;
        }
      }
    });
  }
  
  // Handle successful password reset
  handleSuccessfulReset() {
    this.message = 'Password has been successfully reset!';
    this.isLoading = false;
    // Set timeout to show success message before redirecting
    setTimeout(() => {
      this.router.navigate(['/login'], { 
        queryParams: { resetSuccess: 'true' } 
      });
    }, 2000);
  }

  // Go back to previous step
  goBack() {
    if (this.step === 'validate') {
      this.step = 'request';
    } else if (this.step === 'reset') {
      this.step = 'validate';
    }
    this.message = '';
    this.errorMessage = '';
  }

  // Manually move to the next step
  continueToNextStep() {
    if (this.step === 'request') {
      this.step = 'validate';
      this.message = '';
    } else if (this.step === 'validate') {
      this.step = 'reset';
      this.message = '';
    }
  }
  
  // Skip to token input if user already has a token
  skipToToken() {
    this.step = 'validate';
    this.message = '';
    this.errorMessage = '';
  }
  
  // Skip token validation if needed
  skipToReset() {
    this.step = 'reset';
    this.message = '';
    this.errorMessage = '';
  }
}