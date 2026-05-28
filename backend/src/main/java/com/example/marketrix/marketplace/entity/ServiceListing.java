package com.example.marketrix.marketplace.entity;

import com.example.marketrix.marketplace.enums.ListingStatus;
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
@Table(name = "service_listings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ServiceListing {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "analyst_id", nullable = false)
    private UUID analystId;
    @Column(nullable = false)
    private String title;
    private String description;
    @Column(nullable = false)
    private BigDecimal price;
    private String category;
    @JdbcTypeCode(SqlTypes.JSON) @Column(columnDefinition = "jsonb")
    private List<String> tags;
    @Enumerated(EnumType.STRING) @Builder.Default
    private ListingStatus status = ListingStatus.ACTIVE;
    @CreationTimestamp @Column(name = "created_at", updatable = false)
    private Instant createdAt;
}
