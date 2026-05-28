package com.example.marketrix.marketplace.controller;

import com.example.marketrix.common.ApiResponse;
import com.example.marketrix.marketplace.entity.*;
import com.example.marketrix.marketplace.service.MarketplaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/marketplace")
@RequiredArgsConstructor
public class MarketplaceController {

    private final MarketplaceService service;

    @GetMapping("/services")
    public ResponseEntity<ApiResponse<Page<ServiceListing>>> getServices(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(service.getActiveListings(pageable)));
    }

    @PostMapping("/services")
    @PreAuthorize("hasRole('ANALYST')")
    public ResponseEntity<ApiResponse<ServiceListing>> createService(Authentication auth, @RequestBody Map<String, Object> body) {
        UUID analystId = (UUID) auth.getPrincipal();
        ServiceListing listing = service.createListing(analystId,
                (String) body.get("title"), (String) body.get("description"),
                new BigDecimal(body.get("price").toString()), (String) body.get("category"),
                (List<String>) body.get("tags"));
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(listing));
    }

    @GetMapping("/services/{id}")
    public ResponseEntity<ApiResponse<ServiceListing>> getService(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(service.getListing(id)));
    }

    @GetMapping("/gigs")
    public ResponseEntity<ApiResponse<Page<Gig>>> getGigs(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(service.getOpenGigs(pageable)));
    }

    @PostMapping("/gigs")
    @PreAuthorize("hasRole('FOUNDER')")
    public ResponseEntity<ApiResponse<Gig>> createGig(Authentication auth, @RequestBody Map<String, Object> body) {
        UUID founderId = (UUID) auth.getPrincipal();
        Gig gig = service.createGig(founderId,
                (String) body.get("title"), (String) body.get("description"),
                new BigDecimal(body.get("budget").toString()), (List<String>) body.get("requirements"));
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(gig));
    }

    @PostMapping("/gigs/{id}/apply")
    @PreAuthorize("hasRole('ANALYST')")
    public ResponseEntity<ApiResponse<Proposal>> applyToGig(Authentication auth, @PathVariable UUID id, @RequestBody Map<String, Object> body) {
        UUID analystId = (UUID) auth.getPrincipal();
        Proposal proposal = service.submitProposal(id, analystId,
                (String) body.get("coverLetter"), new BigDecimal(body.get("proposedPrice").toString()));
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(proposal));
    }
}
