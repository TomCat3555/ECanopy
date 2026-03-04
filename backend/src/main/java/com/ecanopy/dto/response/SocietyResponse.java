package com.ecanopy.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SocietyResponse {
    private Long societyId;
    private String societyName;
    private String address;
    private String city;
    private String state;
    private String postalCode;
    private String contactNumber;
}
