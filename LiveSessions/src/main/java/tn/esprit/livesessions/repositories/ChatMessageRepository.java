package tn.esprit.livesessions.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.livesessions.entities.ChatMessage;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
}