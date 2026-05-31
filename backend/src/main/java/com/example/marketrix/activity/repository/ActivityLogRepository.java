package com.example.marketrix.activity.repository;

import com.example.marketrix.activity.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, UUID> {
    List<ActivityLog> findByUserIdOrderByCreatedAtDesc(UUID userId);
    List<ActivityLog> findByEntityTypeAndEntityId(String entityType, UUID entityId);
}
