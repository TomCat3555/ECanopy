package com.ecanopy.dto.response;

import com.ecanopy.entity.enums.ApprovalStatus;
import com.ecanopy.entity.enums.ResidentType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class JoinRequestResponse {
    private Long requestId;
    private Long userId;
    private String userName;
    private String userEmail;
    private Long flatId;
    private String flatNumber;
    private String societyName;
    private ResidentType residentType;
    private ApprovalStatus status;
    private String deedDocumentUrl;
    private LocalDateTime requestedAt;
}
