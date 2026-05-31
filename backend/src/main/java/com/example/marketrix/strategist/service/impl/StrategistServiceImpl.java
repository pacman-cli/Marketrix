package com.example.marketrix.strategist.service.impl;

import com.example.marketrix.ai.rag.RagMatchingService;
import com.example.marketrix.strategist.dto.StrategistProfileRequest;
import com.example.marketrix.strategist.entity.StrategistProfile;
import com.example.marketrix.strategist.repository.StrategistProfileRepository;
import com.example.marketrix.strategist.service.StrategistService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class StrategistServiceImpl implements StrategistService {

    private final StrategistProfileRepository repository;
    private final RagMatchingService ragService;

    @Override
    public StrategistProfile getOrCreateProfile(UUID userId) {
        return repository.findByUserId(userId)
                .orElseGet(() -> repository.save(StrategistProfile.builder().userId(userId).build()));
    }

    @Override
    @Transactional
    public StrategistProfile updateProfile(UUID userId, StrategistProfileRequest request) {
        StrategistProfile profile = getOrCreateProfile(userId);
        profile.setBio(request.getBio());
        profile.setYearsExperience(request.getYearsExperience());
        profile.setExpertiseTags(request.getExpertiseTags());
        profile.setExpertiseSummary(request.getExpertiseSummary());
        profile.setIndustries(request.getIndustries());
        profile.setChannels(request.getChannels());
        profile.setGeographies(request.getGeographies());

        profile = repository.save(profile);

        // Trigger async embedding generation for RAG matching
        embedProfileAsync(userId, request.getExpertiseSummary());

        return profile;
    }

    @Async("aiTaskExecutor")
    void embedProfileAsync(UUID userId, String expertiseSummary) {
        try {
            ragService.embedStrategist(userId, expertiseSummary);
        } catch (Exception e) {
            log.warn("Failed to embed strategist profile {}: {}", userId, e.getMessage());
        }
    }
}
