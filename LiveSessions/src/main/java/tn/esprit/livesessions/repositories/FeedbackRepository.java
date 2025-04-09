package tn.esprit.livesessions.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.livesessions.entities.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
}