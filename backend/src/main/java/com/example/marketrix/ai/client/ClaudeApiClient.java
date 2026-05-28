package com.example.marketrix.ai.client;

import com.example.marketrix.ai.client.dto.ClaudeRequest;
import com.example.marketrix.ai.client.dto.ClaudeResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;

@Slf4j
@Component
public class ClaudeApiClient {

    private final RestClient restClient;
    private final String model;

    public ClaudeApiClient(
            @Value("${ai.anthropic.api-key}") String apiKey,
            @Value("${ai.anthropic.base-url}") String baseUrl,
            @Value("${ai.anthropic.model}") String model) {
        this.model = model;
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("x-api-key", apiKey)
                .defaultHeader("anthropic-version", "2023-06-01")
                .defaultHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    @Retryable(maxAttempts = 3, backoff = @Backoff(delay = 2000))
    public String sendMessage(String systemPrompt, String userMessage) {
        ClaudeRequest request = ClaudeRequest.builder()
                .model(model)
                .maxTokens(4096)
                .system(systemPrompt)
                .messages(List.of(new ClaudeRequest.Message("user", userMessage)))
                .build();

        ClaudeResponse response = restClient.post()
                .uri("/messages")
                .body(request)
                .retrieve()
                .body(ClaudeResponse.class);

        if (response != null && response.getContent() != null && !response.getContent().isEmpty()) {
            return response.getContent().get(0).getText();
        }
        throw new RuntimeException("Empty response from Claude API");
    }
}
