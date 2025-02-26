import { Component, OnInit } from '@angular/core';
import { GoalService } from './goal.service';
import { Goal } from './goal.model';

@Component({
  selector: 'app-goal',
  templateUrl: './goal.component.html',
  styleUrls: ['./goal.component.css']
})
export class GoalComponent implements OnInit {
  goals: Goal[] = [];
  filteredGoals: Goal[] = [];
  newGoal: Goal = { id_goal: 0, goal_description: '', goal_target_date: '', mentorship_program_id: 0 };
  selectedGoal: Goal | null = null;
  showCreateForm = false;
  searchTerm: string = '';

  constructor(private goalService: GoalService) {}

  ngOnInit(): void {
    this.fetchGoals();
  }

  fetchGoals(): void {
    this.goalService.getGoals().subscribe((data: Goal[]) => {
      this.goals = data;
      this.filteredGoals = data;
    });
  }

  filterGoals(): void {
    this.filteredGoals = this.goals.filter(goal =>
      goal.goal_description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      goal.mentorship_program_id.toString().includes(this.searchTerm)
    );
  }

  createGoal(): void {
    this.goalService.createGoal(this.newGoal).subscribe((data: Goal) => {
      this.goals.push(data);
      this.filteredGoals = this.goals;
      this.newGoal = { id_goal: 0, goal_description: '', goal_target_date: '', mentorship_program_id: 0 };
      this.showCreateForm = false;
    });
  }

  updateGoal(): void {
    if (this.selectedGoal) {
      this.goalService.updateGoal(this.selectedGoal).subscribe(() => {
        this.fetchGoals();
        this.selectedGoal = null;
      });
    }
  }

  deleteGoal(id: number): void {
    this.goalService.deleteGoal(id).subscribe(() => {
      this.goals = this.goals.filter(goal => goal.id_goal !== id);
      this.filteredGoals = this.goals;
    });
  }

  selectGoal(goal: Goal): void {
    this.selectedGoal = { ...goal };
  }

  clearSelection(): void {
    this.selectedGoal = null;
  }
}