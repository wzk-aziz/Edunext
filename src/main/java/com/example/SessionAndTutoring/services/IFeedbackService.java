package com.example.SessionAndTutoring.services;

import com.example.SessionAndTutoring.entities.Feedback;

import java.util.List;

public interface IFeedbackService {
    List<Feedback> getAllFeedbacks();
    Feedback getFeedbackById(Long id);
    Feedback saveFeedback(Feedback feedback);
    void deleteFeedback(Long id);
}