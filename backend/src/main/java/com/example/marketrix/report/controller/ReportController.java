package com.example.marketrix.report.controller;

import com.example.marketrix.report.entity.*;
import com.example.marketrix.report.enums.ReportTier;
import com.example.marketrix.report.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping
    public ResponseEntity<Page<Report>> getCatalog(Pageable pageable) {
        return ResponseEntity.ok(reportService.getCatalog(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Report> getReport(@PathVariable UUID id) {
        return ResponseEntity.ok(reportService.getReport(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ANALYST')")
    public ResponseEntity<Report> publishReport(Authentication auth, @RequestBody Map<String, Object> body) {
        UUID analystId = (UUID) auth.getPrincipal();
        Report report = Report.builder()
                .analystId(analystId)
                .title((String) body.get("title"))
                .description((String) body.get("description"))
                .price(new BigDecimal(body.get("price").toString()))
                .tier(ReportTier.valueOf(((String) body.getOrDefault("tier", "STANDARD")).toUpperCase()))
                .category((String) body.get("category"))
                .tags((List<String>) body.get("tags"))
                .previewText((String) body.get("previewText"))
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(reportService.publishReport(report));
    }

    @PostMapping("/{id}/purchase")
    @PreAuthorize("hasRole('FOUNDER')")
    public ResponseEntity<ReportPurchase> purchase(Authentication auth, @PathVariable UUID id) {
        UUID founderId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(reportService.purchaseReport(id, founderId));
    }
}
