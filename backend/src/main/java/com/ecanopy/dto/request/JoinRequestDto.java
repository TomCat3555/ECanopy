package com.ecanopy.dto.request;

import com.ecanopy.entity.enums.ResidentType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class JoinRequestDto {
    @NotNull(message = "Flat ID is required")
    private Long flatId;

    @NotNull(message = "Resident type is required")
    private ResidentType residentType;

    private String deedDocumentUrl;
}
