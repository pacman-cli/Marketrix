package com.example.marketrix.ai.rag;

import com.example.marketrix.ai.client.OpenAiEmbeddingClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Handles embedding generation and vector similarity search for RAG matching.
 * Manages strategist_embeddings index for expert-brief matching.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RagMatchingService {

    private final OpenAiEmbeddingClient embeddingClient;
    private final JdbcTemplate jdbcTemplate;

    /**
     * Embeds a strategist's expertise summary and stores in pgvector.
     * Called when an analyst profile is created or updated.
     */
    public void embedStrategist(UUID userId, String expertiseSummary) {
        float[] embedding = embeddingClient.generateEmbedding(expertiseSummary);
        String vector = arrayToVector(embedding);

        jdbcTemplate.update(
                "INSERT INTO strategist_embeddings (id, user_id, embedding) VALUES (gen_random_uuid(), ?, cast(? as vector)) " +
                        "ON CONFLICT (user_id) DO UPDATE SET embedding = cast(? as vector)",
                userId, vector, vector
        );
        log.info("Embedded strategist profile: {}", userId);
    }

    /**
     * Finds top-K strategists most similar to a brief embedding.
     * Core RAG retrieval for expert matching.
     *
     * @return List of maps with {userId, similarity} ordered by similarity desc
     */
    public List<Map<String, Object>> findSimilarStrategists(String briefEmbeddingVector, int topK) {
        String sql = """
            SELECT se.user_id, 
                   1 - (se.embedding <=> cast(? as vector)) AS similarity
            FROM strategist_embeddings se
            JOIN users u ON u.id = se.user_id AND u.status = 'ACTIVE' AND u.role = 'ANALYST'
            ORDER BY similarity DESC
            LIMIT ?
            """;

        return jdbcTemplate.queryForList(sql, briefEmbeddingVector, topK);
    }

    /**
     * Re-ranks strategist matches using the scoring formula:
     * final_score = 0.5 * cosine_sim + 0.3 * tag_overlap + 0.2 * reputation
     */
    public List<Map<String, Object>> rerankStrategists(List<Map<String, Object>> candidates, List<String> briefTags) {
        // In production: fetch each strategist's tags and reputation from DB
        // For now: return candidates with cosine_sim as the score
        return candidates.stream().map(c -> {
            Map<String, Object> ranked = new HashMap<>(c);
            double cosineSim = c.get("similarity") != null ? ((Number) c.get("similarity")).doubleValue() : 0.0;
            // Simplified scoring (tag_overlap and reputation would come from DB)
            ranked.put("final_score", cosineSim * 0.5 + 0.3 * 0.5 + 0.2 * 0.5);
            return ranked;
        }).sorted((a, b) -> Double.compare(
                ((Number) b.get("final_score")).doubleValue(),
                ((Number) a.get("final_score")).doubleValue()
        )).toList();
    }

    private String arrayToVector(float[] embedding) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < embedding.length; i++) {
            if (i > 0) sb.append(",");
            sb.append(embedding[i]);
        }
        sb.append("]");
        return sb.toString();
    }
}
