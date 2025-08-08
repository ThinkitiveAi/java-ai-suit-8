package com.thinkitive.healthfirst.dto.response;

import com.thinkitive.healthfirst.dto.request.AddressDto;
import com.thinkitive.healthfirst.entity.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProviderResponseDto {
    
    private UUID id;
    private UserResponseDto user;
    private String firstName;
    private String lastName;
    private String specialization;
    private String licenseNumber;
    private Integer yearsOfExperience;
    private AddressDto clinicAddress;
    private VerificationStatus verificationStatus;
} 