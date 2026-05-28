package com.example.marketrix.messaging.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "messages")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Message {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "conversation_id", nullable = false)
    private UUID conversationId;
    @Column(name = "sender_id", nullable = false)
    private UUID senderId;
    @Column(nullable = false, columnDefinition = "text")
    private String content;
    @Column(name = "read_at")
    private Instant readAt;
    @CreationTimestamp @Column(name = "created_at", updatable = false)
    private Instant createdAt;
}
