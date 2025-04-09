package tn.esprit.livesessions.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.livesessions.entities.Instructor;

public interface InstructorRepository extends JpaRepository<Instructor, Long> {
}