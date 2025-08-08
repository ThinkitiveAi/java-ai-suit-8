package com.thinkitive.healthfirst.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequestDto {
    
    @NotBlank(message = "Username is required")
    private String username; // Can be email or phone number
    
    @NotBlank(message = "Password is required")
    private String password;
} 