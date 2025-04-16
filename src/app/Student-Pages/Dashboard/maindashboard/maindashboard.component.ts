import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../Shared/services/user/user.service';
import { User } from '../../../Shared/models/user';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-maindashboard',
  templateUrl: './maindashboard.component.html',
  styleUrls: ['./maindashboard.component.css']
})
export class MaindashboardComponent implements OnInit {

  loggedInUser: User | null = null;

  constructor(private userService: UserService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.isTokenValid()) {
      this.getLoggedInUserProfile();
    } else {
      this.router.navigate(['/login']);
    }
  }

  isTokenValid(): boolean {
    const token = localStorage.getItem('token');
    return token ? true : false;
  }

  getLoggedInUserProfile(): void {
    this.userService.getMyProfile().subscribe({
      next: (user: User) => {
        this.loggedInUser = user;
        console.log('Logged-in user profile:', this.loggedInUser);
      },
      error: (err) => {
        console.error('Error fetching logged-in user profile:', err);
        this.router.navigate(['/login']);
      }
    });
  }

  getUserImage(fileName: string): string {
    return this.userService.getUserImage(fileName);
  }


  logout(): void {
    const token = localStorage.getItem('token');
  
    if (!token) {
      this.clearStorageAndRedirect();
      return;
    }
  
    this.http.post('http://localhost:8093/api/v1/auth/logout', {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.clearStorageAndRedirect();
      },
      error: (err) => {
        console.error('Erreur de déconnexion', err);
        this.clearStorageAndRedirect(); // Même en cas d'erreur
      }
    });
  }
  
  private clearStorageAndRedirect(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }




}