package tn.esprit.merge.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.merge.entities.Learner;

public interface LearnerRepository extends JpaRepository<Learner, Long> {
}