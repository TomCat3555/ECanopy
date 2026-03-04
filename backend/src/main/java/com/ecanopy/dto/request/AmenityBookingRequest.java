package com.ecanopy.dto.request;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AmenityBookingRequest {
    private Long amenityId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    // Optional: Special instructions or number of guests
    private Integer guestCount;
}
