package com.example.marketrix.strategist.repository;

import com.example.marketrix.strategist.entity.StrategistProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface StrategistProfileRepository extends JpaRepository<StrategistProfile, UUID> {
    Optional<StrategistProfile> findByUserId(UUID userId);
}
