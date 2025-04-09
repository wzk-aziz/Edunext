package tn.esprit.merge.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.merge.entities.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
}