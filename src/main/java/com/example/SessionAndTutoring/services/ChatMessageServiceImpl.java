package com.example.SessionAndTutoring.services;

import com.example.SessionAndTutoring.entities.ChatMessage;
import com.example.SessionAndTutoring.repositories.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatMessageServiceImpl implements IChatMessageService {
    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Override
    public List<ChatMessage> getAllChatMessages() {
        return chatMessageRepository.findAll();
    }

    @Override
    public ChatMessage getChatMessageById(Long id) {
        return chatMessageRepository.findById(id).orElse(null);
    }

    @Override
    public ChatMessage saveChatMessage(ChatMessage chatMessage) {
        return chatMessageRepository.save(chatMessage);
    }

    @Override
    public void deleteChatMessage(Long id) {
        chatMessageRepository.deleteById(id);
    }

    @Override
    public ChatMessage updateChatMessage(Long id, ChatMessage chatMessage) {
        // First check if the chat message exists
        if (!chatMessageRepository.existsById(id)) {
            throw new RuntimeException("Chat message not found with id: " + id);
        }

        // Make sure the ID is set correctly - assuming your ID field is named idChatMessage
        // If it has a different name, adjust the setter accordingly
        chatMessage.setIdChatMessage(id);

        // Save and return the updated message
        return chatMessageRepository.save(chatMessage);
    }
}