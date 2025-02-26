import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/Shared/models/user';
import { UserService } from 'src/app/Shared/services/user/user.service';

@Component({
  selector: 'app-list-teachers',
  templateUrl: './list-teachers.component.html',
  styleUrls: ['./list-teachers.component.css']
})
export class ListTeachersComponent implements OnInit {
  allUsers: User[] = [];
  teachers: User[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    // Fetch all users
    this.userService.getAllUsers().subscribe(
      (data: User[]) => {
        console.log('All Users:', data);
        this.allUsers = data;
      },
      (error) => {
        console.error('Error fetching all users', error);
      }
    );

    // Fetch users by role 'TEACHER'
    this.userService.getUsersByRole('TEACHER').subscribe(
      (data: User[]) => {
        console.log('Teachers:', data);
        this.teachers = data;
      },
      (error) => {
        console.error('Error fetching teachers', error);
      }
    );
  }
}
