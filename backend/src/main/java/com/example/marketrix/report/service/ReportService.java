package com.example.marketrix.report.service;

import com.example.marketrix.report.entity.Report;
import com.example.marketrix.report.entity.ReportPurchase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ReportService {

    Report publishReport(Report report);

    Page<Report> getCatalog(Pageable pageable);

    Report getReport(UUID id);

    ReportPurchase purchaseReport(UUID reportId, UUID founderId);

    boolean hasAccess(UUID reportId, UUID userId);
}
