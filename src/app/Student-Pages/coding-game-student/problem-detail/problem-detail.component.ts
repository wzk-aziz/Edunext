import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProblemService } from 'src/app/backend/coding-game-admin/problems/problem.service';

@Component({
  selector: 'app-problem-detail',
  templateUrl: './problem-detail.component.html',
  styleUrls: ['./problem-detail.component.css']
})
export class ProblemDetailComponent implements OnInit {
  problem: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private problemService: ProblemService
  ) {}

  ngOnInit(): void {
    this.loadProblem();
  }

  loadProblem(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.problemService.getById(Number(id)).subscribe((data) => {
        this.problem = data;
      });
    }
  }

  launchProblem(): void {
    this.router.navigate(['/coding-game/editor', this.problem.id]);
  }
}
