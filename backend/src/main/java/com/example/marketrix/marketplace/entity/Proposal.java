package com.example.marketrix.marketplace.entity;

import com.example.marketrix.marketplace.enums.ProposalStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "proposals")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Proposal {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "gig_id", nullable = false)
    private UUID gigId;
    @Column(name = "analyst_id", nullable = false)
    private UUID analystId;
    @Column(name = "cover_letter")
    private String coverLetter;
    @Column(name = "proposed_price", nullable = false)
    private BigDecimal proposedPrice;
    @Enumerated(EnumType.STRING) @Builder.Default
    private ProposalStatus status = ProposalStatus.PENDING;
    @CreationTimestamp @Column(name = "created_at", updatable = false)
    private Instant createdAt;
}
