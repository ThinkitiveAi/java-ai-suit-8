package com.thinkitive.healthfirst.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InsuranceInfoDto {
    
    @NotBlank(message = "Insurance provider is required")
    @Size(max = 100, message = "Provider name cannot exceed 100 characters")
    private String provider;
    
    @NotBlank(message = "Policy number is required")
    @Size(max = 50, message = "Policy number cannot exceed 50 characters")
    private String policyNumber;
    
    @Size(max = 50, message = "Group number cannot exceed 50 characters")
    private String groupNumber;
    
    @Size(max = 100, message = "Subscriber name cannot exceed 100 characters")
    private String subscriberName;
    
    @Size(max = 50, message = "Subscriber relationship cannot exceed 50 characters")
    private String subscriberRelationship;
} 