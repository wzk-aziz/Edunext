import { Component, OnInit } from '@angular/core';
import { ProgressReportService } from './progress-report.service';
import { ProgressReport } from './progress-report.model';

@Component({
  selector: 'app-progress-report',
  templateUrl: './progress-report.component.html',
  styleUrls: ['./progress-report.component.css']
})
export class ProgressReportComponent implements OnInit {
  progressReports: ProgressReport[] = [];
  filteredProgressReports: ProgressReport[] = [];
  newProgressReport: ProgressReport = {
    id_report: 0,
    report_content: '',
    report_date: new Date(),
    learner_id: 0,
    mentorship_program_id: 0
  };
  selectedProgressReport: ProgressReport | null = null;
  showCreateForm = false;
  searchTerm: string = '';

  constructor(private progressReportService: ProgressReportService) {}

  ngOnInit(): void {
    this.fetchProgressReports();
  }

  fetchProgressReports() {
    this.progressReportService.getProgressReports().subscribe((data: ProgressReport[]) => {
      this.progressReports = data;
      this.filteredProgressReports = data;
    }, error => {
      console.error('Error fetching progress reports:', error);
    });
  }

  filterProgressReports() {
    this.filteredProgressReports = this.progressReports.filter(report =>
      report.report_content.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      report.learner_id.toString().includes(this.searchTerm) ||
      report.mentorship_program_id.toString().includes(this.searchTerm)
    );
  }

  createProgressReport(): void {
    this.progressReportService.addProgressReport(this.newProgressReport).subscribe((data: ProgressReport) => {
      this.progressReports.push(data);
      this.filteredProgressReports = this.progressReports;
      this.newProgressReport = {
        id_report: 0,
        report_content: '',
        report_date: new Date(),
        learner_id: 0,
        mentorship_program_id: 0
      };
      this.showCreateForm = false;
    });
  }

  updateProgressReport(): void {
    if (this.selectedProgressReport) {
      this.progressReportService.editProgressReport(this.selectedProgressReport).subscribe(() => {
        this.fetchProgressReports();
        this.selectedProgressReport = null;
      });
    }
  }

  deleteProgressReport(id: number): void {
    this.progressReportService.deleteProgressReport(id).subscribe(() => {
      this.progressReports = this.progressReports.filter(report => report.id_report !== id);
      this.filteredProgressReports = this.progressReports;
    });
  }

  selectProgressReport(report: ProgressReport): void {
    this.selectedProgressReport = { ...report };
  }

  clearSelection(): void {
    this.selectedProgressReport = null;
  }
}