package com.ecanopy.dto.response;

import com.ecanopy.entity.enums.ComplaintStatus;
import com.ecanopy.entity.enums.Priority;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ComplaintResponse {
    private Long complaintId;
    private String ticketNumber;
    private String title;
    private String description;
    private ComplaintStatus status;
    private Priority priority;
    private String category;
    private LocalDateTime createdAt;
    private Long residentId;
    private String residentName;
    private String flatNumber;
    private boolean hasUnreadMessages;
}
