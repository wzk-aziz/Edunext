package tn.esprit.tutoring.services;

import tn.esprit.tutoring.entities.Goal;

import java.util.List;

public interface IGoalService {
    List<Goal> getAllGoals();
    Goal getGoalById(Long id);
    Goal createGoal(Goal goal);
    Goal updateGoal(Long id, Goal goal);
    void deleteGoal(Long id);
}