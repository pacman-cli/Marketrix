package com.example.marketrix.feedback.service;

import com.example.marketrix.feedback.entity.Feedback;
import com.example.marketrix.feedback.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepo;

    public Feedback submitFeedback(UUID userId, String targetType, UUID targetId, String signalType, Integer rating, String comment) {
        return feedbackRepo.save(Feedback.builder()
                .userId(userId).targetType(targetType).targetId(targetId)
                .signalType(signalType).rating(rating).comment(comment).build());
    }

    public Double getAnalystRating(UUID analystId) {
        return feedbackRepo.getAverageRating("ANALYST", analystId);
    }
}
