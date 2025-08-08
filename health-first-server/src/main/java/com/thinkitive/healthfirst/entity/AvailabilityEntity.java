package com.thinkitive.healthfirst.entity;

import com.thinkitive.healthfirst.dto.request.AvailabilityRequestDto;
import com.thinkitive.healthfirst.dto.response.AvailabilityResponseDto;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "availability")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AvailabilityEntity extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "provider_id", nullable = false)
    private ProviderEntity provider;
    
    @Column(nullable = false)
    private LocalDate date;
    
    @Column(nullable = false)
    private LocalTime startTime;
    
    @Column(nullable = false)
    private LocalTime endTime;
    
    @Column(nullable = false)
    private String timezone;
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean isRecurring = false;
    
    @Enumerated(EnumType.STRING)
    private RecurrencePattern recurrencePattern;
    
    private LocalDate recurrenceEndDate;
    
    @Column(nullable = false)
    private Integer slotDuration; // in minutes
    
    @Column(nullable = false)
    @Builder.Default
    private Integer breakDuration = 0; // in minutes
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AvailabilityStatus status = AvailabilityStatus.AVAILABLE;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer maxAppointmentsPerSlot = 1;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer currentAppointments = 0;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentType appointmentType;
    
    @Embedded
    private Location location;
    
    @Embedded
    private Pricing pricing;
    
    private String notes;
    
    @ElementCollection
    @CollectionTable(name = "availability_special_requirements", 
                     joinColumns = @JoinColumn(name = "availability_id"))
    @Column(name = "requirement")
    @Builder.Default
    private List<String> specialRequirements = new ArrayList<>();
    
    public static AvailabilityEntity toEntity(AvailabilityRequestDto dto) {
        if (dto == null) {
            return null;
        }
        return AvailabilityEntity.builder()
                .date(dto.getDate())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .timezone(dto.getTimezone())
                .isRecurring(dto.getIsRecurring())
                .recurrencePattern(dto.getRecurrencePattern())
                .recurrenceEndDate(dto.getRecurrenceEndDate())
                .slotDuration(dto.getSlotDuration())
                .breakDuration(dto.getBreakDuration())
                .status(AvailabilityStatus.AVAILABLE)
                .maxAppointmentsPerSlot(dto.getMaxAppointmentsPerSlot())
                .currentAppointments(0)
                .appointmentType(dto.getAppointmentType())
                .location(Location.toEntity(dto.getLocation()))
                .pricing(Pricing.toEntity(dto.getPricing()))
                .notes(dto.getNotes())
                .specialRequirements(dto.getSpecialRequirements() != null ? new ArrayList<>(dto.getSpecialRequirements()) : new ArrayList<>())
                // provider will be set separately
                .build();
    }
    
    public static AvailabilityEntity toEntityWithProvider(AvailabilityRequestDto dto, ProviderEntity provider) {
        AvailabilityEntity entity = toEntity(dto);
        if (entity != null) {
            entity.setProvider(provider);
        }
        return entity;
    }
    
    public static AvailabilityResponseDto toDto(AvailabilityEntity entity) {
        if (entity == null) {
            return null;
        }
        
        String providerName = "";
        String specialization = "";
        UUID providerId = null;
        
        if (entity.getProvider() != null) {
            providerName = entity.getProvider().getFirstName() + " " + entity.getProvider().getLastName();
            specialization = entity.getProvider().getSpecialization();
            providerId = entity.getProvider().getId();
        }
        
        return AvailabilityResponseDto.builder()
                .id(entity.getId())
                .providerId(providerId)
                .providerName(providerName)
                .specialization(specialization)
                .date(entity.getDate())
                .startTime(entity.getStartTime())
                .endTime(entity.getEndTime())
                .timezone(entity.getTimezone())
                .isRecurring(entity.getIsRecurring())
                .recurrencePattern(entity.getRecurrencePattern())
                .recurrenceEndDate(entity.getRecurrenceEndDate())
                .slotDuration(entity.getSlotDuration())
                .breakDuration(entity.getBreakDuration())
                .status(entity.getStatus())
                .maxAppointmentsPerSlot(entity.getMaxAppointmentsPerSlot())
                .currentAppointments(entity.getCurrentAppointments())
                .appointmentType(entity.getAppointmentType())
                .location(entity.getLocation() != null ? Location.toDto(entity.getLocation()) : null)
                .pricing(entity.getPricing() != null ? Pricing.toDto(entity.getPricing()) : null)
                .notes(entity.getNotes())
                .specialRequirements(entity.getSpecialRequirements())
                .build();
    }
    
    public static void updateEntity(AvailabilityRequestDto dto, AvailabilityEntity entity) {
        if (dto == null || entity == null) {
            return;
        }
        
        entity.setDate(dto.getDate());
        entity.setStartTime(dto.getStartTime());
        entity.setEndTime(dto.getEndTime());
        entity.setTimezone(dto.getTimezone());
        entity.setIsRecurring(dto.getIsRecurring());
        entity.setRecurrencePattern(dto.getRecurrencePattern());
        entity.setRecurrenceEndDate(dto.getRecurrenceEndDate());
        entity.setSlotDuration(dto.getSlotDuration());
        entity.setBreakDuration(dto.getBreakDuration());
        entity.setMaxAppointmentsPerSlot(dto.getMaxAppointmentsPerSlot());
        entity.setAppointmentType(dto.getAppointmentType());
        entity.setNotes(dto.getNotes());
        
        if (dto.getLocation() != null) {
            if (entity.getLocation() == null) {
                entity.setLocation(Location.toEntity(dto.getLocation()));
            } else {
                Location.updateEntity(dto.getLocation(), entity.getLocation());
            }
        }
        
        if (dto.getPricing() != null) {
            if (entity.getPricing() == null) {
                entity.setPricing(Pricing.toEntity(dto.getPricing()));
            } else {
                Pricing.updateEntity(dto.getPricing(), entity.getPricing());
            }
        }
        
        if (dto.getSpecialRequirements() != null) {
            entity.setSpecialRequirements(new ArrayList<>(dto.getSpecialRequirements()));
        }
        // provider and status are not updated here
    }
} 