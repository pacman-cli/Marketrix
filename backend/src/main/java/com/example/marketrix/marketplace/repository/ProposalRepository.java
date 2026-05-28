package com.example.marketrix.marketplace.repository;

import com.example.marketrix.marketplace.entity.Proposal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ProposalRepository extends JpaRepository<Proposal, UUID> {
    List<Proposal> findByGigId(UUID gigId);
}
