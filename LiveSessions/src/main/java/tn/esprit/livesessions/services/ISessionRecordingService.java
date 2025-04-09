package tn.esprit.livesessions.services;

import tn.esprit.livesessions.entities.SessionRecording;
import java.util.List;

public interface ISessionRecordingService {
    List<SessionRecording> getAllSessionRecordings();
    SessionRecording getSessionRecordingById(Long id);
    SessionRecording saveSessionRecording(SessionRecording sessionRecording);
    void deleteSessionRecording(Long id);
}