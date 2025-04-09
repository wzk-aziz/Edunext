import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user/user.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userId: number = 0; // Initialize userId
  userProfile: any = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    mfaEnabled: false,
  };
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.authenticationService.getUserId(); // Récupérer l'ID de l'utilisateur connecté
    this.loadUserProfile();
  }

  // Charger les informations du profil utilisateur
  loadUserProfile(): void {
    this.userService.getUserProfile(this.userId).subscribe(
      (response) => {
        this.userProfile = response;
      },
      (error) => {
        console.error('Error loading profile', error);
        this.errorMessage = 'Impossible de charger votre profil.';
      }
    );
  }

  // Mettre à jour le profil utilisateur
  updateProfile(): void {
    this.userService.updateUserProfile(this.userId, this.userProfile).subscribe(
      (response) => {
        alert('Profil mis à jour avec succès');
        this.router.navigate(['/dashboard']); // Rediriger après la mise à jour
      },
      (error) => {
        console.error('Error updating profile', error);
        this.errorMessage = 'Erreur lors de la mise à jour du profil.';
      }
    );
  }
}
