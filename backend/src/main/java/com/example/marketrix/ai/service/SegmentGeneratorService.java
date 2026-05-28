package com.example.marketrix.ai.service;

import com.example.marketrix.ai.client.ClaudeApiClient;
import com.example.marketrix.ai.entity.AudienceSegment;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class SegmentGeneratorService {

    private final ClaudeApiClient claudeClient;
    private final ObjectMapper objectMapper;

    @Value("classpath:prompts/segment-generation.txt")
    private Resource promptResource;

    @SuppressWarnings("unchecked")
    public List<AudienceSegment> generateSegments(UUID requirementId, Map<String, Object> extractedFeatures) throws IOException {
        String systemPrompt = promptResource.getContentAsString(StandardCharsets.UTF_8);
        String userMessage = objectMapper.writeValueAsString(extractedFeatures);

        String response = claudeClient.sendMessage(systemPrompt, userMessage);
        String json = extractJson(response);

        List<Map<String, Object>> segmentMaps = objectMapper.readValue(json, new TypeReference<>() {});

        return segmentMaps.stream().map(map -> AudienceSegment.builder()
                .requirementId(requirementId)
                .name((String) map.get("name"))
                .tagline((String) map.get("tagline"))
                .demographics((Map<String, Object>) map.get("demographics"))
                .psychographics((Map<String, Object>) map.get("psychographics"))
                .behavioralSignals((List<String>) map.get("behavioral_signals"))
                .preferredChannels((List<String>) map.get("preferred_channels"))
                .viabilityScore(map.get("viability_score") != null ? ((Number) map.get("viability_score")).doubleValue() : 0.0)
                .rationale((String) map.get("rationale"))
                .build()
        ).toList();
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
