package com.example.marketrix.admin.service.impl;

import com.example.marketrix.admin.service.AdminService;
import com.example.marketrix.auth.entity.User;
import com.example.marketrix.auth.enums.UserStatus;
import com.example.marketrix.auth.repository.UserRepository;
import com.example.marketrix.common.exception.ResourceNotFoundException;
import com.example.marketrix.report.entity.Report;
import com.example.marketrix.report.enums.ReportStatus;
import com.example.marketrix.report.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepo;
    private final ReportRepository reportRepo;

    @Override
    public User approveUser(UUID userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setStatus(UserStatus.ACTIVE);
        return userRepo.save(user);
    }

    @Override
    public User suspendUser(UUID userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setStatus(UserStatus.SUSPENDED);
        return userRepo.save(user);
    }

    @Override
    public Report approveReport(UUID reportId) {
        Report report = reportRepo.findById(reportId).orElseThrow(() -> new ResourceNotFoundException("Report", "id", reportId));
        report.setStatus(ReportStatus.PUBLISHED);
        return reportRepo.save(report);
    }

    @Override
    public List<Report> getPendingReports() {
        return reportRepo.findByStatusOrderByPurchaseCountDesc(ReportStatus.PENDING_REVIEW);
    }

    @Override
    public Map<String, Object> getPlatformStats() {
        return Map.of(
                "totalUsers", userRepo.count(),
                "totalReports", reportRepo.count(),
                "publishedReports", reportRepo.findByStatusOrderByPurchaseCountDesc(ReportStatus.PUBLISHED).size()
        );
    }
}
