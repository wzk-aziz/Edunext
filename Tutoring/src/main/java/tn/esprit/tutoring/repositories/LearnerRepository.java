package tn.esprit.tutoring.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.tutoring.entities.Learner;

public interface LearnerRepository extends JpaRepository<Learner, Long> {
}