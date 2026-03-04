package com.ecanopy.dto.request;

import com.ecanopy.entity.enums.ApprovalStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApprovalRequest {
    @NotNull(message = "Status is required")
    private ApprovalStatus status;
}
