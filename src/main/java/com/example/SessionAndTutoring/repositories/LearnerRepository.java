package com.example.SessionAndTutoring.repositories;

import com.example.SessionAndTutoring.entities.Learner;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LearnerRepository extends JpaRepository<Learner, Long> {
}