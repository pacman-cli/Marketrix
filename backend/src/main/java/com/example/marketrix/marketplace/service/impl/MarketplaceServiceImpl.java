package com.example.marketrix.marketplace.service.impl;

import com.example.marketrix.common.exception.ResourceNotFoundException;
import com.example.marketrix.marketplace.entity.*;
import com.example.marketrix.marketplace.enums.*;
import com.example.marketrix.marketplace.repository.*;
import com.example.marketrix.marketplace.service.MarketplaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MarketplaceServiceImpl implements MarketplaceService {

    private final ServiceListingRepository listingRepo;
    private final GigRepository gigRepo;
    private final ProposalRepository proposalRepo;

    @Override
    public ServiceListing createListing(UUID analystId, String title, String description, BigDecimal price, String category, List<String> tags) {
        return listingRepo.save(ServiceListing.builder()
                .analystId(analystId).title(title).description(description)
                .price(price).category(category).tags(tags).build());
    }

    @Override
    public Page<ServiceListing> getActiveListings(Pageable pageable) {
        return listingRepo.findByStatus(ListingStatus.ACTIVE, pageable);
    }

    @Override
    public ServiceListing getListing(UUID id) {
        return listingRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("ServiceListing", "id", id));
    }

    @Override
    public Gig createGig(UUID founderId, String title, String description, BigDecimal budget, List<String> requirements) {
        return gigRepo.save(Gig.builder()
                .founderId(founderId).title(title).description(description)
                .budget(budget).requirements(requirements).build());
    }

    @Override
    public Page<Gig> getOpenGigs(Pageable pageable) {
        return gigRepo.findByStatus(GigStatus.OPEN, pageable);
    }

    @Override
    public Proposal submitProposal(UUID gigId, UUID analystId, String coverLetter, BigDecimal proposedPrice) {
        gigRepo.findById(gigId).orElseThrow(() -> new ResourceNotFoundException("Gig", "id", gigId));
        return proposalRepo.save(Proposal.builder()
                .gigId(gigId).analystId(analystId)
                .coverLetter(coverLetter).proposedPrice(proposedPrice).build());
    }

    @Override
    public List<Proposal> getProposalsForGig(UUID gigId) {
        return proposalRepo.findByGigId(gigId);
    }
}
