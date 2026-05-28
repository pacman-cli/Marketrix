package com.example.marketrix.feedback.controller;

import com.example.marketrix.common.ApiResponse;
import com.example.marketrix.feedback.entity.Feedback;
import com.example.marketrix.feedback.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<ApiResponse<Feedback>> submitFeedback(Authentication auth, @RequestBody Map<String, Object> body) {
        UUID userId = (UUID) auth.getPrincipal();
        Feedback feedback = feedbackService.submitFeedback(userId,
                (String) body.get("targetType"), UUID.fromString((String) body.get("targetId")),
                (String) body.get("signalType"),
                body.get("rating") != null ? ((Number) body.get("rating")).intValue() : null,
                (String) body.get("comment"));
        return ResponseEntity.ok(ApiResponse.success(feedback));
    }

    @GetMapping("/analyst/{id}/rating")
    public ResponseEntity<ApiResponse<Double>> getAnalystRating(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(feedbackService.getAnalystRating(id)));
    }
}
