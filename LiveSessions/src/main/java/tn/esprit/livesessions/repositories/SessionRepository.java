package tn.esprit.livesessions.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.livesessions.entities.Session;

public interface SessionRepository extends JpaRepository<Session, Long> {
}