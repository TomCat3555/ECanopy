package com.ecanopy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JwtAuthenticationResponse {
    private String accessToken;
    @Builder.Default
    private String tokenType = "Bearer";
    private Long expiresIn;
    private UserResponse user;
}
