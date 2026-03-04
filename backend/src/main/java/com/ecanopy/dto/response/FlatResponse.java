package com.ecanopy.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FlatResponse {
    private Long flatId;
    private String flatNumber;
    private Integer floorNumber;
    private String flatType;
    private Long buildingId;
}
