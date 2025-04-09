package tn.esprit.merge.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.merge.entities.ChatMessage;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
}