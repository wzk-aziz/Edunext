package tn.esprit.merge.services;

import tn.esprit.merge.entities.Feedback;
import java.util.List;

public interface IFeedbackService {
    List<Feedback> getAllFeedbacks();
    Feedback getFeedbackById(Long id);
    Feedback saveFeedback(Feedback feedback);
    void deleteFeedback(Long id);
}