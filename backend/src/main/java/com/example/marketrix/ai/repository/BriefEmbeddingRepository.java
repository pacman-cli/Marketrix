package com.example.marketrix.ai.repository;

import com.example.marketrix.ai.entity.BriefEmbedding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface BriefEmbeddingRepository extends JpaRepository<BriefEmbedding, UUID> {

    Optional<BriefEmbedding> findByRequirementId(UUID requirementId);

    @Query(value = "INSERT INTO brief_embeddings (id, requirement_id, embedding) VALUES (gen_random_uuid(), :requirementId, cast(:embedding as vector)) ON CONFLICT (requirement_id) DO UPDATE SET embedding = cast(:embedding as vector)", nativeQuery = true)
    void upsertEmbedding(UUID requirementId, String embedding);
}
