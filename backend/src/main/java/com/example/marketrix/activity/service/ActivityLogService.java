package com.example.marketrix.activity.service;

import com.example.marketrix.activity.entity.ActivityLog;
import com.example.marketrix.activity.repository.ActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ActivityLogService {

    private final ActivityLogRepository repository;

    @Async
    public void log(UUID userId, String eventType, String entityType, UUID entityId, Map<String, Object> metadata) {
        repository.save(ActivityLog.builder()
                .userId(userId)
                .eventType(eventType)
                .entityType(entityType)
                .entityId(entityId)
                .metadata(metadata)
                .build());
    }

    public void log(UUID userId, String eventType, String entityType, UUID entityId) {
        log(userId, eventType, entityType, entityId, null);
    }
}
