package com.example.marketrix.marketplace.repository;

import com.example.marketrix.marketplace.entity.ServiceListing;
import com.example.marketrix.marketplace.enums.ListingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ServiceListingRepository extends JpaRepository<ServiceListing, UUID> {
    Page<ServiceListing> findByStatus(ListingStatus status, Pageable pageable);
}
