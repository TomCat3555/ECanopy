package com.ecanopy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private Long id;
    private String email;
    private String fullName;
    private String phoneNumber;
    private Long societyId;
    private String buildingName;
    private String flatNumber;
    private Long flatId;
    private Set<String> roles;
}
