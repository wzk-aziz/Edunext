import { Component, OnInit } from '@angular/core';
import { SubmissionService } from './submission.service';

@Component({
  selector: 'app-submission-stats',
  templateUrl: './submission-stats.component.html',
  styleUrls: ['./submission-stats.component.css']
})
export class SubmissionStatsComponent implements OnInit {

  submissionsByProblem: any[] = [];
  bestScores: any[] = [];
  sortedSubmissions: any[] = [];

  constructor(private statsService: SubmissionService) {}

  ngOnInit(): void {
    this.loadSubmissionsPerProblem();
    this.loadBestScoresPerStudent();
    this.loadAllSortedSubmissions();
  }

  loadSubmissionsPerProblem(): void {
    this.statsService.getSubmissionsPerProblem().subscribe(data => {
      this.submissionsByProblem = data;
    });
  }

  loadBestScoresPerStudent(): void {
    this.statsService.getBestScoresPerStudent().subscribe(data => {
      this.bestScores = data;
    });
  }

  loadAllSortedSubmissions(): void {
    this.statsService.getAllSubmissionsSorted().subscribe(data => {
      this.sortedSubmissions = data;
    });
  }
  
}