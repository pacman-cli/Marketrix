package com.example.marketrix.ai.client;

import com.example.marketrix.ai.client.dto.EmbeddingResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Slf4j
@Component
public class OpenAiEmbeddingClient {

    private final RestClient restClient;
    private final String model;

    public OpenAiEmbeddingClient(
            @Value("${ai.openai.api-key}") String apiKey,
            @Value("${ai.openai.base-url}") String baseUrl,
            @Value("${ai.openai.embedding-model}") String model) {
        this.model = model;
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    @Retryable(maxAttempts = 3, backoff = @Backoff(delay = 2000))
    public float[] generateEmbedding(String text) {
        Map<String, Object> request = Map.of(
                "model", model,
                "input", text
        );

        EmbeddingResponse response = restClient.post()
                .uri("/embeddings")
                .body(request)
                .retrieve()
                .body(EmbeddingResponse.class);

        if (response != null && response.getData() != null && !response.getData().isEmpty()) {
            return response.getData().get(0).getEmbedding();
        }
        throw new RuntimeException("Empty response from OpenAI Embeddings API");
    }
}
