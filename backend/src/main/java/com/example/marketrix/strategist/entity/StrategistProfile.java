package com.example.marketrix.strategist.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "strategist_profiles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StrategistProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;

    private String bio;

    @Column(name = "years_experience")
    @Builder.Default
    private Integer yearsExperience = 0;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "expertise_tags", columnDefinition = "jsonb")
    private List<String> expertiseTags;

    @Column(name = "expertise_summary")
    private String expertiseSummary;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<String> industries;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<String> channels;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<String> geographies;

    @Column(name = "reputation_score")
    @Builder.Default
    private Double reputationScore = 0.0;

    @Column(name = "total_ratings")
    @Builder.Default
    private Integer totalRatings = 0;

    @Column(name = "total_earnings")
    @Builder.Default
    private BigDecimal totalEarnings = BigDecimal.ZERO;

    @Builder.Default
    private String availability = "AVAILABLE";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
