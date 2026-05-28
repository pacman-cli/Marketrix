package com.example.marketrix.report.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "report_purchases")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReportPurchase {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "report_id", nullable = false)
    private UUID reportId;
    @Column(name = "founder_id", nullable = false)
    private UUID founderId;
    @Column(name = "transaction_id")
    private UUID transactionId;
    @Column(name = "purchased_at", nullable = false)
    @Builder.Default
    private Instant purchasedAt = Instant.now();
}
