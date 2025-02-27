import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-list-teachers',
  templateUrl: './list-teachers.component.html',
  styleUrls: ['./list-teachers.component.css']
})
export class ListTeachersComponent implements OnInit {
  searchQuery: string = '';
  filteredUsers: any[] = [];
  filteredTeachers: any[] = [];
  filteredLearners: any[] = [];
  currentPageAll: number = 1;
  currentPageTeachers: number = 1;
  currentPageLearners: number = 1;
  totalPagesAll: number = 1;
  totalPagesTeachers: number = 1;
  totalPagesLearners: number = 1;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // Load all users, categorize them into filtered arrays
  loadUsers() {
    this.userService.getAllUsers().subscribe((users: any[]) => {
      this.filteredUsers = users;
      this.filteredTeachers = users.filter(user => user.authorities[0].authority === 'ROLE_TEACHER');
      this.filteredLearners = users.filter(user => user.authorities[0].authority === 'ROLE_LEARNER');
      
      // Set total pages for pagination
      this.totalPagesAll = Math.ceil(this.filteredUsers.length / 3);
      this.totalPagesTeachers = Math.ceil(this.filteredTeachers.length / 3);
      this.totalPagesLearners = Math.ceil(this.filteredLearners.length / 3);
    });
  }

  // Search users by first name
  onSearchByName() {
    this.filteredUsers = this.filteredUsers.filter(user =>
      user.first_name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.filteredTeachers = this.filteredTeachers.filter(user =>
      user.first_name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.filteredLearners = this.filteredLearners.filter(user =>
      user.first_name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Change page for all users
  changePageAll(page: number) {
    if (page < 1 || page > this.totalPagesAll) return;
    this.currentPageAll = page;
  }

  // Change page for teachers
  changePageTeachers(page: number) {
    if (page < 1 || page > this.totalPagesTeachers) return;
    this.currentPageTeachers = page;
  }

  // Change page for learners
  changePageLearners(page: number) {
    if (page < 1 || page > this.totalPagesLearners) return;
    this.currentPageLearners = page;
  }

  // Delete user by ID
  deleteUser(userId: number) {
    this.userService.deleteUser(userId).subscribe(() => {
      this.loadUsers(); // Reload users after deletion
    });
  }
}
