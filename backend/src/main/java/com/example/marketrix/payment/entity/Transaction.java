package com.example.marketrix.payment.entity;

import com.example.marketrix.payment.enums.TransactionStatus;
import com.example.marketrix.payment.enums.TransactionType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "transactions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Transaction {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "user_id", nullable = false)
    private UUID userId;
    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private TransactionType type;
    @Column(nullable = false)
    private BigDecimal amount;
    @Column(nullable = false) @Builder.Default
    private String currency = "USD";
    @Column(name = "stripe_payment_id")
    private String stripePaymentId;
    @Enumerated(EnumType.STRING) @Builder.Default
    private TransactionStatus status = TransactionStatus.PENDING;
    @CreationTimestamp @Column(name = "created_at", updatable = false)
    private Instant createdAt;
}
