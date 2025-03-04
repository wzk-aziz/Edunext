import { ProgressReport } from './progress-report.model';
import { ProgressReportService } from '../Tutoring-Services/progress-report.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-progress-report',
  templateUrl: './progress-report.component.html',
  styleUrls: ['./progress-report.component.css']
})
export class ProgressReportComponent implements OnInit {
  displayedColumns: string[] = ['idReport', 'reportContent', 'reportDate', 'learnerId', 'mentorshipProgramId', 'actions'];
  progressReports: ProgressReport[] = [];
  filteredProgressReports: ProgressReport[] = [];
  newProgressReport: ProgressReport = {
    idReport: 0,
    reportContent: '',
    reportDate: new Date(),
    learnerId: 0,
    mentorshipProgramId: 0
  };
  selectedProgressReport: ProgressReport | null = null;
  reportDateString: string = ''; // For datetime-local input
  selectedReportDateString: string = ''; // For datetime-local input in edit form
  showProgressReportList = true;
  showCreateForm = false;
  searchTerm: string = '';
  loading: boolean = false;
  error: string | null = null;
  
  // For pagination
  currentPage: number = 1;
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  paginatedReports: ProgressReport[] = [];
  Math = Math; // For template access
  
  // For filtering
  filters: {
    contentSearch: string | null;
    dateFrom: Date | null;
    dateTo: Date | null;
  } = {
    contentSearch: null,
    dateFrom: null,
    dateTo: null
  };

  @ViewChild('confettiCanvas') confettiCanvas: ElementRef | undefined;

    // In progress-report.component.ts - add this property
  formSubmitted: boolean = false;

    // Add these ViewChild references
  @ViewChild('reportForm') reportForm!: NgForm;
  @ViewChild('editReportForm') editReportForm!: NgForm;

  constructor(private progressReportService: ProgressReportService) {
    // Format the current date for the datetime-local input
    const now = new Date();
    this.reportDateString = this.formatDateForInput(now);
  }

   ngOnInit(): void {
    // Debug
    console.log('Starting component...');
    
    // First let's inspect raw API data
    fetch('http://localhost:8087/progress-reports/all')
      .then(response => response.json())
      .then(data => {
        console.log('DIRECT API RESPONSE:', data);
        if (data && data.length > 0) {
          console.log('SAMPLE ITEM FORMAT:', data[0]);
        }
      })
      .catch(err => console.error('Error checking API directly:', err));
      
    this.fetchProgressReports();
  }

  // Helper method to format date for datetime-local input
  formatDateForInput(date: Date | string): string {
    // Check if it's already a Date object
    const d = date instanceof Date ? date : new Date(date);
    // Format: YYYY-MM-DD
    return d.toISOString().split('T')[0];
  }
  
  // Convert string from input to Date object
  parseInputDate(dateString: string): Date {
    return new Date(dateString);
  }

  fetchProgressReports(): void {
    this.loading = true;
    this.error = null;
    console.log('Fetching progress reports...');
    
    this.progressReportService.getAllProgressReports().subscribe({
      next: (data) => {
        console.log('Progress reports received:', data);
        this.progressReports = data;
        this.filteredProgressReports = [...this.progressReports];
        this.paginate(); // Apply pagination
        this.loading = false;
        console.log('Progress reports loaded:', this.progressReports.length);
      },
      error: (error) => {
        console.error('Failed to fetch progress reports:', error);
        this.error = `Failed to load progress reports: ${error.message}`;
        this.loading = false;
      }
    });
  }

  filterProgressReports(): void {
    // Reset filter if no search term
    if (!this.searchTerm) {
      this.filteredProgressReports = this.applyFilters([...this.progressReports]);
    } else {
      const search = this.searchTerm.toLowerCase();
      // In filterProgressReports method
      const filtered = this.progressReports.filter(report => 
        report.reportContent?.toLowerCase().includes(search) ||
        (report.learnerId?.toString() || '').includes(search) ||
        (report.mentorshipProgramId?.toString() || '').includes(search)
      );
      
      // Apply any active filters after search
      this.filteredProgressReports = this.applyFilters(filtered);
    }
    
    this.currentPage = 1; // Reset to first page when searching
    this.paginate(); // Apply pagination
  }

  // Apply filters method
  applyFilters(reports: ProgressReport[]): ProgressReport[] {
    let result = [...reports];
    
    // Filter by content search
    if (this.filters.contentSearch) {
      const search = this.filters.contentSearch.toLowerCase();
      result = result.filter(report => 
        report.reportContent.toLowerCase().includes(search)
      );
    }
    
    // Filter by date range
    if (this.filters.dateFrom) {
      const fromDate = new Date(this.filters.dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      result = result.filter(report => {
        const reportDate = new Date(report.reportDate);
        return reportDate >= fromDate;
      });
    }
    
    if (this.filters.dateTo) {
      const toDate = new Date(this.filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      result = result.filter(report => {
        const reportDate = new Date(report.reportDate);
        return reportDate <= toDate;
      });
    }
    
    return result;
  }

  clearFilters(): void {
    this.filters = {
      contentSearch: null,
      dateFrom: null,
      dateTo: null
    };
    this.searchTerm = '';
    this.filteredProgressReports = [...this.progressReports];
    this.currentPage = 1;
    this.paginate();
  }

  // Pagination methods
  paginate(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedReports = this.filteredProgressReports.slice(startIndex, endIndex);
  }

  nextPage(): void {
    const totalPages = Math.ceil(this.filteredProgressReports.length / this.pageSize);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.paginate();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginate();
    }
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1; // Reset to first page
    this.paginate();
  }

  showProgressReports(): void {
    this.showProgressReportList = true;
    this.showCreateForm = false;
    this.selectedProgressReport = null;
    this.fetchProgressReports();
  }

  showAddProgressReportForm(): void {
    this.showCreateForm = true;
    this.showProgressReportList = false;
    this.selectedProgressReport = null;
    this.error = null;
    
    // Reset the form with current date
    const now = new Date();
    this.reportDateString = this.formatDateForInput(now);
    this.newProgressReport = {
      idReport: 0,
      reportContent: '',
      reportDate: now,
      learnerId: 0,
      mentorshipProgramId: 0
    };
  }

  createProgressReport(): void {
    // Set formSubmitted to true immediately to show validation errors
    this.formSubmitted = true;
    
    // Force Angular to run validation before continuing
    setTimeout(() => {
      // Check if form is valid first
      if (this.reportForm && this.reportForm.invalid) {
        this.showToast('Please fill in all required fields', 'warning');
        return;
      }
      
      this.loading = true;
      this.error = null;
      
      // Keep original IDs for fallback
      const originalLearnerId = this.newProgressReport.learnerId;
      const originalProgramId = this.newProgressReport.mentorshipProgramId;
      
      // Create a progress report object with non-nullable values
      const reportToAdd = {
        reportContent: this.newProgressReport.reportContent,
        reportDate: this.reportDateString ? new Date(this.reportDateString) : new Date(),
        // Send IDs in multiple formats to ensure backend acceptance
        learnerId: originalLearnerId,
        mentorshipProgramId: originalProgramId,
        learner: {
          idLearner: originalLearnerId,
          id: originalLearnerId
        },
        mentorshipProgram: {
          idMentorshipProgram: originalProgramId,
          id: originalProgramId
        }
      };
      
      console.log('Adding progress report with data:', reportToAdd);
      
      this.progressReportService.createProgressReport(reportToAdd).subscribe({
        next: (data) => {
          console.log('Add successful, response:', data);
          
          // Ensure IDs are preserved if they come back null
          const createdReport = {
            ...data,
            learnerId: data.learnerId || originalLearnerId,
            mentorshipProgramId: data.mentorshipProgramId || originalProgramId
          };
          
          this.progressReports.push(createdReport);
          this.filteredProgressReports = [...this.progressReports];
          this.paginate();
          this.resetForm();
          this.loading = false;
          this.formSubmitted = false;
          this.showToast('Progress Report added successfully!', 'success');
          this.triggerConfetti();
        },
        error: (error) => {
          console.error('Add failed:', error);
          this.error = `Add failed: ${error.message}`;
          this.loading = false;
          this.showToast(`Failed to add progress report: ${error.message}`, 'error');
        }
      });
    }, 0);
  }

    updateProgressReport(): void {
      // Early validation
      if (!this.selectedProgressReport) {
        this.showToast('No report selected for update', 'warning');
        return;
      }
      
      // Set formSubmitted to true immediately to show validation errors
      this.formSubmitted = true;
      
      // Force Angular to run validation before continuing
      setTimeout(() => {
        // Check if form is valid first
        if (this.editReportForm && this.editReportForm.invalid) {
          this.showToast('Please fill in all required fields', 'warning');
          return;
        }
        
        this.loading = true;
        this.error = null;
        
        // Keep original IDs for fallback
        const originalLearnerId = this.selectedProgressReport!.learnerId;
        const originalProgramId = this.selectedProgressReport!.mentorshipProgramId;
        
        // Create a report object for update with multiple ID formats
        const reportToUpdate = {
          idReport: this.selectedProgressReport!.idReport,
          reportContent: this.selectedProgressReport!.reportContent,
          reportDate: this.selectedReportDateString ? new Date(this.selectedReportDateString) : new Date(),
          // Send IDs in multiple formats to ensure backend acceptance
          learnerId: originalLearnerId,
          mentorshipProgramId: originalProgramId,
          learner: {
            idLearner: originalLearnerId,
            id: originalLearnerId
          },
          mentorshipProgram: {
            idMentorshipProgram: originalProgramId,
            id: originalProgramId
          }
        };
        
        console.log('Updating progress report with data:', reportToUpdate);
        
        this.progressReportService.updateProgressReport(reportToUpdate as ProgressReport).subscribe({
          next: (data) => {
            console.log('Update successful, response:', data);
            
            // Ensure IDs are preserved if they come back null
            const updatedReport = {
              ...data,
              learnerId: data.learnerId || originalLearnerId,
              mentorshipProgramId: data.mentorshipProgramId || originalProgramId
            };
            
            // Update in local list
            const index = this.progressReports.findIndex(r => r.idReport === updatedReport.idReport);
            if (index !== -1) {
              this.progressReports[index] = updatedReport;
            }
            
            this.filteredProgressReports = [...this.progressReports];
            this.paginate();
            this.selectedProgressReport = null;
            this.showProgressReportList = true;
            this.loading = false;
            this.formSubmitted = false;
            this.showToast('Progress Report updated successfully!', 'success');
            this.triggerConfetti();
          },
          error: (error) => {
            console.error('Update failed:', error);
            this.error = `Update failed: ${error.message}`;
            this.loading = false;
            this.showToast(`Failed to update progress report: ${error.message}`, 'error');
          }
        });
      }, 0);
    }
  
// In resetForm method
resetForm(): void {
  this.newProgressReport = {
    idReport: 0,
    reportContent: '',
    reportDate: new Date(),
    learnerId: 0,
    mentorshipProgramId: 0
  };
  this.reportDateString = this.formatDateForInput(new Date());
  this.showProgressReportList = true;
  this.showCreateForm = false;
  this.formSubmitted = false; // Reset formSubmitted flag
}
  selectProgressReport(report: ProgressReport): void {
    // Create a deep copy to avoid modifying the original
    this.selectedProgressReport = { ...report };
    
    // Format date for the edit form
    if (report.reportDate) {
      this.selectedReportDateString = this.formatDateForInput(
        report.reportDate instanceof Date ? report.reportDate : new Date(report.reportDate)
      );
    }
    this.showCreateForm = false;
    this.showProgressReportList = false;
  }



  deleteProgressReport(id: number): void {
    if (!confirm('Are you sure you want to delete this progress report?')) return;
    
    this.loading = true;
    this.error = null;
    
    this.progressReportService.deleteProgressReport(id).subscribe({
      next: () => {
        // Remove from local lists
        this.progressReports = this.progressReports.filter(r => r.idReport !== id);
        this.filteredProgressReports = [...this.progressReports];
        this.paginate();
        this.loading = false;
        this.showToast('Progress Report deleted successfully!', 'success');
        this.triggerConfetti();
      },
      error: (error) => {
        console.error('Delete failed:', error);
        this.error = `Delete failed: ${error.message}`;
        this.loading = false;
        this.showToast(`Failed to delete progress report: ${error.message}`, 'error');
      }
    });
  }

// In clearSelection method
clearSelection(): void {
  this.selectedProgressReport = null;
  this.showProgressReportList = true;
  this.showCreateForm = false;
  this.formSubmitted = false; // Reset formSubmitted flag
}


debugData(): void {
  console.log('🔍 DEBUG INFO:');
  console.log(`Total reports: ${this.progressReports.length}`);
  console.log(`Filtered reports: ${this.filteredProgressReports.length}`);
  console.log(`Paginated reports: ${this.paginatedReports.length}`);
  console.log(`Current page: ${this.currentPage}`);
  
  if (this.progressReports.length > 0) {
    const sample = this.progressReports[0];
    console.log('Sample report:', sample);
    console.log('learnerId available:', sample.learnerId !== undefined);
    console.log('mentorshipProgramId available:', sample.mentorshipProgramId !== undefined);
  }
}


// Toast notification
showToast(message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  // Add to document
  document.body.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);
  
  // Remove after delay
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 3000);
}

// Confetti animation
triggerConfetti(): void {
  if (!this.confettiCanvas) return;
  
  const canvas = this.confettiCanvas.nativeElement;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const pieces: any[] = [];
  const numberOfPieces = 200;
  const colors = ['#f44336', '#2196f3', '#ffeb3b', '#4caf50', '#9c27b0'];

  function randomFromTo(from: number, to: number) {
    return Math.floor(Math.random() * (to - from + 1) + from);
  }
  
  for (let i = 0; i < numberOfPieces; i++) {
    pieces.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: randomFromTo(5, 10),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      speed: randomFromTo(1, 5),
      friction: 0.95,
      opacity: 1,
      yVel: 0,
      xVel: 0
    });
  }
  
  let rendered = 0;
  
  function renderConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    pieces.forEach((piece, i) => {
      piece.opacity -= 0.01;
      piece.yVel += 0.25;
      piece.xVel *= piece.friction;
      piece.yVel *= piece.friction;
      piece.rotation += 1;
      piece.x += piece.xVel + Math.random() * 2 - 1;
      piece.y += piece.yVel;
      
      if (piece.opacity <= 0) {
        pieces.splice(i, 1);
        return;
      }
      
      ctx.beginPath();
      ctx.arc(piece.x, piece.y, piece.radius, 0, Math.PI * 2);
      ctx.fillStyle = piece.color;
      ctx.globalAlpha = piece.opacity;
      ctx.fill();
    });

    rendered += 1;
    if (pieces.length > 0 && rendered < 500) {
      requestAnimationFrame(renderConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  
  // Initialize confetti velocities
  pieces.forEach((piece) => {
    piece.xVel = (Math.random() - 0.5) * 20;
    piece.yVel = (Math.random() - 0.5) * 20;
  });
  
  renderConfetti();
}



}