package com.example.marketrix.feedback.repository;

import com.example.marketrix.feedback.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.UUID;

public interface FeedbackRepository extends JpaRepository<Feedback, UUID> {
    List<Feedback> findByTargetTypeAndTargetId(String targetType, UUID targetId);

    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.targetType = :targetType AND f.targetId = :targetId AND f.rating IS NOT NULL")
    Double getAverageRating(String targetType, UUID targetId);
}
