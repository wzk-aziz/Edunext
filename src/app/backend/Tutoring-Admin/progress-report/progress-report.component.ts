import { Component, OnInit } from '@angular/core';
import { ProgressReport } from './progress-report.model';
import { ProgressReportService } from '../Tutoring-Services/progress-report.service';
import { Observable, of } from 'rxjs';

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

  // In createProgressReport method
  createProgressReport(): void {
    this.loading = true;
    this.error = null;
    
    // Check for required fields first
    if (!this.newProgressReport.learnerId || !this.newProgressReport.mentorshipProgramId) {
      this.error = "Learner ID and Mentorship Program ID are required";
      this.loading = false;
      return;
    }
    
    // Create a progress report object with non-nullable values
    const reportToAdd: Partial<ProgressReport> = {
      reportContent: this.newProgressReport.reportContent,
      reportDate: this.reportDateString ? new Date(this.reportDateString) : new Date(),
      learnerId: this.newProgressReport.learnerId,
      mentorshipProgramId: this.newProgressReport.mentorshipProgramId
    };
    
    console.log('Adding progress report with data:', reportToAdd);
    
    this.progressReportService.createProgressReport(reportToAdd).subscribe({
      next: (data) => {
        console.log('Add successful, response:', data);
        
        // Ensure the data has the correct shape
        const newReport: ProgressReport = {
          idReport: data.idReport,
          reportContent: data.reportContent,
          reportDate: data.reportDate,
          learnerId: data.learnerId || reportToAdd.learnerId!,  // Non-null assertion
          mentorshipProgramId: data.mentorshipProgramId || reportToAdd.mentorshipProgramId!,  // Non-null assertion
          learner: data.learner || { idLearner: reportToAdd.learnerId! },  // Non-null assertion
          mentorshipProgram: data.mentorshipProgram || { idMentorshipProgram: reportToAdd.mentorshipProgramId! }  // Non-null assertion
        };
        
        this.progressReports.push(newReport);
        this.filteredProgressReports = [...this.progressReports];
        this.paginate();
        this.resetForm();
        this.loading = false;
        alert('Progress Report added successfully!');
      },
      error: (error) => {
        // Error handling logic
      }
    });
  }
  
  // Similar changes for updateProgressReport

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

  updateProgressReport(): void {
    if (!this.selectedProgressReport) return;
    
    this.loading = true;
    this.error = null;
    
    // Create a report object for update
    const reportToUpdate = {
      ...this.selectedProgressReport,
      reportDate: this.selectedReportDateString ? new Date(this.selectedReportDateString) : new Date()
    };
    
    console.log('Updating progress report with data:', reportToUpdate);
    
    this.progressReportService.updateProgressReport(reportToUpdate as ProgressReport).subscribe({
      next: (data) => {
        console.log('Update successful, response:', data);
        
        // Update in local list
        const index = this.progressReports.findIndex(r => r.idReport === data.idReport);
        if (index !== -1) {
          this.progressReports[index] = data;
        }
        
        this.filteredProgressReports = [...this.progressReports];
        this.paginate();
        this.selectedProgressReport = null;
        this.showProgressReportList = true;
        this.loading = false;
        alert('Progress Report updated successfully!');
      },
      error: (error) => {
        console.error('Update failed:', error);
        this.error = `Update failed: ${error.message}`;
        this.loading = false;
      }
    });
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
        alert('Progress Report deleted successfully!');
      },
      error: (error) => {
        console.error('Delete failed:', error);
        this.error = `Delete failed: ${error.message}`;
        this.loading = false;
      }
    });
  }

  clearSelection(): void {
    this.selectedProgressReport = null;
    this.showProgressReportList = true;
    this.showCreateForm = false;
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



}