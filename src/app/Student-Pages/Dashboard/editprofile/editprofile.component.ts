import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/Shared/services/authentication.service';
import { UpdateUserRequest } from 'src/app/Shared/models/UpdateUserRequest';
import { User } from 'src/app/Shared/models/user';
import { UserService } from 'src/app/Shared/services/user/user.service';

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.css']
})
export class EditprofileComponent implements OnInit {
  updateForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  loggedInUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private userService: UserService,
    private router: Router
  ) {
    this.updateForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email_address: ['', [Validators.required, Validators.email]],
      password: [''],
      mfaEnabled: [false]
    });
  }

  ngOnInit(): void {
    if (this.isTokenValid()) {
      this.getLoggedInUserProfile();
    } else {
      this.router.navigate(['/login']);
    }
  }

  isTokenValid(): boolean {
    return !!localStorage.getItem('token');
  }

  getLoggedInUserProfile(): void {
    this.userService.getMyProfile().subscribe({
      next: (user: User) => {
        this.loggedInUser = user;
        this.updateForm.patchValue({
          first_name: user.first_name,
          last_name: user.last_name,
          email_address: user.email_address,
          mfaEnabled: user.mfaEnabled
        });
      },
      error: (err) => {
        console.error('Erreur de récupération du profil :', err);
        this.router.navigate(['/login']);
      }
    });
  }

  getUserImage(fileName: string): string {
    return this.userService.getUserImage(fileName);
  }

  onSubmit(): void {
    if (this.updateForm.invalid || !this.loggedInUser) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const updateRequest: UpdateUserRequest = {
      firstname: this.updateForm.value.first_name,
      lastname: this.updateForm.value.last_name,
      email: this.updateForm.value.email_address,
      password: this.updateForm.value.password?.trim() || '', // Trim password if provided
      mfaEnabled: this.updateForm.value.mfaEnabled
    };

    if (this.updateForm.value.password?.trim()) {
      updateRequest.password = this.updateForm.value.password;
    }

    this.userService.updateUser(this.loggedInUser.id, updateRequest).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        this.successMessage = 'Profil mis à jour avec succès';
        this.getLoggedInUserProfile();

        localStorage.removeItem('token'); // ou localStorage.clear() pour tout supprimer
        this.router.navigate(['/login']); // Redirige vers la page de connexion

      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error?.error?.message || 'Erreur lors de la mise à jour du profil';
        console.error('Erreur mise à jour :', error);
      }
    });
  }

  
}
