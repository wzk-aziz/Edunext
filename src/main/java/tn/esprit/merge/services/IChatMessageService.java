package tn.esprit.merge.services;

import tn.esprit.merge.entities.ChatMessage;
import java.util.List;

public interface IChatMessageService {
    List<ChatMessage> getAllChatMessages();
    ChatMessage getChatMessageById(Long id);
    ChatMessage saveChatMessage(ChatMessage chatMessage);
    void deleteChatMessage(Long id);

    // Add this new method for updates
    ChatMessage updateChatMessage(Long id, ChatMessage chatMessage);
}