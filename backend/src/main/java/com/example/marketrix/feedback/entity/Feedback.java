package com.example.marketrix.feedback.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "feedback")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Feedback {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "user_id", nullable = false)
    private UUID userId;
    @Column(name = "target_type", nullable = false)
    private String targetType;
    @Column(name = "target_id", nullable = false)
    private UUID targetId;
    @Column(name = "signal_type", nullable = false)
    private String signalType;
    private Integer rating;
    private String comment;
    @CreationTimestamp @Column(name = "created_at", updatable = false)
    private Instant createdAt;
}
