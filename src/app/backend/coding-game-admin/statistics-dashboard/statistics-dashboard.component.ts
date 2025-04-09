// statistics-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { SubmissionService } from 'src/app/Student-Pages/coding-game-student/services/submission.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-statistics-dashboard',
  templateUrl: './statistics-dashboard.component.html',
  styleUrls: ['./statistics-dashboard.component.scss']
})
export class StatisticsDashboardComponent implements OnInit {
  // Data for charts
  submissionsByProblem: any[] = [];
  bestScores: any[] = [];
  sortedSubmissions: any[] = [];
  
  // Problem submission chart
  problemBarChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Submissions per Problem' }]
  };
  
  // Student scores chart
  scoreBarChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Best Scores per Student' }]
  };
  
  // Donut chart for submission statuses
  statusDonutChartData: ChartData<'doughnut'> = {
    labels: ['ACCEPTED', 'WRONG_ANSWER', 'NO_EXPECTED_OUTPUT', 'NO_PROBLEM'],
    datasets: [{ data: [0, 0, 0, 0] }]
  };
  
  // Chart options
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        min: 0
      }
    },
    plugins: {
      legend: {
        display: true,
      }
    }
  };
  
  donutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      }
    }
  };
  
  // Chart types
  barChartType: ChartType = 'bar';
  donutChartType: ChartType = 'doughnut';
  
  // Loading states
  isLoading = true;
  loadingMessage = 'Loading dashboard data...';
  
  // Error state
  hasError = false;
  errorMessage = '';
  
  // Dashboard summary stats
  totalSubmissions = 0;
  averageScore = 0;
  highestScore = 0;
  
  constructor(
    private submissionService: SubmissionService,
    private spinner: NgxSpinnerService
  ) {}
  
  ngOnInit(): void {
    this.spinner.show();
    Promise.all([
      this.loadSubmissionsPerProblem(),
      this.loadBestScoresPerStudent(),
      this.loadAllSortedSubmissions()
    ]).then(() => {
      this.calculateSummaryStatistics();
      this.spinner.hide();
      this.isLoading = false;
    }).catch(error => {
      this.hasError = true;
      this.errorMessage = 'Failed to load dashboard data: ' + error.message;
      this.spinner.hide();
      this.isLoading = false;
    });
  }
  
  loadSubmissionsPerProblem(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.submissionService.getSubmissionsPerProblem().subscribe({
        next: (data) => {
          this.submissionsByProblem = data;
          
          // Prepare chart data
          this.problemBarChartData.labels = data.map(item => `Problem ${item[0]}`);
          this.problemBarChartData.datasets[0].data = data.map(item => item[1]);
          
          resolve();
        },
        error: (err) => reject(err)
      });
    });
  }
  
  loadBestScoresPerStudent(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.submissionService.getBestScoresPerStudent().subscribe({
        next: (data) => {
          this.bestScores = data;
          
          // Prepare chart data
          this.scoreBarChartData.labels = data.map(item => `Student ${item[0]}`);
          this.scoreBarChartData.datasets[0].data = data.map(item => item[1]);
          
          resolve();
        },
        error: (err) => reject(err)
      });
    });
  }
  
  loadAllSortedSubmissions(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.submissionService.getAllSubmissionsSorted().subscribe({
        next: (data) => {
          this.sortedSubmissions = data;
          
          // Count submissions by status for donut chart
          const statusCounts = {
            'ACCEPTED': 0,
            'WRONG_ANSWER': 0,
            'NO_EXPECTED_OUTPUT': 0,
            'NO_PROBLEM': 0
          };
          
          data.forEach(submission => {
            if (submission.status && statusCounts.hasOwnProperty(submission.status)) {
              if (submission.status in statusCounts) {
                statusCounts[submission.status as keyof typeof statusCounts]++;
              }
            }
          });
          
          this.statusDonutChartData.datasets[0].data = [
            statusCounts['ACCEPTED'],
            statusCounts['WRONG_ANSWER'],
            statusCounts['NO_EXPECTED_OUTPUT'],
            statusCounts['NO_PROBLEM']
          ];
          
          resolve();
        },
        error: (err) => reject(err)
      });
    });
  }
  
  calculateSummaryStatistics(): void {
    this.totalSubmissions = this.sortedSubmissions.length;
    
    // Calculate average score
    const totalScore = this.sortedSubmissions.reduce((sum, sub) => sum + (sub.score || 0), 0);
    this.averageScore = this.totalSubmissions > 0 ? Math.round(totalScore / this.totalSubmissions) : 0;
    
    // Find highest score
    this.highestScore = this.sortedSubmissions.length > 0 ? 
      Math.max(...this.sortedSubmissions.map(sub => sub.score || 0)) : 0;
  }
}