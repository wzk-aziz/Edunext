import { Component, OnInit } from '@angular/core';
import { UserService } from '../../Shared/services/user/user.service';
import { User } from '../../Shared/models/user';


@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css']
})
export class TeachersComponent implements OnInit {
  searchQuery: string = '';
  allUsers: User[] = []; // Declare allUsers as an empty array
  filteredUsers: User[] = [];
  allTeachers: User[] = []; // Declare allTeachers as an empty array
  allLearners: User[] = []; // Declare allLearners as an empty array
  filteredTeachers: User[] = [];
  filteredLearners: User[] = [];
  currentPageAll: number = 1;
  currentPageTeachers: number = 1;
  currentPageLearners: number = 1;
  totalPagesAll: number = 1;
  totalPagesTeachers: number = 1;
  totalPagesLearners: number = 1;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getAllUsers(); // Load all users
    this.getTeachers(); // Fetch teachers
    this.getLearners(); // Fetch learners
  }

  // Fetch all users
  getAllUsers(): void {
    this.userService.getAllUsers().subscribe((users: User[]) => {
      this.allUsers = users;
      this.filteredUsers = [...this.allUsers]; // Set filteredUsers to all users
      this.totalPagesAll = Math.ceil(this.filteredUsers.length / 3);
    });
  }

  // Fetch teachers
  getTeachers(): void {
    this.userService.getUsersByRole('Teacher').subscribe((users: User[]) => {
      this.allTeachers = users;
      this.filteredTeachers = [...this.allTeachers];
      this.totalPagesTeachers = Math.ceil(this.filteredTeachers.length / 3);
    });
  }

  // Fetch learners
  getLearners(): void {
    this.userService.getUsersByRole('Learner').subscribe((users: User[]) => {
      this.allLearners = users;
      this.filteredLearners = [...this.allLearners];
      this.totalPagesLearners = Math.ceil(this.filteredLearners.length / 3);
    });
  }

  // Search users by first name
  onSearchByName(): void {
    if (this.searchQuery.trim() === '') {
      // Reset filtered lists to the original data
      this.filteredUsers = [...this.allUsers];
      this.filteredTeachers = [...this.allTeachers];
      this.filteredLearners = [...this.allLearners];
    } else {
      // Filter the lists by first name
      this.filteredUsers = this.allUsers.filter(user =>
        user.first_name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      this.filteredTeachers = this.allTeachers.filter(user =>
        user.first_name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      this.filteredLearners = this.allLearners.filter(user =>
        user.first_name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    // Update pagination after filtering
    this.totalPagesAll = Math.ceil(this.filteredUsers.length / 3);
    this.totalPagesTeachers = Math.ceil(this.filteredTeachers.length / 3);
    this.totalPagesLearners = Math.ceil(this.filteredLearners.length / 3);
  }

  // Change page for all users
  changePageAll(page: number): void {
    if (page < 1 || page > this.totalPagesAll) return;
    this.currentPageAll = page;
  }

  // Change page for teachers
  changePageTeachers(page: number): void {
    if (page < 1 || page > this.totalPagesTeachers) return;
    this.currentPageTeachers = page;
  }

  // Change page for learners
  changePageLearners(page: number): void {
    if (page < 1 || page > this.totalPagesLearners) return;
    this.currentPageLearners = page;
  }

  // Delete user by ID
  deleteUser(userId: number): void {
    this.userService.deleteUser(userId).subscribe(() => {
      this.getAllUsers(); // Reload all users after deletion
      this.getTeachers(); // Reload teachers after deletion
      this.getLearners(); // Reload learners after deletion
    });
  }
}
