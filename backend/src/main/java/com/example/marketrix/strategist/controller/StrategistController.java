package com.example.marketrix.strategist.controller;

import com.example.marketrix.strategist.dto.StrategistProfileRequest;
import com.example.marketrix.strategist.entity.StrategistProfile;
import com.example.marketrix.strategist.service.StrategistService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/strategists")
@RequiredArgsConstructor
@Tag(name = "Strategists", description = "Analyst profile management")
public class StrategistController {

    private final StrategistService strategistService;

    @GetMapping("/me")
    @PreAuthorize("hasRole('ANALYST')")
    public ResponseEntity<StrategistProfile> getMyProfile(Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(strategistService.getOrCreateProfile(userId));
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('ANALYST')")
    public ResponseEntity<StrategistProfile> updateMyProfile(
            Authentication auth, @Valid @RequestBody StrategistProfileRequest request) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(strategistService.updateProfile(userId, request));
    }
}
