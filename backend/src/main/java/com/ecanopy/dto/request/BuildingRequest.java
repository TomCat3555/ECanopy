package com.ecanopy.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BuildingRequest {
    @NotBlank(message = "Building name is required")
    private String buildingName;

    private Integer totalFloors;
}
