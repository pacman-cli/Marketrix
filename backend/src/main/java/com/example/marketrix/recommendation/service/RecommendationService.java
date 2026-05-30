package com.example.marketrix.recommendation.service;

import com.example.marketrix.recommendation.dto.RecommendationResponse;

import java.util.List;
import java.util.UUID;

public interface RecommendationService {

    List<RecommendationResponse> getRecommendations(UUID requirementId);
}
