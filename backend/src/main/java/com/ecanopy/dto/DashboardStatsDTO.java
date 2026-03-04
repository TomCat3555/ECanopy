package com.ecanopy.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class DashboardStatsDTO {
    private long totalResidents;
    private long totalFlats;
    private long pendingComplaints;
    private long todaysVisitors;
    private BigDecimal pendingDues;
    private long activeNotices;
    private long pendingJoinRequests;
}
