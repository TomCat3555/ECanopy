package com.ecanopy.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FlatRequest {
    @NotBlank(message = "Flat number is required")
    private String flatNumber;

    @NotNull(message = "Floor number is required")
    private Integer floorNumber;

    private String flatType; // e.g., 2BHK, 3BHK
}
