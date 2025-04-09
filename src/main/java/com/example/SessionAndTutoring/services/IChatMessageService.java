package com.example.SessionAndTutoring.services;

import com.example.SessionAndTutoring.entities.ChatMessage;

import java.util.List;

public interface IChatMessageService {
    List<ChatMessage> getAllChatMessages();
    ChatMessage getChatMessageById(Long id);
    ChatMessage saveChatMessage(ChatMessage chatMessage);
    void deleteChatMessage(Long id);

    // Add this new method for updates
    ChatMessage updateChatMessage(Long id, ChatMessage chatMessage);
}