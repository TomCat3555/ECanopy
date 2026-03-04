package com.ecanopy.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CreateSecretaryRequest {
    @NotNull(message = "Society ID is required")
    private Long societyId;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @Pattern(regexp = "^[0-9+\\-()\\s]{10,20}$", message = "Phone number must be 10-20 digits")
    private String phoneNumber;
}
