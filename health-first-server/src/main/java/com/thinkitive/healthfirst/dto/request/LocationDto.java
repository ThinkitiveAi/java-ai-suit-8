package com.thinkitive.healthfirst.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LocationDto {
    
    @NotBlank(message = "Location type is required")
    @Size(max = 50, message = "Location type cannot exceed 50 characters")
    private String type; // e.g., CLINIC, HOSPITAL, VIRTUAL
    
    @NotNull(message = "Address is required")
    @Valid
    private AddressDto address;
    
    @Size(max = 20, message = "Room number cannot exceed 20 characters")
    private String roomNumber;
} 