package com.example.marketrix.admin.service;

import com.example.marketrix.auth.entity.User;
import com.example.marketrix.report.entity.Report;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface AdminService {

    User approveUser(UUID userId);

    User suspendUser(UUID userId);

    Report approveReport(UUID reportId);

    List<Report> getPendingReports();

    Map<String, Object> getPlatformStats();
}
