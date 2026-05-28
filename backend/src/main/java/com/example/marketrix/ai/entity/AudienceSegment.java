package com.example.marketrix.ai.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "audience_segments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AudienceSegment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "requirement_id", nullable = false)
    private UUID requirementId;

    @Column(nullable = false)
    private String name;

    private String tagline;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> demographics;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> psychographics;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "behavioral_signals", columnDefinition = "jsonb")
    private List<String> behavioralSignals;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "preferred_channels", columnDefinition = "jsonb")
    private List<String> preferredChannels;

    @Column(name = "viability_score")
    private Double viabilityScore;

    @Column(columnDefinition = "text")
    private String rationale;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
