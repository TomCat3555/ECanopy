package com.ecanopy.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BuildingResponse {
    private Long buildingId;
    private String buildingName;
    private Integer totalFloors;
    private Long societyId;
}
