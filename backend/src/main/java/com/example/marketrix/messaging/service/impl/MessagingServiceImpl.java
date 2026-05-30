package com.example.marketrix.messaging.service.impl;

import com.example.marketrix.messaging.entity.*;
import com.example.marketrix.messaging.repository.*;
import com.example.marketrix.messaging.service.MessagingService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MessagingServiceImpl implements MessagingService {

    private final ConversationRepository conversationRepo;
    private final MessageRepository messageRepo;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public List<Conversation> getUserConversations(UUID userId) {
        return conversationRepo.findByParticipant(userId);
    }

    @Override
    public List<Message> getMessages(UUID conversationId) {
        return messageRepo.findByConversationIdOrderByCreatedAtAsc(conversationId);
    }

    @Override
    public Message sendMessage(UUID conversationId, UUID senderId, String content) {
        Message message = messageRepo.save(Message.builder()
                .conversationId(conversationId).senderId(senderId).content(content).build());
        messagingTemplate.convertAndSend("/topic/conversation." + conversationId, message);
        return message;
    }
}
