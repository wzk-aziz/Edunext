package com.example.SessionAndTutoring.repositories;

import com.example.SessionAndTutoring.entities.MentorshipProgram;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MentorshipProgramRepository extends JpaRepository<MentorshipProgram, Long> {
}