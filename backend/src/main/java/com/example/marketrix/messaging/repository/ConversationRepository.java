package com.example.marketrix.messaging.repository;

import com.example.marketrix.messaging.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.UUID;

public interface ConversationRepository extends JpaRepository<Conversation, UUID> {
    @Query(value = "SELECT c.* FROM conversations c JOIN conversation_participants cp ON c.id = cp.conversation_id WHERE cp.user_id = :userId", nativeQuery = true)
    List<Conversation> findByParticipant(UUID userId);
}
