package com.example.marketrix.intake.controller;

import com.example.marketrix.intake.dto.BriefResponse;
import com.example.marketrix.intake.dto.BriefSubmitRequest;
import com.example.marketrix.intake.service.IntakeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/startups")
@RequiredArgsConstructor
public class IntakeController {

    private final IntakeService intakeService;

    @PostMapping("/brief")
    @PreAuthorize("hasRole('FOUNDER')")
    public ResponseEntity<BriefResponse> submitBrief(Authentication auth, @Valid @RequestBody BriefSubmitRequest request) {
        UUID founderId = (UUID) auth.getPrincipal();
        return ResponseEntity.status(HttpStatus.CREATED).body(intakeService.submitBrief(founderId, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BriefResponse> getBrief(@PathVariable UUID id) {
        return ResponseEntity.ok(intakeService.getBrief(id));
    }

    @GetMapping("/my-briefs")
    @PreAuthorize("hasRole('FOUNDER')")
    public ResponseEntity<List<BriefResponse>> getMyBriefs(Authentication auth) {
        UUID founderId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(intakeService.getMyBriefs(founderId));
    }
}
