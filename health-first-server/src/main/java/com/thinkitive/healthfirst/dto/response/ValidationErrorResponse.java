package com.thinkitive.healthfirst.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ValidationErrorResponse {
    
    @Builder.Default
    private Boolean success = false;
    
    @Builder.Default
    private String message = "Validation failed";
    
    private Map<String, String[]> errors;
    
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
} 