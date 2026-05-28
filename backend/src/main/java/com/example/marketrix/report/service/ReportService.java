package com.example.marketrix.report.service;

import com.example.marketrix.common.exception.BadRequestException;
import com.example.marketrix.common.exception.ResourceNotFoundException;
import com.example.marketrix.report.entity.*;
import com.example.marketrix.report.enums.ReportStatus;
import com.example.marketrix.report.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepo;
    private final ReportPurchaseRepository purchaseRepo;

    public Report publishReport(Report report) {
        return reportRepo.save(report);
    }

    public Page<Report> getCatalog(Pageable pageable) {
        return reportRepo.findByStatus(ReportStatus.PUBLISHED, pageable);
    }

    public Report getReport(UUID id) {
        return reportRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Report", "id", id));
    }

    @Transactional
    public ReportPurchase purchaseReport(UUID reportId, UUID founderId) {
        Report report = getReport(reportId);
        if (report.getStatus() != ReportStatus.PUBLISHED) {
            throw new BadRequestException("Report is not available for purchase");
        }
        if (purchaseRepo.existsByReportIdAndFounderId(reportId, founderId)) {
            throw new BadRequestException("Report already purchased");
        }
        report.setPurchaseCount(report.getPurchaseCount() + 1);
        reportRepo.save(report);
        return purchaseRepo.save(ReportPurchase.builder()
                .reportId(reportId).founderId(founderId).build());
    }

    public boolean hasAccess(UUID reportId, UUID userId) {
        Report report = getReport(reportId);
        return report.getAnalystId().equals(userId) || purchaseRepo.existsByReportIdAndFounderId(reportId, userId);
    }
}
