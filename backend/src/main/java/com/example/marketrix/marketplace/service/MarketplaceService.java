package com.example.marketrix.marketplace.service;

import com.example.marketrix.common.exception.ResourceNotFoundException;
import com.example.marketrix.marketplace.entity.*;
import com.example.marketrix.marketplace.enums.*;
import com.example.marketrix.marketplace.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MarketplaceService {

    private final ServiceListingRepository listingRepo;
    private final GigRepository gigRepo;
    private final ProposalRepository proposalRepo;

    public ServiceListing createListing(UUID analystId, String title, String description, BigDecimal price, String category, List<String> tags) {
        return listingRepo.save(ServiceListing.builder()
                .analystId(analystId).title(title).description(description)
                .price(price).category(category).tags(tags).build());
    }

    public Page<ServiceListing> getActiveListings(Pageable pageable) {
        return listingRepo.findByStatus(ListingStatus.ACTIVE, pageable);
    }

    public ServiceListing getListing(UUID id) {
        return listingRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("ServiceListing", "id", id));
    }

    public Gig createGig(UUID founderId, String title, String description, BigDecimal budget, List<String> requirements) {
        return gigRepo.save(Gig.builder()
                .founderId(founderId).title(title).description(description)
                .budget(budget).requirements(requirements).build());
    }

    public Page<Gig> getOpenGigs(Pageable pageable) {
        return gigRepo.findByStatus(GigStatus.OPEN, pageable);
    }

    public Proposal submitProposal(UUID gigId, UUID analystId, String coverLetter, BigDecimal proposedPrice) {
        gigRepo.findById(gigId).orElseThrow(() -> new ResourceNotFoundException("Gig", "id", gigId));
        return proposalRepo.save(Proposal.builder()
                .gigId(gigId).analystId(analystId)
                .coverLetter(coverLetter).proposedPrice(proposedPrice).build());
    }

    public List<Proposal> getProposalsForGig(UUID gigId) {
        return proposalRepo.findByGigId(gigId);
    }
}
