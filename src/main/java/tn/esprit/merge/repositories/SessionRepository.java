package tn.esprit.merge.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.merge.entities.Session;

public interface SessionRepository extends JpaRepository<Session, Long> {
}