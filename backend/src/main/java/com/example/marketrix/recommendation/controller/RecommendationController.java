package com.example.marketrix.recommendation.controller;

import com.example.marketrix.recommendation.dto.RecommendationResponse;
import com.example.marketrix.recommendation.service.RecommendationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
@Tag(name = "Recommendations", description = "AI-generated recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/{requirementId}")
    public ResponseEntity<List<RecommendationResponse>> getRecommendations(@PathVariable UUID requirementId) {
        return ResponseEntity.ok(recommendationService.getRecommendations(requirementId));
    }
}
