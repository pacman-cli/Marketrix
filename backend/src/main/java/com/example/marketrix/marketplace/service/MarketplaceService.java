package com.example.marketrix.marketplace.service;

import com.example.marketrix.marketplace.entity.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface MarketplaceService {

    ServiceListing createListing(UUID analystId, String title, String description, BigDecimal price, String category, List<String> tags);

    Page<ServiceListing> getActiveListings(Pageable pageable);

    ServiceListing getListing(UUID id);

    Gig createGig(UUID founderId, String title, String description, BigDecimal budget, List<String> requirements);

    Page<Gig> getOpenGigs(Pageable pageable);

    Proposal submitProposal(UUID gigId, UUID analystId, String coverLetter, BigDecimal proposedPrice);

    List<Proposal> getProposalsForGig(UUID gigId);
}
