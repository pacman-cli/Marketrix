package com.example.marketrix.report.repository;

import com.example.marketrix.report.entity.Report;
import com.example.marketrix.report.enums.ReportStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ReportRepository extends JpaRepository<Report, UUID> {
    Page<Report> findByStatus(ReportStatus status, Pageable pageable);
    List<Report> findByStatusOrderByPurchaseCountDesc(ReportStatus status);
}
