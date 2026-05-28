package com.example.marketrix.messaging.controller;

import com.example.marketrix.common.ApiResponse;
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
    public ResponseEntity<ApiResponse<List<Conversation>>> getConversations(Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(messagingService.getUserConversations(userId)));
    }

    @GetMapping("/conversations/{id}")
    public ResponseEntity<ApiResponse<List<Message>>> getMessages(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(messagingService.getMessages(id)));
    }

    @PostMapping("/conversations/{id}/send")
    public ResponseEntity<ApiResponse<Message>> sendMessage(Authentication auth, @PathVariable UUID id, @RequestBody Map<String, String> body) {
        UUID senderId = (UUID) auth.getPrincipal();
        Message message = messagingService.sendMessage(id, senderId, body.get("content"));
        return ResponseEntity.ok(ApiResponse.success(message));
    }
}
