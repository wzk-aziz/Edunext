import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Submission } from '../models/submission.model';
import { SubmissionService } from '../services/submission.service';

@Component({
  selector: 'app-submission-form',
  templateUrl: './submission-form.component.html',
  styleUrls: ['./submission-form.component.css']
})
export class SubmissionFormComponent {
  @Input() studentId: number = 1; // à récupérer dynamiquement plus tard
  submission: Submission = {
    code: '',
    gitLink: '',
    problemId: 0,
    studentId: 1
  };

  constructor(private submissionService: SubmissionService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const problemId = this.route.snapshot.params['id'];
    this.submission.problemId = problemId;
  }

  submit(): void {
    this.submission.studentId = this.studentId;
    this.submissionService.submit(this.submission).subscribe({
      next: (res) => {
        alert('Submission sent successfully!');
      },
      error: (err) => {
        alert('Failed to submit: ' + err.message);
      }
    });
  }
}
