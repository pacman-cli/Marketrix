package com.example.marketrix.ai.channel;

import com.example.marketrix.ai.client.ClaudeApiClient;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChannelRecommenderService {

    private final ClaudeApiClient claudeClient;
    private final ObjectMapper objectMapper;

    @Value("classpath:prompts/channel-recommendation.txt")
    private Resource promptResource;

    // Rule-based channel weights by stage
    private static final Map<String, Map<String, Double>> CHANNEL_MATRIX = Map.of(
            "idea", Map.of("content_marketing", 0.9, "community", 0.85, "social_organic", 0.8, "cold_outreach", 0.7, "seo", 0.6),
            "pre-seed", Map.of("content_marketing", 0.9, "community", 0.85, "social_organic", 0.8, "cold_outreach", 0.7, "seo", 0.6),
            "seed", Map.of("content_marketing", 0.85, "community", 0.8, "social_organic", 0.75, "cold_outreach", 0.75, "seo", 0.7, "paid_social", 0.5),
            "series-a", Map.of("paid_social", 0.8, "content_marketing", 0.75, "seo", 0.75, "paid_search", 0.7, "partnerships", 0.7, "influencer", 0.6),
            "growth", Map.of("paid_social", 0.9, "paid_search", 0.85, "seo", 0.8, "content_marketing", 0.75, "partnerships", 0.75, "pr", 0.7)
    );

    /**
     * Generates channel recommendations using rule matrix + LLM synthesis.
     */
    public Map<String, Object> recommendChannels(String stage, String budgetTier, List<Map<String, Object>> segments) throws IOException {
        // Step 1: Get rule-based weights
        Map<String, Double> weights = CHANNEL_MATRIX.getOrDefault(stage, CHANNEL_MATRIX.get("seed"));

        // Step 2: Extract preferred channels from segments
        List<String> segmentChannels = new ArrayList<>();
        for (Map<String, Object> seg : segments) {
            Object channels = seg.get("preferred_channels");
            if (channels instanceof List<?> list) {
                list.forEach(c -> segmentChannels.add(c.toString()));
            }
        }

        // Step 3: LLM synthesis
        String systemPrompt = promptResource.getContentAsString(StandardCharsets.UTF_8);
        String userMessage = objectMapper.writeValueAsString(Map.of(
                "stage", stage,
                "budget_tier", budgetTier,
                "rule_based_weights", weights,
                "segment_preferred_channels", segmentChannels,
                "segments_summary", segments.stream().map(s -> s.getOrDefault("name", "") + ": " + s.getOrDefault("tagline", "")).toList()
        ));

        String response = claudeClient.sendMessage(systemPrompt, userMessage);
        String json = extractJson(response);

        return objectMapper.readValue(json, new TypeReference<>() {});
    }

    private String extractJson(String response) {
        if (response.contains("```json")) {
            int start = response.indexOf("```json") + 7;
            int end = response.indexOf("```", start);
            return response.substring(start, end).trim();
        }
        if (response.contains("```")) {
            int start = response.indexOf("```") + 3;
            int end = response.indexOf("```", start);
            return response.substring(start, end).trim();
        }
        return response.trim();
    }
}
