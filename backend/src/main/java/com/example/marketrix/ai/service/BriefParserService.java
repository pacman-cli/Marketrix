package com.example.marketrix.ai.service;

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
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class BriefParserService {

    private final ClaudeApiClient claudeClient;
    private final ObjectMapper objectMapper;

    @Value("classpath:prompts/brief-extraction.txt")
    private Resource promptResource;

    public Map<String, Object> parseBrief(String briefText) throws IOException {
        String systemPrompt = promptResource.getContentAsString(StandardCharsets.UTF_8);
        String response = claudeClient.sendMessage(systemPrompt, briefText);

        // Extract JSON from response (handle markdown code blocks)
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
