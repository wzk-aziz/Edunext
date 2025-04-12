package tn.esprit.livesessions.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import tn.esprit.livesessions.entities.ChatMessage;
import tn.esprit.livesessions.services.IChatMessageService;
import java.util.List;

@RestController
@RequestMapping("/api/chatMessages")
@CrossOrigin(origins = "http://localhost:4200")
public class ChatMessageController {
    @Autowired
    private IChatMessageService chatMessageService;

    // Change this to handle GET requests to /api/chatMessages
    @GetMapping
    public List<ChatMessage> getAllChatMessages() {
        return chatMessageService.getAllChatMessages();
    }

    // Optional - keep this as an alternative endpoint
    @GetMapping("/all")
    public List<ChatMessage> getAllChatMessagesAlternate() {
        return chatMessageService.getAllChatMessages();
    }

    @GetMapping("/{id}")
    public ChatMessage getChatMessageById(@PathVariable Long id) {
        return chatMessageService.getChatMessageById(id);
    }

    @PostMapping
    public ChatMessage createChatMessage(@RequestBody ChatMessage chatMessage) {
        return chatMessageService.saveChatMessage(chatMessage);
    }

    // You're missing the PUT/update endpoint - add this:
    @PutMapping("/{id}")
    public ChatMessage updateChatMessage(@PathVariable Long id, @RequestBody ChatMessage chatMessage) {
        // First verify the IDs match
        if (!id.equals(chatMessage.getIdChatMessage())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID in URL doesn't match ID in body");
        }

        // Verify the message exists
        ChatMessage existingMessage = chatMessageService.getChatMessageById(id);
        if (existingMessage == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ChatMessage not found with id: " + id);
        }

        // Update the message
        return chatMessageService.updateChatMessage(id, chatMessage);
    }

    @DeleteMapping("/{id}")
    public void deleteChatMessage(@PathVariable Long id) {
        chatMessageService.deleteChatMessage(id);
    }
}