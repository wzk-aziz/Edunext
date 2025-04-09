package tn.esprit.merge.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.merge.entities.Instructor;
import tn.esprit.merge.entities.Session;
import tn.esprit.merge.repositories.InstructorRepository;
import tn.esprit.merge.services.ISessionService;
import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "http://localhost:4200")
public class SessionController {
    @Autowired
    private ISessionService sessionService;

    @Autowired
    private InstructorRepository instructorRepository;

    @GetMapping("/all")  // Changed from "/{all}" to "/all"
    public List<Session> getAllSessions() {
        return sessionService.getAllSessions();
    }

    @GetMapping("/{id}")
    public Session getSessionById(@PathVariable Long id) {
        return sessionService.getSessionById(id);
    }

@PostMapping
public Session createSession(@RequestBody Session session) {
    if (session.getInstructorId() != null) {
        Instructor instructor = instructorRepository.findById(session.getInstructorId())
            .orElseThrow(() -> new RuntimeException("Instructor not found with id: " + session.getInstructorId()));
        session.setInstructor(instructor);
    }
    return sessionService.saveSession(session);
}

    @DeleteMapping("/{id}")
    public void deleteSession(@PathVariable Long id) {
        sessionService.deleteSession(id);
    }



    @PutMapping("/{id}")
    public Session updateSession(@PathVariable Long id, @RequestBody Session session) {
        Session existingSession = sessionService.getSessionById(id);
        if (existingSession == null) {
            throw new RuntimeException("Session not found with id: " + id);
        }

        session.setIdSession(id);

        // Handle instructor update
        if (session.getInstructorId() != null) {
            Instructor instructor = instructorRepository.findById(session.getInstructorId())
                    .orElseThrow(() -> new RuntimeException("Instructor not found with id: " + session.getInstructorId()));
            session.setInstructor(instructor);
        } else {
            session.setInstructor(existingSession.getInstructor());
        }

        Session updatedSession = sessionService.saveSession(session);
        if (updatedSession.getInstructor() != null) {
            updatedSession.setInstructorId(updatedSession.getInstructor().getIdInstructor());
        }
        return updatedSession;
    }


}

