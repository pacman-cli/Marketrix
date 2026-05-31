package com.example.marketrix.ai.service;

import com.example.marketrix.ai.channel.ChannelRecommenderService;
import com.example.marketrix.ai.client.OpenAiEmbeddingClient;
import com.example.marketrix.ai.entity.AudienceSegment;
import com.example.marketrix.ai.entity.BriefEmbedding;
import com.example.marketrix.ai.event.SegmentsGeneratedEvent;
import com.example.marketrix.ai.positioning.PositioningAnalysisService;
import com.example.marketrix.ai.rag.RagMatchingService;
import com.example.marketrix.ai.repository.AudienceSegmentRepository;
import com.example.marketrix.ai.repository.BriefEmbeddingRepository;
import com.example.marketrix.intake.entity.StartupRequirement;
import com.example.marketrix.intake.enums.BriefStatus;
import com.example.marketrix.intake.event.BriefSubmittedEvent;
import com.example.marketrix.intake.repository.StartupRequirementRepository;
import com.example.marketrix.recommendation.entity.Recommendation;
import com.example.marketrix.recommendation.enums.RecommendationType;
import com.example.marketrix.recommendation.repository.RecommendationRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * AI Pipeline Orchestrator — 6-Stage Flow
 *
 * Stage 1: Brief Ingestion (handled by IntakeService → publishes BriefSubmittedEvent)
 * Stage 2: Structured Extraction (LLM Call #1 — BriefParserService)
 * Stage 3: Feature Mapping (rule-based category/geo/budget mapping)
 * Stage 4: Audience Segment Generation (LLM Call #2 — SegmentGeneratorService)
 * Stage 5: Recommendation Generation
 *   5a: RAG vector search for strategist matching
 *   5b: Channel recommendations (rule matrix + LLM synthesis)
 *   5c: Positioning gap analysis (LLM Call #3, if competitors given)
 * Stage 6: Delivery + Notification (mark complete, publish event)
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AiOrchestratorService {

    private final StartupRequirementRepository requirementRepository;
    private final AudienceSegmentRepository segmentRepository;
    private final BriefEmbeddingRepository embeddingRepository;
    private final RecommendationRepository recommendationRepository;
    private final BriefParserService parserService;
    private final SegmentGeneratorService segmentGenerator;
    private final OpenAiEmbeddingClient embeddingClient;
    private final PositioningAnalysisService positioningService;
    private final ChannelRecommenderService channelService;
    private final RagMatchingService ragService;
    private final ApplicationEventPublisher eventPublisher;
    private final ObjectMapper objectMapper;

    @Async("aiTaskExecutor")
    @EventListener
    @Transactional
    public void handleBriefSubmitted(BriefSubmittedEvent event) {
        UUID requirementId = event.getRequirementId();
        log.info("=== AI PIPELINE START === requirement: {}", requirementId);

        StartupRequirement requirement = requirementRepository.findById(requirementId).orElse(null);
        if (requirement == null) {
            log.error("Requirement not found: {}", requirementId);
            return;
        }

        try {
            // ─── STAGE 2: STRUCTURED EXTRACTION ───
            requirement.setStatus(BriefStatus.PROCESSING);
            requirementRepository.save(requirement);

            String briefText = buildBriefText(requirement);
            Map<String, Object> extracted = parserService.parseBrief(briefText);
            log.info("[Stage 2] Brief parsed: category={}, stage={}", extracted.get("category"), extracted.get("stage"));

            // ─── STAGE 3: FEATURE MAPPING ───
            requirement.setMetadata(extracted);
            requirementRepository.save(requirement);
            log.info("[Stage 3] Features mapped to metadata");

            // ─── STAGE 4: SEGMENT GENERATION ───
            List<AudienceSegment> segments = segmentGenerator.generateSegments(requirementId, extracted);
            segmentRepository.saveAll(segments);
            log.info("[Stage 4] Generated {} segments", segments.size());

            // Generate brief embedding for RAG
            float[] embedding = embeddingClient.generateEmbedding(briefText);
            String vectorString = arrayToVectorString(embedding);
            embeddingRepository.save(BriefEmbedding.builder()
                    .requirementId(requirementId)
                    .embedding(vectorString)
                    .build());

            // ─── STAGE 5: RECOMMENDATION GENERATION ───

            // 5a: RAG — find similar strategists
            List<Map<String, Object>> strategistMatches = ragService.findSimilarStrategists(vectorString, 10);
            for (Map<String, Object> match : strategistMatches) {
                recommendationRepository.save(Recommendation.builder()
                        .requirementId(requirementId)
                        .type(RecommendationType.STRATEGIST)
                        .targetId(match.get("user_id") != null ? UUID.fromString(match.get("user_id").toString()) : null)
                        .score(match.get("similarity") != null ? ((Number) match.get("similarity")).doubleValue() : 0.0)
                        .explanation("Matched by expertise similarity to your brief")
                        .build());
            }
            log.info("[Stage 5a] {} strategist matches generated", strategistMatches.size());

            // 5b: Channel recommendations
            String stage = extracted.getOrDefault("stage", "seed").toString();
            String budgetTier = extracted.getOrDefault("budgetTier", "low").toString();
            List<Map<String, Object>> segmentMaps = segments.stream().map(s -> Map.<String, Object>of(
                    "name", s.getName(),
                    "tagline", s.getTagline() != null ? s.getTagline() : "",
                    "preferred_channels", s.getPreferredChannels() != null ? s.getPreferredChannels() : List.of()
            )).toList();

            try {
                Map<String, Object> channelRecs = channelService.recommendChannels(stage, budgetTier, segmentMaps);
                recommendationRepository.save(Recommendation.builder()
                        .requirementId(requirementId)
                        .type(RecommendationType.CHANNEL)
                        .score(0.9)
                        .explanation(objectMapper.writeValueAsString(channelRecs))
                        .build());
                log.info("[Stage 5b] Channel recommendations generated");
            } catch (Exception e) {
                log.warn("[Stage 5b] Channel recommendation failed, skipping: {}", e.getMessage());
            }

            // 5c: Positioning analysis (only if competitors provided)
            List<String> competitors = requirement.getCompetitors();
            if (competitors != null && !competitors.isEmpty()) {
                try {
                    Map<String, Object> positioning = positioningService.analyzePositioning(segmentMaps, competitors);
                    recommendationRepository.save(Recommendation.builder()
                            .requirementId(requirementId)
                            .type(RecommendationType.POSITIONING)
                            .score(0.85)
                            .explanation(objectMapper.writeValueAsString(positioning))
                            .build());
                    log.info("[Stage 5c] Positioning analysis generated");
                } catch (Exception e) {
                    log.warn("[Stage 5c] Positioning analysis failed, skipping: {}", e.getMessage());
                }
            }

            // ─── STAGE 6: DELIVERY ───
            requirement.setStatus(BriefStatus.COMPLETE);
            requirementRepository.save(requirement);

            eventPublisher.publishEvent(new SegmentsGeneratedEvent(requirementId));
            log.info("=== AI PIPELINE COMPLETE === requirement: {}", requirementId);

        } catch (Exception e) {
            log.error("=== AI PIPELINE FAILED === requirement: {}", requirementId, e);
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
