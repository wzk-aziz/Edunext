package tn.esprit.merge.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.merge.entities.SessionRecording;

public interface SessionRecordingRepository extends JpaRepository<SessionRecording, Long> {
}