package com.example.marketrix.messaging.controller;

import com.example.marketrix.messaging.entity.*;
import com.example.marketrix.messaging.service.MessagingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessagingController {

    private final MessagingService messagingService;

    @GetMapping("/conversations")
    public ResponseEntity<List<Conversation>> getConversations(Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(messagingService.getUserConversations(userId));
    }

    @GetMapping("/conversations/{id}")
    public ResponseEntity<List<Message>> getMessages(@PathVariable UUID id) {
        return ResponseEntity.ok(messagingService.getMessages(id));
    }

    @PostMapping("/conversations/{id}/send")
    public ResponseEntity<Message> sendMessage(Authentication auth, @PathVariable UUID id, @RequestBody Map<String, String> body) {
        UUID senderId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(messagingService.sendMessage(id, senderId, body.get("content")));
    }
}
