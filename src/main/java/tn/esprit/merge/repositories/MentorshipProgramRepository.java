package tn.esprit.merge.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.merge.entities.MentorshipProgram;

public interface MentorshipProgramRepository extends JpaRepository<MentorshipProgram, Long> {
}