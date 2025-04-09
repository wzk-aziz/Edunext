package tn.esprit.livesessions.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.livesessions.entities.SessionRecording;

public interface SessionRecordingRepository extends JpaRepository<SessionRecording, Long> {
}