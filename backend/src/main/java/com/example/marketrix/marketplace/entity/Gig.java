package com.example.marketrix.marketplace.entity;

import com.example.marketrix.marketplace.enums.GigStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "gigs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Gig {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "founder_id", nullable = false)
    private UUID founderId;
    @Column(nullable = false)
    private String title;
    private String description;
    private BigDecimal budget;
    @JdbcTypeCode(SqlTypes.JSON) @Column(columnDefinition = "jsonb")
    private List<String> requirements;
    @Enumerated(EnumType.STRING) @Builder.Default
    private GigStatus status = GigStatus.OPEN;
    @CreationTimestamp @Column(name = "created_at", updatable = false)
    private Instant createdAt;
}
