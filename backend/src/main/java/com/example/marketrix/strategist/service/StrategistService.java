package com.example.marketrix.strategist.service;

import com.example.marketrix.strategist.dto.StrategistProfileRequest;
import com.example.marketrix.strategist.entity.StrategistProfile;

import java.util.UUID;

public interface StrategistService {
    StrategistProfile getOrCreateProfile(UUID userId);
    StrategistProfile updateProfile(UUID userId, StrategistProfileRequest request);
}
