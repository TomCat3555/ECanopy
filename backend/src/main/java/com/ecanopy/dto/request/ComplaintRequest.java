package com.ecanopy.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ComplaintRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private String priority; // LOW, MEDIUM, HIGH
    private String category; // PLUMBING, ELECTRICAL, etc.
}
