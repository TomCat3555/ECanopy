package com.ecanopy.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AmenityBookingResponse {
    private Long bookingId;
    private String amenityName;
    private String residentName;
    private String flatNumber;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status; // PENDING, APPROVED, REJECTED
    private String approvedBy;
}
