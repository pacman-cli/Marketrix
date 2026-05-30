package com.example.marketrix.admin.controller;

import com.example.marketrix.admin.service.AdminService;
import com.example.marketrix.auth.entity.User;
import com.example.marketrix.report.entity.Report;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PatchMapping("/users/{id}/approve")
    public ResponseEntity<User> approveUser(@PathVariable UUID id) {
        return ResponseEntity.ok(adminService.approveUser(id));
    }

    @PatchMapping("/users/{id}/suspend")
    public ResponseEntity<User> suspendUser(@PathVariable UUID id) {
        return ResponseEntity.ok(adminService.suspendUser(id));
    }

    @GetMapping("/reports/pending")
    public ResponseEntity<List<Report>> getPendingReports() {
        return ResponseEntity.ok(adminService.getPendingReports());
    }

    @PatchMapping("/reports/{id}/approve")
    public ResponseEntity<Report> approveReport(@PathVariable UUID id) {
        return ResponseEntity.ok(adminService.approveReport(id));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(adminService.getPlatformStats());
    }
}
