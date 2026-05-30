package com.example.marketrix.messaging.service;

import com.example.marketrix.messaging.entity.Conversation;
import com.example.marketrix.messaging.entity.Message;

import java.util.List;
import java.util.UUID;

public interface MessagingService {

    List<Conversation> getUserConversations(UUID userId);

    List<Message> getMessages(UUID conversationId);

    Message sendMessage(UUID conversationId, UUID senderId, String content);
}
