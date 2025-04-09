import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Submission } from 'src/app/Student-Pages/coding-game-student/models/submission.model';
import { SubmissionService } from 'src/app/Student-Pages/coding-game-student/services/submission.service';
import { Chart, ChartConfiguration, ChartOptions, registerables } from 'chart.js';

// Register all Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-submission-leaderboard',
  templateUrl: './submission-leaderboard.component.html',
  styleUrls: ['./submission-leaderboard.component.scss']
})
export class SubmissionLeaderboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('submissionsPerProblemChart') submissionsPerProblemCanvas!: ElementRef;
  @ViewChild('scoresPerStudentChart') scoresPerStudentCanvas!: ElementRef;
  @ViewChild('submissionStatusChart') submissionStatusCanvas!: ElementRef;
  
  // Data arrays
  submissionsByProblem: any[] = [];
  bestScores: any[] = [];
  sortedSubmissions: Submission[] = [];
  
  // Statistics calculated from data
  totalSubmissions: number = 0;
  averageScore: number = 0;
  acceptanceRate: number = 0;
  
  // Track charts for proper cleanup
  private charts: Chart[] = [];
  
  // Loading and error states
  loading: boolean = true;
  errorMessage: string = '';
  
  constructor(private submissionService: SubmissionService) {}

  ngOnInit(): void {
    this.loadAllData();
  }
  
  ngAfterViewInit(): void {
    // Charts will be initialized after data is loaded
  }
  
  ngOnDestroy(): void {
    // Clean up charts to prevent memory leaks
    this.charts.forEach(chart => chart.destroy());
  }
  
  loadAllData(): void {
    this.loading = true;
    this.errorMessage = '';
    console.log('Starting data loading process');
    
    // Use Promise.all to wait for all requests to complete
    Promise.all([
      this.loadSubmissionsPerProblem(),
      this.loadBestScoresPerStudent(),
      this.loadAllSortedSubmissions()
    ]).then(() => {
      console.log('All data loaded successfully');
      
      this.calculateStatistics();
      
      // Add a small delay to ensure ViewChildren are ready
      setTimeout(() => {
        this.initializeCharts();
        this.loading = false;
      }, 100);
    }).catch(error => {
      console.error('Error loading data:', error);
      this.errorMessage = 'Failed to load dashboard data. Please try again later.';
      this.loading = false;
    });
  }

  loadSubmissionsPerProblem(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.submissionService.getSubmissionsPerProblem().subscribe({
        next: (data) => {
          this.submissionsByProblem = data || [];
          resolve();
        },
        error: (error) => {
          console.error('Error loading submissions per problem:', error);
          this.submissionsByProblem = [];
          reject(error);
        }
      });
    });
  }

  loadBestScoresPerStudent(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.submissionService.getBestScoresPerStudent().subscribe({
        next: (data) => {
          this.bestScores = data || [];
          resolve();
        },
        error: (error) => {
          console.error('Error loading best scores:', error);
          this.bestScores = [];
          reject(error);
        }
      });
    });
  }

  loadAllSortedSubmissions(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.submissionService.getAllSubmissionsSorted().subscribe({
        next: (data) => {
          this.sortedSubmissions = data || [];
          resolve();
        },
        error: (error) => {
          console.error('Error loading sorted submissions:', error);
          this.sortedSubmissions = [];
          reject(error);
        }
      });
    });
  }
  
  calculateStatistics(): void {
    // Calculate total submissions
    this.totalSubmissions = this.sortedSubmissions.length;
    
    // Calculate average score
    if (this.totalSubmissions > 0) {
      const totalScore = this.sortedSubmissions.reduce((sum, sub) => sum + (sub.score ?? 0), 0);
      this.averageScore = Math.round((totalScore / this.totalSubmissions) * 10) / 10;
    }
    
    // Calculate acceptance rate
    const acceptedSubmissions = this.sortedSubmissions.filter(sub => sub.status === 'ACCEPTED').length;
    this.acceptanceRate = this.totalSubmissions > 0 
      ? Math.round((acceptedSubmissions / this.totalSubmissions) * 100) 
      : 0;
  }
  
  initializeCharts(): void {
  // Add a check to ensure canvas elements and data are available
  if (!this.submissionsPerProblemCanvas?.nativeElement || 
      !this.scoresPerStudentCanvas?.nativeElement || 
      !this.submissionStatusCanvas?.nativeElement) {
    console.error('One or more chart canvas elements not found');
    setTimeout(() => this.initializeCharts(), 100); // Retry after a short delay
    return;
  }
  
  if (this.submissionsByProblem.length === 0 || 
      this.bestScores.length === 0 || 
      this.sortedSubmissions.length === 0) {
    console.warn('Chart data not available yet');
    return;
  }
  
  try {
    this.createSubmissionsPerProblemChart();
    this.createScoresPerStudentChart();
    this.createSubmissionStatusChart();
  } catch (error) {
    console.error('Error initializing charts:', error);
    this.errorMessage = 'Failed to initialize charts. Please refresh the page.';
  }
}
  
  createSubmissionsPerProblemChart(): void {
    if (!this.submissionsPerProblemCanvas?.nativeElement) {
      console.warn('Canvas element for submissions per problem chart not found');
      return;
    }
    
    try {
      const ctx = this.submissionsPerProblemCanvas.nativeElement.getContext('2d');
      
      if (!ctx) {
        console.warn('Could not get canvas context');
        return;
      }
      
      // Check if we have data
      if (!this.submissionsByProblem || this.submissionsByProblem.length === 0) {
        console.warn('No data for submissions per problem chart');
        return;
      }
      
      const problemIds = this.submissionsByProblem.map(item => `Problem ${item[0]}`);
      const counts = this.submissionsByProblem.map(item => item[1]);
      
      // Destroy existing chart if it exists
      const existingChart = Chart.getChart(ctx.canvas);
      if (existingChart) {
        existingChart.destroy();
      }
      
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: problemIds,
          datasets: [{
            label: 'Number of Submissions',
            data: counts,
            backgroundColor: 'rgba(52, 152, 219, 0.7)',
            borderColor: 'rgba(52, 152, 219, 1)',
            borderWidth: 1,
            borderRadius: 4,
            barThickness: 'flex',
            maxBarThickness: 35
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(44, 62, 80, 0.9)',
              titleFont: {
                size: 13
              },
              bodyFont: {
                size: 12
              },
              callbacks: {
                label: function(context) {
                  return `Submissions: ${context.raw}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                // Fix: Remove borderWidth property
                color: 'rgba(224, 224, 224, 0.5)',
              },
              ticks: {
                font: {
                  size: 11
                }
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                font: {
                  size: 11
                }
              }
            }
          }
        }
      });
      
      this.charts.push(chart);
    } catch (error) {
      console.error('Error creating submissions per problem chart:', error);
    }
  }
  
  createScoresPerStudentChart(): void {
    if (!this.scoresPerStudentCanvas?.nativeElement) {
      console.warn('Canvas element for scores per student chart not found');
      return;
    }
    
    try {
      const ctx = this.scoresPerStudentCanvas.nativeElement.getContext('2d');
      
      if (!ctx) {
        console.warn('Could not get canvas context');
        return;
      }
      
      // Check if we have data
      if (!this.bestScores || this.bestScores.length === 0) {
        console.warn('No data for scores per student chart');
        return;
      }
      
      const studentIds = this.bestScores.map(item => `Student ${item[0]}`);
      const scores = this.bestScores.map(item => item[1]);
      
      // Limit to top 8 students if there are many
      const displayLimit = 8;
      let displayStudentIds = studentIds;
      let displayScores = scores;
      
      if (studentIds.length > displayLimit) {
        displayStudentIds = studentIds.slice(0, displayLimit);
        displayScores = scores.slice(0, displayLimit);
      }
      
      // Destroy existing chart if it exists
      const existingChart = Chart.getChart(ctx.canvas);
      if (existingChart) {
        existingChart.destroy();
      }
      
      const chart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: displayStudentIds,
          datasets: [{
            label: 'Best Scores',
            data: displayScores,
            backgroundColor: 'rgba(46, 204, 113, 0.2)',
            borderColor: 'rgba(46, 204, 113, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(46, 204, 113, 1)',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(46, 204, 113, 1)',
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(44, 62, 80, 0.9)',
              callbacks: {
                label: function(context) {
                  return `Score: ${context.raw}`;
                }
              }
            }
          },
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
              ticks: {
                stepSize: 20,
                backdropColor: 'transparent',
                font: {
                  size: 10
                }
              },
              grid: {
                color: 'rgba(224, 224, 224, 0.5)',
              },
              angleLines: {
                color: 'rgba(224, 224, 224, 0.5)',
              },
              pointLabels: {
                font: {
                  size: 11
                }
              }
            }
          }
        }
      });
      
      this.charts.push(chart);
    } catch (error) {
      console.error('Error creating scores per student chart:', error);
    }
  }
  
  createSubmissionStatusChart(): void {
    if (!this.submissionStatusCanvas?.nativeElement) {
      console.warn('Canvas element for submission status chart not found');
      return;
    }
    
    try {
      const ctx = this.submissionStatusCanvas.nativeElement.getContext('2d');
      
      if (!ctx) {
        console.warn('Could not get canvas context');
        return;
      }
      
      // Check if we have data
      if (!this.sortedSubmissions || this.sortedSubmissions.length === 0) {
        console.warn('No data for submission status chart');
        return;
      }
      
      // Count submissions by status
      const statusCounts: { [key: string]: number } = {};
      this.sortedSubmissions.forEach(sub => {
        const status = sub.status || 'UNKNOWN';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
      
      const labels = Object.keys(statusCounts);
      const data = Object.values(statusCounts);
      
      // Define colors for each status
      const backgroundColors = [
        'rgba(46, 204, 113, 0.8)',  // ACCEPTED (green)
        'rgba(231, 76, 60, 0.8)',   // WRONG_ANSWER (red)
        'rgba(243, 156, 18, 0.8)',  // Others (orange)
        'rgba(52, 152, 219, 0.8)',  // COMPILATION_ERROR (blue)
        'rgba(155, 89, 182, 0.8)',  // RUNTIME_ERROR (purple)
        'rgba(189, 195, 199, 0.8)'  // UNKNOWN (gray)
      ];
      
      // Ensure we have enough colors for all statuses
      const colorMap: { [key: string]: string } = {};
      labels.forEach((status, index) => {
        // Prioritize specific colors for common statuses
        if (status === 'ACCEPTED') {
          colorMap[status] = backgroundColors[0];
        } else if (status === 'WRONG_ANSWER') {
          colorMap[status] = backgroundColors[1];
        } else if (status === 'UNKNOWN') {
          colorMap[status] = backgroundColors[5];
        } else {
          // For other statuses, use remaining colors or cycle
          const colorIndex = (index % (backgroundColors.length - 3)) + 2;
          colorMap[status] = backgroundColors[colorIndex];
        }
      });
      
      const colors = labels.map(status => colorMap[status]);
      
      // Destroy existing chart if it exists
      const existingChart = Chart.getChart(ctx.canvas);
      if (existingChart) {
        existingChart.destroy();
      }
      
      const doughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: colors,
            borderColor: 'rgba(255, 255, 255, 0.8)',
            borderWidth: 2,
            hoverOffset: 10
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '60%',
          plugins: {
            legend: {
              position: 'right',
              labels: {
                padding: 15,
                usePointStyle: true,
                pointStyle: 'circle',
                font: {
                  size: 11
                }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(44, 62, 80, 0.9)',
              callbacks: {
                label: function(context) {
                  const value = context.raw as number;
                  const total = (context.chart.data.datasets[0].data as number[]).reduce((sum, val) => sum + val, 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${context.label}: ${value} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
      
      // Fix: Type casting to make TypeScript happy
      this.charts.push(doughnutChart as Chart);
    } catch (error) {
      console.error('Error creating submission status chart:', error);
    }
  }
  
  // Method to reload data (can be called from UI)
  refreshData(): void {
    this.loadAllData();
  }
  
  // Method to export data to CSV (optional)
  exportToCSV(): void {
    if (!this.sortedSubmissions || this.sortedSubmissions.length === 0) {
      this.errorMessage = 'No data to export';
      return;
    }
    
    try {
      // Basic CSV header
      let csvContent = 'ID,Student,Problem,Score,Status,Timestamp\n';
      
      // Add each submission as a row
      this.sortedSubmissions.forEach(sub => {
        const row = [
          sub.id || '',
          sub.student?.id || '',
          sub.problem?.id || '',
          sub.score || 0,
          sub.status || 'UNKNOWN',
        ].join(',');
        
        csvContent += row + '\n';
      });
      
      // Create downloadable link
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', 'submission_data.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      this.errorMessage = 'Failed to export data. Please try again.';
    }
  }

}