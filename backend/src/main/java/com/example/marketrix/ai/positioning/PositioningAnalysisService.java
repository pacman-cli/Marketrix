package com.example.marketrix.ai.positioning;

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
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class PositioningAnalysisService {

    private final ClaudeApiClient claudeClient;
    private final ObjectMapper objectMapper;

    @Value("classpath:prompts/positioning-analysis.txt")
    private Resource promptResource;

    /**
     * Generates positioning gap analysis when competitors are provided.
     * Stage 5c of the AI pipeline.
     */
    public Map<String, Object> analyzePositioning(List<Map<String, Object>> segments, List<String> competitors) throws IOException {
        if (competitors == null || competitors.isEmpty()) {
            return Map.of("gaps", List.of(), "angles", List.of(), "positioning_hypotheses", List.of());
        }

        String systemPrompt = promptResource.getContentAsString(StandardCharsets.UTF_8);

        String userMessage = objectMapper.writeValueAsString(Map.of(
                "segments", segments.stream().map(s -> Map.of(
                        "name", s.getOrDefault("name", ""),
                        "tagline", s.getOrDefault("tagline", "")
                )).toList(),
                "competitors", competitors
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
