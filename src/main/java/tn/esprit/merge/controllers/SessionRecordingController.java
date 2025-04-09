package tn.esprit.merge.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.merge.entities.SessionRecording;
import tn.esprit.merge.services.ISessionRecordingService;
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