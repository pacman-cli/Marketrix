package com.example.marketrix.ai.client.dto;

import lombok.Data;

import java.util.List;

@Data
public class ClaudeResponse {

    private String id;
    private String model;
    private List<ContentBlock> content;

    @Data
    public static class ContentBlock {
        private String type;
        private String text;
    }
}
