import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from '../../Shared/services/user/user.service';
import { User } from 'src/app/Shared/models/user';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css']
})
export class TeachersComponent implements OnInit, AfterViewInit {
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
  bannedUsers: User[] = [];
  filteredBannedUsers: User[] = [];
  totalBanned: number = 0;
  percentageBanned: number = 0;
  totalPagesBanned: number = 1;
  currentPageBanned: number = 1;
  bannedTeachers: User[] = [];
  bannedLearners: User[] = [];
  bannedAdmins: User[] = [];
  bannedUsersChart: any;
  bannedDistributionChart: any;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getAllUsers();
    this.getTeachers();
    this.getLearners();
    this.getAdmins();
    this.getBannedUsers();
    this.getBannedUsersByRole(); // Add this line
  }

  getBannedUsersByRole(): void {
    // Get banned teachers
    this.userService.getBannedUsersByRole('Teacher').subscribe({
      next: (users: User[]) => {
        this.bannedTeachers = users;
        console.log('Banned Teachers:', this.bannedTeachers);
      },
      error: (error) => {
        console.error('Error fetching banned teachers:', error);
      }
    });
    // Get banned learners
    this.userService.getBannedUsersByRole('Learner').subscribe({
      next: (users: User[]) => {
        this.bannedLearners = users;
        console.log('Banned Learners:', this.bannedLearners);
      },
      error: (error) => {
        console.error('Error fetching banned learners:', error);
      }
    });

    // Get banned admins
    this.userService.getBannedUsersByRole('Admin').subscribe({
      next: (users: User[]) => {
        this.bannedAdmins = users;
        console.log('Banned Admins:', this.bannedAdmins);
      },
      error: (error) => {
        console.error('Error fetching banned admins:', error);
      }
    });
  }

  ngAfterViewInit(): void {
    // Initial chart rendering (will be updated when data arrives)
    this.renderBannedUsersCharts();
  }

  getAllUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.allUsers = users;
        this.filteredUsers = [...this.allUsers];
        this.totalPagesAll = Math.ceil(this.filteredUsers.length / 3);
        this.totalUsers = this.allUsers.length;
        this.updateStatistics();
      },
      error: (error) => {
        console.error('Error fetching all users:', error);
      }
    });
  }

  getTeachers(): void {
    this.userService.getUsersByRole('Teacher').subscribe({
      next: (users: User[]) => {
        this.allTeachers = users;
        this.filteredTeachers = [...this.allTeachers];
        this.totalPagesTeachers = Math.ceil(this.filteredTeachers.length / 3);
        this.totalTeachers = this.allTeachers.length;
        this.updateStatistics();
      },
      error: (error) => {
        console.error('Error fetching teachers:', error);
      }
    });
  }

  getLearners(): void {
    this.userService.getUsersByRole('Learner').subscribe({
      next: (users: User[]) => {
        this.allLearners = users;
        this.filteredLearners = [...this.allLearners];
        this.totalPagesLearners = Math.ceil(this.filteredLearners.length / 3);
        this.totalLearners = this.allLearners.length;
        this.updateStatistics();
      },
      error: (error) => {
        console.error('Error fetching learners:', error);
      }
    });
  }

  getAdmins(): void {
    this.userService.getUsersByRole('Admin').subscribe({
      next: (users: User[]) => {
        this.allAdmins = users;
        this.filteredAdmins = [...this.allAdmins];
        this.totalPagesAdmins = Math.ceil(this.filteredAdmins.length / 3);
        this.totalAdmins = this.allAdmins.length;
        this.updateStatistics();
      },
      error: (error) => {
        console.error('Error fetching admins:', error);
      }
    });
  }

  updateStatistics(): void {
    if (this.totalUsers > 0) {
      this.percentageTeachers = parseFloat(((this.totalTeachers / this.totalUsers) * 100).toFixed(2));
      this.percentageLearners = parseFloat(((this.totalLearners / this.totalUsers) * 100).toFixed(2));
      this.percentageAdmins = parseFloat(((this.totalAdmins / this.totalUsers) * 100).toFixed(2));
      this.percentageBanned = parseFloat(((this.totalBanned / this.totalUsers) * 100).toFixed(2));
    } else {
      this.percentageTeachers = 0;
      this.percentageLearners = 0;
      this.percentageAdmins = 0;
      this.percentageBanned = 0;
    }
  }

  onSearchByName(): void {
    const query = this.searchQuery.toLowerCase();

    // Filter all users
    this.filteredUsers = this.allUsers.filter(user =>
      user.first_name?.toLowerCase().includes(query) || 
      user.last_name?.toLowerCase().includes(query)
    );

    // Filter teachers
    this.filteredTeachers = this.allTeachers.filter(user =>
      user.first_name?.toLowerCase().includes(query) || 
      user.last_name?.toLowerCase().includes(query)
    );

    // Filter learners
    this.filteredLearners = this.allLearners.filter(user =>
      user.first_name?.toLowerCase().includes(query) || 
      user.last_name?.toLowerCase().includes(query)
    );

    // Filter admins
    this.filteredAdmins = this.allAdmins.filter(user =>
      user.first_name?.toLowerCase().includes(query) || 
      user.last_name?.toLowerCase().includes(query)
    );

    // Filter banned users
    this.filteredBannedUsers = this.bannedUsers.filter(user =>
      user.first_name?.toLowerCase().includes(query) || 
      user.last_name?.toLowerCase().includes(query)
    );

    // Update pagination
    this.totalPagesAll = Math.ceil(this.filteredUsers.length / 3);
    this.totalPagesTeachers = Math.ceil(this.filteredTeachers.length / 3);
    this.totalPagesLearners = Math.ceil(this.filteredLearners.length / 3);
    this.totalPagesAdmins = Math.ceil(this.filteredAdmins.length / 3);
    this.totalPagesBanned = Math.ceil(this.filteredBannedUsers.length / 3);

    // Reset to first page
    this.currentPageAll = 1;
    this.currentPageTeachers = 1;
    this.currentPageLearners = 1;
    this.currentPageAdmins = 1;
    this.currentPageBanned = 1;
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

  changePageBanned(page: number): void {
    if (page < 1 || page > this.totalPagesBanned) return;
    this.currentPageBanned = page;
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
        user.banned = !user.banned; // Update the local state immediately
        this.refreshUsers();
        this.getBannedUsers(); // Make sure to refresh the banned users list
      },
      error: (error) => {
        console.error('Error updating user ban status:', error);
      }
    });
  }

  refreshUsers(): void {
    this.getAllUsers();
    this.getTeachers();
    this.getLearners();
    this.getAdmins();
  }

  getUserImage(fileName: string): string {
    return this.userService.getUserImage(fileName);
  }

  getBannedUsers(): void {
    this.userService.getAllBannedUsers().subscribe({
      next: (users: User[]) => {
        this.bannedUsers = users;
        this.filteredBannedUsers = [...this.bannedUsers];
        this.totalBanned = this.bannedUsers.length;
        this.totalPagesBanned = Math.ceil(this.filteredBannedUsers.length / 3);
        this.updateStatistics();
        this.renderBannedUsersCharts(); // Add this line to update charts when data is loaded
      },
      error: (error) => {
        this.renderBannedUsersCharts(); // Still render charts with empty data
      }
    });
  }

  renderBannedUsersCharts(): void {
    setTimeout(() => {
      // Destroy existing charts if they exist
      if (this.bannedUsersChart) {
        this.bannedUsersChart.destroy();
      }
      if (this.bannedDistributionChart) {
        this.bannedDistributionChart.destroy();
      }
  
      // Render banned vs active users pie chart
      const ctxPie = document.getElementById('bannedPercentageChart') as HTMLCanvasElement;
      if (ctxPie) {
        this.bannedUsersChart = new Chart(ctxPie, {
          type: 'doughnut',
          data: {
            labels: ['Banned Users', 'Active Users'],
            datasets: [{
              data: [this.totalBanned, this.totalUsers - this.totalBanned],
              backgroundColor: ['rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)'],
              borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: `Banned vs Active Users (${this.percentageBanned.toFixed(1)}%)`,
                font: {
                  size: 16
                }
              },
              legend: {
                position: 'bottom'
              }
            }
          }
        });
      }
  
      // Render banned users by role bar chart
      const bannedData = {
        'Teachers': this.bannedTeachers.length,
        'Learners': this.bannedLearners.length,
        'Admins': this.bannedAdmins.length
      };
  
      const ctxBar = document.getElementById('bannedUsersChart') as HTMLCanvasElement;
      if (ctxBar) {
        const roles = Object.keys(bannedData);
        const counts = Object.values(bannedData);
        
        // Generate colors
        const backgroundColors = roles.map((_, i) => 
          `hsla(${i * (360 / roles.length)}, 70%, 60%, 0.7)`
        );
  
        this.bannedDistributionChart = new Chart(ctxBar, {
          type: 'bar',
          data: {
            labels: roles,
            datasets: [{
              label: 'Banned Users by Role',
              data: counts,
              backgroundColor: backgroundColors,
              borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            scales: {
              x: {
                beginAtZero: true
              }
            },
            plugins: {
              title: {
                display: true,
                text: 'Banned Users Distribution by Role',
                font: {
                  size: 16
                }
              },
              legend: {
                display: false
              }
            }
          }
        });
      }
    }, 100);
  }



  downloadUserPdf(userId: number): void {
    this.userService.downloadUserPdf(userId).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `user_profile_${userId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error downloading PDF:', error);
        // Optionally show an error message to the user
      }
    );
  }
  
}