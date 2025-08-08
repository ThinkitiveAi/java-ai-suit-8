package com.thinkitive.healthfirst.dto.response;

import com.thinkitive.healthfirst.dto.request.LocationDto;
import com.thinkitive.healthfirst.dto.request.PricingDto;
import com.thinkitive.healthfirst.entity.AppointmentType;
import com.thinkitive.healthfirst.entity.AvailabilityStatus;
import com.thinkitive.healthfirst.entity.RecurrencePattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityResponseDto {
    
    private UUID id;
    private UUID providerId;
    private String providerName;
    private String specialization;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String timezone;
    private Boolean isRecurring;
    private RecurrencePattern recurrencePattern;
    private LocalDate recurrenceEndDate;
    private Integer slotDuration;
    private Integer breakDuration;
    private AvailabilityStatus status;
    private Integer maxAppointmentsPerSlot;
    private Integer currentAppointments;
    private AppointmentType appointmentType;
    private LocationDto location;
    private PricingDto pricing;
    private String notes;
    private List<String> specialRequirements;
} 