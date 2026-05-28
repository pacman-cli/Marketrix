package com.example.marketrix.report.repository;

import com.example.marketrix.report.entity.ReportPurchase;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ReportPurchaseRepository extends JpaRepository<ReportPurchase, UUID> {
    boolean existsByReportIdAndFounderId(UUID reportId, UUID founderId);
}
