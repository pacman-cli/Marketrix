package com.example.marketrix.strategist.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class StrategistProfileRequest {
    @NotBlank(message = "Bio is required")
    private String bio;
    private Integer yearsExperience;
    private List<String> expertiseTags;
    @NotBlank(message = "Expertise summary is required for AI matching")
    private String expertiseSummary;
    private List<String> industries;
    private List<String> channels;
    private List<String> geographies;
}
