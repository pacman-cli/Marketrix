package com.example.marketrix.feedback.service;

import com.example.marketrix.feedback.entity.Feedback;

import java.util.UUID;

public interface FeedbackService {

    Feedback submitFeedback(UUID userId, String targetType, UUID targetId, String signalType, Integer rating, String comment);

    Double getAnalystRating(UUID analystId);
}
