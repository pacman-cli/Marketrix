package com.example.marketrix.ai.client.dto;

import lombok.Data;

import java.util.List;

@Data
public class EmbeddingResponse {

    private List<EmbeddingData> data;

    @Data
    public static class EmbeddingData {
        private int index;
        private float[] embedding;
    }
}
