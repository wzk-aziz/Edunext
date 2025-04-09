package com.example.SessionAndTutoring.repositories;

import com.example.SessionAndTutoring.entities.Goal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GoalRepository extends JpaRepository<Goal, Long> {
}