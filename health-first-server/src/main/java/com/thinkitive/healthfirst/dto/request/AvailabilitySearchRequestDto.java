package com.thinkitive.healthfirst.dto.request;

import com.thinkitive.healthfirst.entity.AppointmentType;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilitySearchRequestDto {
    
    @NotNull(message = "Start date is required")
    @Future(message = "Start date must be in the future")
    private LocalDate startDate;
    
    @NotNull(message = "End date is required")
    @Future(message = "End date must be in the future")
    private LocalDate endDate;
    
    private String specialization;
    
    private AppointmentType appointmentType;
    
    private String city;
    
    private String state;
    
    private String zipCode;
    
    private Boolean insuranceAccepted;
} 