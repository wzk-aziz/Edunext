package com.example.SessionAndTutoring.repositories;

import com.example.SessionAndTutoring.entities.SessionRecording;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionRecordingRepository extends JpaRepository<SessionRecording, Long> {
}