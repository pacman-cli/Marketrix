package com.example.marketrix.ai.client.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ClaudeRequest {

    private String model;

    @JsonProperty("max_tokens")
    private int maxTokens;

    private String system;

    private List<Message> messages;

    @Data
    @AllArgsConstructor
    public static class Message {
        private String role;
        private String content;
    }
}
