package com.ecanopy.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class ResidentDashboardDTO {
    private Double pendingDues;
    private Long activeComplaints;
    private Long upcomingBookings;
    private Long unreadNotices;
    private List<VisitorLogDTO> recentVisitors;

    @Data
    @Builder
    public static class VisitorLogDTO {
        private String visitorName;
        private String visitorType;
        private String checkInTime;
        private String status;
    }
}
