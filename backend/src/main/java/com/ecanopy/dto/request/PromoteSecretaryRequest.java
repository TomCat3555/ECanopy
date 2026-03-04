package com.ecanopy.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PromoteSecretaryRequest {
    @NotNull(message = "User ID is required")
    private Long userId;
} // End
