package com.example.SessionAndTutoring.services;

import com.example.SessionAndTutoring.entities.SessionRecording;

import java.util.List;

public interface ISessionRecordingService {
    List<SessionRecording> getAllSessionRecordings();
    SessionRecording getSessionRecordingById(Long id);
    SessionRecording saveSessionRecording(SessionRecording sessionRecording);
    void deleteSessionRecording(Long id);
}