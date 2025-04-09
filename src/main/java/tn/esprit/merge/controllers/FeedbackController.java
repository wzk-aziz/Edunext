package tn.esprit.merge.controllers;

import tn.esprit.merge.entities.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.merge.entities.Feedback;
import tn.esprit.merge.services.IFeedbackService;
import tn.esprit.merge.services.ISessionService;

import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
@CrossOrigin(origins = "http://localhost:4200")
public class FeedbackController {
    @Autowired
    private IFeedbackService feedbackService;

    @Autowired
    private ISessionService sessionService;

    // Change this to a literal path, not a path variable
    @GetMapping("/all")
    public List<Feedback> getAllFeedbacks() {
        return feedbackService.getAllFeedbacks();
    }

    @GetMapping("/{id}")
    public Feedback getFeedbackById(@PathVariable Long id) {
        return feedbackService.getFeedbackById(id);
    }

    @PostMapping
    public Feedback createFeedback(@RequestBody Feedback feedback) {
        if (feedback.getSessionId() != null) {
            Session session = sessionService.getSessionById(feedback.getSessionId());
            if (session == null) {
                throw new RuntimeException("Session not found with id: " + feedback.getSessionId());
            }
            feedback.setSession(session);
        }
        Feedback savedFeedback = feedbackService.saveFeedback(feedback);
        if (savedFeedback.getSession() != null) {
            savedFeedback.setSessionId(savedFeedback.getSession().getIdSession());
        }
        return savedFeedback;
    }

    // Add a PUT mapping for updates
@PutMapping("/{id}")
public Feedback updateFeedback(@PathVariable Long id, @RequestBody Feedback feedback) {
    Feedback existingFeedback = feedbackService.getFeedbackById(id);
    if (existingFeedback == null) {
        throw new RuntimeException("Feedback not found with id: " + id);
    }

    // Set the ID from the path
    feedback.setIdFeedback(id);

    // Handle session update
    if (feedback.getSessionId() != null) {
        Session session = sessionService.getSessionById(feedback.getSessionId());
        if (session == null) {
            throw new RuntimeException("Session not found with id: " + feedback.getSessionId());
        }
        feedback.setSession(session);
    } else {
        feedback.setSession(existingFeedback.getSession());
    }

    Feedback updatedFeedback = feedbackService.saveFeedback(feedback);
    if (updatedFeedback.getSession() != null) {
        updatedFeedback.setSessionId(updatedFeedback.getSession().getIdSession());
    }
    return updatedFeedback;
}

    @DeleteMapping("/{id}")
    public void deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
    }
}