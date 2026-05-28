package com.example.marketrix.marketplace.repository;

import com.example.marketrix.marketplace.entity.Gig;
import com.example.marketrix.marketplace.enums.GigStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface GigRepository extends JpaRepository<Gig, UUID> {
    Page<Gig> findByStatus(GigStatus status, Pageable pageable);
}
