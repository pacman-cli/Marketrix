package com.example.marketrix.ai.feedback;

import com.example.marketrix.ai.repository.AudienceSegmentRepository;
import com.example.marketrix.auth.repository.UserRepository;
import com.example.marketrix.feedback.entity.Feedback;
import com.example.marketrix.feedback.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Nightly batch job that recalculates:
 * - Strategist reputation scores (weighted average of recent vs older ratings)
 * - Audience segment confidence scores (based on thumbs up/down signals)
 *
 * This is the "Feedback Learning Loop" from the architecture docs.
 * Future: replace with ML model trained on outcome data.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FeedbackLearnerService {

    private final FeedbackRepository feedbackRepo;
    private final UserRepository userRepo;
    private final AudienceSegmentRepository segmentRepo;

    private static final double THUMBS_UP_DELTA = 0.05;
    private static final double THUMBS_DOWN_DELTA = -0.08;
    private static final double RECENT_WEIGHT = 0.6;
    private static final double OLDER_WEIGHT = 0.4;

    /**
     * Runs every night at 2 AM. Recalculates reputation and confidence scores.
     */
    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public void runNightlyBatch() {
        log.info("Feedback learning batch started");

        recalculateSegmentConfidence();
        recalculateStrategistReputation();

        log.info("Feedback learning batch completed");
    }

    private void recalculateSegmentConfidence() {
        List<Feedback> segmentFeedback = feedbackRepo.findByTargetTypeAndTargetId("SEGMENT", null);
        // In production: group by targetId, compute net score
        // For now: log the count for monitoring
        long thumbsUp = segmentFeedback.stream().filter(f -> "THUMBS_UP".equals(f.getSignalType())).count();
        long thumbsDown = segmentFeedback.stream().filter(f -> "THUMBS_DOWN".equals(f.getSignalType())).count();
        log.info("Segment feedback signals: {} up, {} down", thumbsUp, thumbsDown);
    }

    private void recalculateStrategistReputation() {
        // Formula: reputation = 0.6 * recent_avg(90d) + 0.4 * older_avg
        // In production: query feedback grouped by analyst, compute weighted avg
        Double overallAvg = feedbackRepo.getAverageRating("ANALYST", null);
        log.info("Overall analyst rating average: {}", overallAvg != null ? overallAvg : "no ratings yet");
    }
}
