import { Component, OnInit } from '@angular/core';
import { UserService, BanStats } from '../../Shared/services/user/user.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.css']
})
export class UserStatsComponent implements OnInit {
  teacherStats: BanStats = { banned: 0, notBanned: 0 };
  learnerStats: BanStats = { banned: 0, notBanned: 0 };
  loading: boolean = false;
  error: string | null = null;

  // Chart data
  chartData: any;
  chartOptions: any;

  constructor(private userService: UserService) {
    this.initializeChartData();
  }

  ngOnInit(): void {
    this.loadStats();
  }

  private initializeChartData(): void {
    this.chartData = {
      labels: ['Teachers', 'Learners'],
      datasets: [
        {
          data: [0, 0],
          backgroundColor: ['#36A2EB', '#FF6384']
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false
    };
  }

  loadStats(): void {
    this.loading = true;
    this.error = null;

    forkJoin({
      teachers: this.userService.getBanStatsByRole('TEACHER'),
      learners: this.userService.getBanStatsByRole('LEARNER')
    }).subscribe({
      next: (results) => {
        this.teacherStats = results.teachers;
        this.learnerStats = results.learners;
        this.updateChartData();
      },
      error: (err) => {
        console.error('Error loading stats:', err);
        this.error = 'Failed to load statistics';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private updateChartData(): void {
    const teacherTotal = this.teacherStats.banned + this.teacherStats.notBanned;
    const learnerTotal = this.learnerStats.banned + this.learnerStats.notBanned;

    this.chartData = {
      ...this.chartData,
      datasets: [{
        data: [teacherTotal, learnerTotal],
        backgroundColor: ['#36A2EB', '#FF6384']
      }]
    };
  }

  getPercentage(value: number, total: number): string {
    if (total === 0) return '0%';
    return ((value / total) * 100).toFixed(1) + '%';
  }
}