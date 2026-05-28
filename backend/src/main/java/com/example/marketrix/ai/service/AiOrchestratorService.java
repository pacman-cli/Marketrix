package com.example.marketrix.ai.service;

import com.example.marketrix.ai.client.OpenAiEmbeddingClient;
import com.example.marketrix.ai.entity.AudienceSegment;
import com.example.marketrix.ai.entity.BriefEmbedding;
import com.example.marketrix.ai.event.SegmentsGeneratedEvent;
import com.example.marketrix.ai.repository.AudienceSegmentRepository;
import com.example.marketrix.ai.repository.BriefEmbeddingRepository;
import com.example.marketrix.intake.entity.StartupRequirement;
import com.example.marketrix.intake.enums.BriefStatus;
import com.example.marketrix.intake.event.BriefSubmittedEvent;
import com.example.marketrix.intake.repository.StartupRequirementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiOrchestratorService {

    private final StartupRequirementRepository requirementRepository;
    private final AudienceSegmentRepository segmentRepository;
    private final BriefEmbeddingRepository embeddingRepository;
    private final BriefParserService parserService;
    private final SegmentGeneratorService segmentGenerator;
    private final OpenAiEmbeddingClient embeddingClient;
    private final ApplicationEventPublisher eventPublisher;

    @Async("aiTaskExecutor")
    @EventListener
    @Transactional
    public void handleBriefSubmitted(BriefSubmittedEvent event) {
        var requirementId = event.getRequirementId();
        log.info("AI Pipeline started for requirement: {}", requirementId);

        StartupRequirement requirement = requirementRepository.findById(requirementId).orElse(null);
        if (requirement == null) {
            log.error("Requirement not found: {}", requirementId);
            return;
        }

        try {
            // Update status to PROCESSING
            requirement.setStatus(BriefStatus.PROCESSING);
            requirementRepository.save(requirement);

            // Stage 1: Parse brief
            String briefText = buildBriefText(requirement);
            Map<String, Object> extracted = parserService.parseBrief(briefText);
            log.info("Brief parsed for requirement: {}", requirementId);

            // Stage 2: Update metadata with extracted features
            requirement.setMetadata(extracted);
            requirementRepository.save(requirement);

            // Stage 3: Generate segments
            List<AudienceSegment> segments = segmentGenerator.generateSegments(requirementId, extracted);
            segmentRepository.saveAll(segments);
            log.info("Generated {} segments for requirement: {}", segments.size(), requirementId);

            // Stage 4: Generate embedding
            float[] embedding = embeddingClient.generateEmbedding(briefText);
            String vectorString = arrayToVectorString(embedding);
            BriefEmbedding briefEmbedding = BriefEmbedding.builder()
                    .requirementId(requirementId)
                    .embedding(vectorString)
                    .build();
            embeddingRepository.save(briefEmbedding);

            // Stage 5: Mark complete and trigger recommendations
            requirement.setStatus(BriefStatus.COMPLETE);
            requirementRepository.save(requirement);

            eventPublisher.publishEvent(new SegmentsGeneratedEvent(requirementId));
            log.info("AI Pipeline completed for requirement: {}", requirementId);

        } catch (Exception e) {
            log.error("AI Pipeline failed for requirement: {}", requirementId, e);
            requirement.setStatus(BriefStatus.FAILED);
            requirementRepository.save(requirement);
        }
    }

    private String buildBriefText(StartupRequirement req) {
        StringBuilder sb = new StringBuilder();
        sb.append("Startup: ").append(req.getName()).append("\n");
        sb.append("Industry: ").append(req.getIndustry()).append("\n");
        sb.append("Stage: ").append(req.getStage()).append("\n");
        if (req.getGeography() != null) sb.append("Geography: ").append(req.getGeography()).append("\n");
        if (req.getBudget() != null) sb.append("Budget: ").append(req.getBudget()).append("\n");
        if (req.getGoals() != null) sb.append("Goals: ").append(String.join(", ", req.getGoals())).append("\n");
        if (req.getProblems() != null) sb.append("Problems: ").append(String.join(", ", req.getProblems())).append("\n");
        if (req.getCompetitors() != null) sb.append("Competitors: ").append(String.join(", ", req.getCompetitors())).append("\n");
        return sb.toString();
    }

    private String arrayToVectorString(float[] embedding) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < embedding.length; i++) {
            if (i > 0) sb.append(",");
            sb.append(embedding[i]);
        }
        sb.append("]");
        return sb.toString();
    }
}
