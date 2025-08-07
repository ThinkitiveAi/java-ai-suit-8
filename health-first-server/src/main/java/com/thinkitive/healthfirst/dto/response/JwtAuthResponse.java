package com.thinkitive.healthfirst.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JwtAuthResponse {
    
    private String accessToken;
    private String tokenType;
    private Long expiresIn;
    private Object userData;
    
    @Builder.Default
    private String refreshToken = null;
} 