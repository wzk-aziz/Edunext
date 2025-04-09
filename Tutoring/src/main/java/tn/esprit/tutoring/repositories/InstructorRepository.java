package tn.esprit.tutoring.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.tutoring.entities.Instructor;

public interface InstructorRepository extends JpaRepository<Instructor, Long> {
}