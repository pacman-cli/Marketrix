package com.example.marketrix.messaging.service;

import com.example.marketrix.messaging.entity.*;
import com.example.marketrix.messaging.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MessagingService {

    private final ConversationRepository conversationRepo;
    private final MessageRepository messageRepo;
    private final SimpMessagingTemplate messagingTemplate;

    public List<Conversation> getUserConversations(UUID userId) {
        return conversationRepo.findByParticipant(userId);
    }

    public List<Message> getMessages(UUID conversationId) {
        return messageRepo.findByConversationIdOrderByCreatedAtAsc(conversationId);
    }

    public Message sendMessage(UUID conversationId, UUID senderId, String content) {
        Message message = messageRepo.save(Message.builder()
                .conversationId(conversationId).senderId(senderId).content(content).build());
        messagingTemplate.convertAndSend("/topic/conversation." + conversationId, message);
        return message;
    }
}
