package com.example.SessionAndTutoring.repositories;

import com.example.SessionAndTutoring.entities.Session;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionRepository extends JpaRepository<Session, Long> {
}