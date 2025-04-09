package tn.esprit.merge.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.merge.entities.SessionRecording;
import tn.esprit.merge.repositories.SessionRecordingRepository;
import java.util.List;

@Service
public class SessionRecordingServiceImpl implements ISessionRecordingService {
    @Autowired
    private SessionRecordingRepository sessionRecordingRepository;

    @Override
    public List<SessionRecording> getAllSessionRecordings() {
        return sessionRecordingRepository.findAll();
    }

    @Override
    public SessionRecording getSessionRecordingById(Long id) {
        return sessionRecordingRepository.findById(id).orElse(null);
    }

    @Override
    public SessionRecording saveSessionRecording(SessionRecording sessionRecording) {
        return sessionRecordingRepository.save(sessionRecording);
    }

    @Override
    public void deleteSessionRecording(Long id) {
        sessionRecordingRepository.deleteById(id);
    }
}