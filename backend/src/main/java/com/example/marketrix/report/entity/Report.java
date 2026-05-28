package com.example.marketrix.report.entity;

import com.example.marketrix.report.enums.ReportStatus;
import com.example.marketrix.report.enums.ReportTier;
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
@Table(name = "reports")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Report {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "analyst_id", nullable = false)
    private UUID analystId;
    @Column(nullable = false)
    private String title;
    private String description;
    @Column(nullable = false)
    private BigDecimal price;
    @Enumerated(EnumType.STRING) @Builder.Default
    private ReportTier tier = ReportTier.STANDARD;
    private String category;
    @JdbcTypeCode(SqlTypes.JSON) @Column(columnDefinition = "jsonb")
    private List<String> tags;
    @Column(name = "file_key")
    private String fileKey;
    @Column(name = "preview_text")
    private String previewText;
    @Column(name = "purchase_count") @Builder.Default
    private Integer purchaseCount = 0;
    @Enumerated(EnumType.STRING) @Builder.Default
    private ReportStatus status = ReportStatus.PENDING_REVIEW;
    @CreationTimestamp @Column(name = "created_at", updatable = false)
    private Instant createdAt;
}
