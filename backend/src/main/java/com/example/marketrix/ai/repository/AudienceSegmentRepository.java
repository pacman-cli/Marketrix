package com.example.marketrix.ai.repository;

import com.example.marketrix.ai.entity.AudienceSegment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AudienceSegmentRepository extends JpaRepository<AudienceSegment, UUID> {

    List<AudienceSegment> findByRequirementId(UUID requirementId);
}
