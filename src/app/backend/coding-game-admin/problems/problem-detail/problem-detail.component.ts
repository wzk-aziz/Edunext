import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProblemService } from '../problem.service';
import { Problem } from '../../models/problem.model';

@Component({
  selector: 'app-problem-detail',
  templateUrl: './problem-detail.component.html',
  styleUrls: ['./problem-detail.component.css']
})
export class ProblemDetailComponent implements OnInit {
  problem: Problem | null = null;

  constructor(
    private problemService: ProblemService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.problemService.getById(Number(id)).subscribe(data => {
        this.problem = data;
      });
    }
  }

  goBack() {
    this.router.navigate(['/backoffice/problems']);
  }
}
