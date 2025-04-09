package tn.esprit.livesessions.services;

import tn.esprit.livesessions.entities.Feedback;
import java.util.List;

public interface IFeedbackService {
    List<Feedback> getAllFeedbacks();
    Feedback getFeedbackById(Long id);
    Feedback saveFeedback(Feedback feedback);
    void deleteFeedback(Long id);
}