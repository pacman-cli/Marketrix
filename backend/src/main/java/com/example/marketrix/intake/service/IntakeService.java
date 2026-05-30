package com.example.marketrix.intake.service;

import com.example.marketrix.intake.dto.BriefResponse;
import com.example.marketrix.intake.dto.BriefSubmitRequest;

import java.util.List;
import java.util.UUID;

public interface IntakeService {

    BriefResponse submitBrief(UUID founderId, BriefSubmitRequest request);

    BriefResponse getBrief(UUID briefId);

    List<BriefResponse> getMyBriefs(UUID founderId);
}
