package com.thinkitive.healthfirst.dto.request;

import com.thinkitive.healthfirst.entity.AppointmentType;
import com.thinkitive.healthfirst.entity.RecurrencePattern;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityRequestDto {
    
    @NotNull(message = "Date is required")
    @Future(message = "Date must be in the future")
    private LocalDate date;
    
    @NotNull(message = "Start time is required")
    private LocalTime startTime;
    
    @NotNull(message = "End time is required")
    private LocalTime endTime;
    
    @NotNull(message = "Timezone is required")
    private String timezone;
    
    private Boolean isRecurring;
    
    private RecurrencePattern recurrencePattern;
    
    @Future(message = "Recurrence end date must be in the future")
    private LocalDate recurrenceEndDate;
    
    @NotNull(message = "Slot duration is required")
    @Min(value = 5, message = "Slot duration must be at least 5 minutes")
    private Integer slotDuration;
    
    @Min(value = 0, message = "Break duration cannot be negative")
    private Integer breakDuration;
    
    @NotNull(message = "Appointment type is required")
    private AppointmentType appointmentType;
    
    @Min(value = 1, message = "Max appointments per slot must be at least 1")
    private Integer maxAppointmentsPerSlot;
    
    @Valid
    private LocationDto location;
    
    @Valid
    private PricingDto pricing;
    
    private String notes;
    
    private List<String> specialRequirements;
} 