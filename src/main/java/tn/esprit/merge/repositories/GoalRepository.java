package tn.esprit.merge.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.merge.entities.Goal;

public interface GoalRepository extends JpaRepository<Goal, Long> {
}