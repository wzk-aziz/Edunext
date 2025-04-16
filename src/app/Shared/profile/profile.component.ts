import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  loggedInUser: User | null = null;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    console.log(this.isTokenValid());
    // Check if the token exists in local storage before making the API call
    if (this.isTokenValid()) {
      this.getLoggedInUserProfile();
    } else {
      this.router.navigate(['/login']); // Redirect to login if no valid token is found
    }
  }

  isTokenValid(): boolean {
    const token = localStorage.getItem('token'); // Assuming your token is saved as 'auth_token'
    return token ? true : false;
  }

  getLoggedInUserProfile(): void {
    console.log("araed");
    this.userService.getMyProfile().subscribe({
      next: (user: User) => {
        this.loggedInUser = user;
        console.log('Logged-in user profile:', this.loggedInUser);
      },
      error: (err) => {
        console.error('Error fetching logged-in user profile:', err);
        this.router.navigate(['/login']); // Redirect to login if fetching fails
      }
    });
  }

  getUserImage(fileName: string): string {
    return this.userService.getUserImage(fileName);
  }
  


}