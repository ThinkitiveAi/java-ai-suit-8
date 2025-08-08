package com.thinkitive.healthfirst.dto.response;

import com.thinkitive.healthfirst.dto.request.AddressDto;
import com.thinkitive.healthfirst.dto.request.EmergencyContactDto;
import com.thinkitive.healthfirst.dto.request.InsuranceInfoDto;
import com.thinkitive.healthfirst.entity.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientResponseDto {
    
    private UUID id;
    private UserResponseDto user;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private Gender gender;
    private AddressDto address;
    private EmergencyContactDto emergencyContact;
    private InsuranceInfoDto insuranceInfo;
} 