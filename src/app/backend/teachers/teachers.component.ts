
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../Shared/services/user/user.service';
import { User } from 'src/app/Shared/models/user';


@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css']
})

export class TeachersComponent implements OnInit {
  searchQuery: string = '';
  allUsers: User[] = [];
  filteredUsers: User[] = [];
  allTeachers: User[] = [];
  allLearners: User[] = [];
  allAdmins: User[] = [];
  filteredTeachers: User[] = [];
  filteredLearners: User[] = [];
  filteredAdmins: User[] = [];
  currentPageAll: number = 1;
  currentPageTeachers: number = 1;
  currentPageLearners: number = 1;
  currentPageAdmins: number = 1;
  totalPagesAll: number = 1;
  totalPagesTeachers: number = 1;
  totalPagesLearners: number = 1;
  totalPagesAdmins: number = 1;
  totalUsers: number = 0;
  totalTeachers: number = 0;
  totalLearners: number = 0;
  totalAdmins: number = 0;
  percentageTeachers: number = 0;
  percentageLearners: number = 0;
  percentageAdmins: number = 0;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getAllUsers();
    this.getTeachers();
    this.getLearners();
    this.getAdmins();
  }

  getAllUsers(): void {
    this.userService.getAllUsers().subscribe((users: User[]) => {
      this.allUsers = users;
      this.filteredUsers = [...this.allUsers];
      this.totalPagesAll = Math.ceil(this.filteredUsers.length / 3);
      this.totalUsers = this.allUsers.length;
      this.updateStatistics();
    });
  }

  getTeachers(): void {
    this.userService.getUsersByRole('Teacher').subscribe((users: User[]) => {
      this.allTeachers = users;
      this.filteredTeachers = [...this.allTeachers];
      this.totalPagesTeachers = Math.ceil(this.filteredTeachers.length / 3);
      this.totalTeachers = this.allTeachers.length;
      this.updateStatistics();
    });
  }

  getLearners(): void {
    this.userService.getUsersByRole('Learner').subscribe((users: User[]) => {
      this.allLearners = users;
      this.filteredLearners = [...this.allLearners];
      this.totalPagesLearners = Math.ceil(this.filteredLearners.length / 3);
      this.totalLearners = this.allLearners.length;
      this.updateStatistics();
    });
  }

  getAdmins(): void {
    this.userService.getUsersByRole('Admin').subscribe((users: User[]) => {
      this.allAdmins = users;
      this.filteredAdmins = [...this.allAdmins];
      this.totalPagesAdmins = Math.ceil(this.filteredAdmins.length / 3);
      this.totalAdmins = this.allAdmins.length;
      this.updateStatistics();
    });
  }

  updateStatistics(): void {
    if (this.totalUsers > 0) {
      this.percentageTeachers = parseFloat(((this.totalTeachers / this.totalUsers) * 100).toFixed(2));
      this.percentageLearners = parseFloat(((this.totalLearners / this.totalUsers) * 100).toFixed(2));
      this.percentageAdmins = parseFloat(((this.totalAdmins / this.totalUsers) * 100).toFixed(2));
    } else {
      this.percentageTeachers = 0;
      this.percentageLearners = 0;
      this.percentageAdmins = 0;
    }
  }

  

  onSearchByName(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredUsers = [...this.allUsers];
      this.filteredTeachers = [...this.allTeachers];
      this.filteredLearners = [...this.allLearners];
      this.filteredAdmins = [...this.allAdmins];
    } else {
      this.filteredUsers = this.allUsers.filter(user =>
        user.first_name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      this.filteredTeachers = this.allTeachers.filter(user =>
        user.first_name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      this.filteredLearners = this.allLearners.filter(user =>
        user.first_name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      this.filteredAdmins = this.allAdmins.filter(user =>
        user.first_name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    this.totalPagesAll = Math.ceil(this.filteredUsers.length / 3);
    this.totalPagesTeachers = Math.ceil(this.filteredTeachers.length / 3);
    this.totalPagesLearners = Math.ceil(this.filteredLearners.length / 3);
    this.totalPagesAdmins = Math.ceil(this.filteredAdmins.length / 3);
  }

  changePageAll(page: number): void {
    if (page < 1 || page > this.totalPagesAll) return;
    this.currentPageAll = page;
  }

  changePageTeachers(page: number): void {
    if (page < 1 || page > this.totalPagesTeachers) return;
    this.currentPageTeachers = page;
  }

  changePageLearners(page: number): void {
    if (page < 1 || page > this.totalPagesLearners) return;
    this.currentPageLearners = page;
  }

  changePageAdmins(page: number): void {
    if (page < 1 || page > this.totalPagesAdmins) return;
    this.currentPageAdmins = page;
  }

  banOrUnbanUser(user: User): void {
    if (!user || !user.id) {
      console.error('Invalid user object');
      return;
    }

    const action = user.banned ? this.userService.unbanUser(user.id) : this.userService.banUser(user.id);
    
    action.subscribe({
      next: () => {
        console.log(`User ${user.banned ? 'unbanned' : 'banned'} successfully`);
        this.refreshUsers(user.role);
      },
      error: (error) => {
        console.error('Error updating user ban status:', error);
      }
    });
  }

  refreshUsers(role: string): void {
    if (role === 'Teacher') {
      this.getTeachers();
    } else if (role === 'Learner') {
      this.getLearners();
    } else if (role === 'Admin') {
      this.getAdmins();
    }
    this.getAllUsers();
  }

  getUserImage(fileName: string): string {
    return this.userService.getUserImage(fileName);
  }

}
