package com.ecanopy.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SocietyRequest {
    @NotBlank(message = "Society name is required")
    private String societyName;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "City is required")
    private String city;

    private String state;
    private String postalCode;
    private String contactNumber;
}
