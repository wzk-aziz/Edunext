package com.example.SessionAndTutoring.repositories;

import com.example.SessionAndTutoring.entities.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
}