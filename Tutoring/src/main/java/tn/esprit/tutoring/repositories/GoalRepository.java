package tn.esprit.tutoring.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.tutoring.entities.Goal;

public interface GoalRepository extends JpaRepository<Goal, Long> {
}