package tn.esprit.tutoring.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.tutoring.entities.MentorshipProgram;

public interface MentorshipProgramRepository extends JpaRepository<MentorshipProgram, Long> {
}