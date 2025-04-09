package com.example.SessionAndTutoring.repositories;

import com.example.SessionAndTutoring.entities.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
}