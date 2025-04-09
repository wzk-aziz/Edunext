package com.example.SessionAndTutoring.services;

import com.example.SessionAndTutoring.entities.SessionRecording;
import com.example.SessionAndTutoring.repositories.SessionRecordingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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