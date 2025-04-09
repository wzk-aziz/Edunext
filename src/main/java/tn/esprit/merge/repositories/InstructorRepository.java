package tn.esprit.merge.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.merge.entities.Instructor;

public interface InstructorRepository extends JpaRepository<Instructor, Long> {
}