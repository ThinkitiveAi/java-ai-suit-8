package com.thinkitive.healthfirst.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PricingDto {
    
    @NotNull(message = "Base fee is required")
    @Positive(message = "Base fee must be positive")
    private Double baseFee;
    
    @NotNull(message = "Currency is required")
    @Size(min = 3, max = 3, message = "Currency must be a 3-letter code")
    private String currency;
    
    @NotNull(message = "Insurance acceptance status is required")
    private Boolean insuranceAccepted;
} 