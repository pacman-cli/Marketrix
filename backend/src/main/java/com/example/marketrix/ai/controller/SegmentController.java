package com.example.marketrix.ai.controller;

import com.example.marketrix.ai.entity.AudienceSegment;
import com.example.marketrix.ai.repository.AudienceSegmentRepository;
import com.example.marketrix.feedback.entity.Feedback;
import com.example.marketrix.feedback.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/segments")
@RequiredArgsConstructor
public class SegmentController {

    private final AudienceSegmentRepository segmentRepository;
    private final FeedbackRepository feedbackRepository;

    @GetMapping("/{requirementId}")
    public ResponseEntity<List<AudienceSegment>> getSegments(@PathVariable UUID requirementId) {
        return ResponseEntity.ok(segmentRepository.findByRequirementId(requirementId));
    }

    @PostMapping("/{id}/rate")
    public ResponseEntity<Feedback> rateSegment(
            Authentication auth, @PathVariable UUID id, @RequestBody Map<String, String> body) {
        UUID userId = (UUID) auth.getPrincipal();
        String signal = body.get("signal"); // THUMBS_UP or THUMBS_DOWN

        Feedback feedback = Feedback.builder()
                .userId(userId)
                .targetType("SEGMENT")
                .targetId(id)
                .signalType(signal)
                .build();
        return ResponseEntity.ok(feedbackRepository.save(feedback));
    }
}
