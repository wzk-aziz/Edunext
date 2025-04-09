package com.example.SessionAndTutoring.services;

import com.example.SessionAndTutoring.entities.Goal;
import com.example.SessionAndTutoring.repositories.GoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GoalServiceImpl implements IGoalService {

    @Autowired
    private GoalRepository goalRepository;

    @Override
    public List<Goal> getAllGoals() {
        return goalRepository.findAll();
    }

    @Override
    public Goal getGoalById(Long id) {
        return goalRepository.findById(id).orElse(null);
    }

    @Override
    public Goal createGoal(Goal goal) {
        return goalRepository.save(goal);
    }

    @Override
    public Goal updateGoal(Long id, Goal goal) {
        if (goalRepository.existsById(id)) {
            goal.setIdGoal(id);
            return goalRepository.save(goal);
        }
        return null;
    }

    @Override
    public void deleteGoal(Long id) {
        goalRepository.deleteById(id);
    }
}