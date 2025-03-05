import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../services/user/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})

export class UpdateUserComponent implements OnInit {
  userForm!: FormGroup;
  userId!: number;
  user: User | null = null;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    public router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Get the user ID from the route
    this.userId = +this.route.snapshot.paramMap.get('id')!;
    this.createForm();

    // Fetch user data
    this.getUserData();
  }

  getUserData(): void {
    // Assuming you have a method to get a user by ID, similar to your update method
    this.userService.getUserById(this.userId).subscribe((user) => {
      this.user = user;
      this.patchForm();
    });
  }

    // Initialize the form
    createForm(): void {
      this.userForm = this.fb.group({
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        mfaEnabled: [false],
        role: ['', Validators.required],
      });
    }

    patchForm(): void {
      if (this.user) {
        this.userForm.patchValue({
          firstname: this.user.first_name,
          lastname: this.user.last_name,
          email: this.user.email_address,
          password: '', // Don't prefill password, user should enter new one
          mfaEnabled: this.user.mfaEnabled,
          role: this.user.roles,
        });
      }
    }



  // Submit the form to update user
  updateUser(): void {
    if (this.userForm.valid) {
      this.userService
        .updateUser(this.userId, this.userForm.value)
        .subscribe({
          next: (updatedUser) => {
            console.log('User updated successfully', updatedUser);
            this.router.navigate(['/list-teachers', updatedUser.id]); // Redirect to profile or any other page
          },
          error: (err) => {
            console.error('Error updating user', err);
          },
        });
    }
  }
}
