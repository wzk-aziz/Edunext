package com.example.SessionAndTutoring.controllers;

import com.example.SessionAndTutoring.entities.SessionRecording;
import com.example.SessionAndTutoring.services.ISessionRecordingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessionRecordings")
@CrossOrigin(origins = "http://localhost:4200")
public class SessionRecordingController {
    @Autowired
    private ISessionRecordingService sessionRecordingService;

    @GetMapping
    public List<SessionRecording> getAllSessionRecordings() {
        return sessionRecordingService.getAllSessionRecordings();
    }

    @GetMapping("/{id}")
    public SessionRecording getSessionRecordingById(@PathVariable Long id) {
        return sessionRecordingService.getSessionRecordingById(id);
    }

    @PostMapping
    public SessionRecording createSessionRecording(@RequestBody SessionRecording sessionRecording) {
        return sessionRecordingService.saveSessionRecording(sessionRecording);
    }

    @DeleteMapping("/{id}")
    public void deleteSessionRecording(@PathVariable Long id) {
        sessionRecordingService.deleteSessionRecording(id);
    }
}