package com.thinkitive.healthfirst.service.impl;

import com.thinkitive.healthfirst.dto.request.AvailabilityRequestDto;
import com.thinkitive.healthfirst.dto.request.AvailabilitySearchRequestDto;
import com.thinkitive.healthfirst.dto.response.AvailabilityResponseDto;
import com.thinkitive.healthfirst.entity.AppointmentType;
import com.thinkitive.healthfirst.entity.AvailabilityEntity;
import com.thinkitive.healthfirst.entity.AvailabilityStatus;
import com.thinkitive.healthfirst.entity.ProviderEntity;
import com.thinkitive.healthfirst.entity.RecurrencePattern;
import com.thinkitive.healthfirst.exception.BadRequestException;
import com.thinkitive.healthfirst.exception.ResourceNotFoundException;
import com.thinkitive.healthfirst.repository.AvailabilityRepository;
import com.thinkitive.healthfirst.service.AvailabilityService;
import com.thinkitive.healthfirst.service.ProviderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AvailabilityServiceImpl implements AvailabilityService {

    private final AvailabilityRepository availabilityRepository;
    private final ProviderService providerService;

    @Override
    @Transactional
    public AvailabilityResponseDto createAvailability(UUID providerId, AvailabilityRequestDto requestDto) {
        validateAvailabilityRequest(requestDto);
        
        ProviderEntity provider = providerService.getProviderEntityById(providerId);
        
        AvailabilityEntity availability = AvailabilityEntity.toEntityWithProvider(requestDto, provider);
        AvailabilityEntity savedAvailability = availabilityRepository.save(availability);
        
        return AvailabilityEntity.toDto(savedAvailability);
    }

    @Override
    @Transactional
    public List<AvailabilityResponseDto> createRecurringAvailability(UUID providerId, AvailabilityRequestDto requestDto) {
        validateRecurringAvailabilityRequest(requestDto);
        
        ProviderEntity provider = providerService.getProviderEntityById(providerId);
        List<AvailabilityEntity> availabilities = new ArrayList<>();
        
        LocalDate startDate = requestDto.getDate();
        LocalDate endDate = requestDto.getRecurrenceEndDate();
        RecurrencePattern pattern = requestDto.getRecurrencePattern();
        
        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            AvailabilityRequestDto slotDto = copyAvailabilityRequestWithNewDate(requestDto, currentDate);
            
            AvailabilityEntity availability = AvailabilityEntity.toEntityWithProvider(slotDto, provider);
            availabilities.add(availability);
            
            currentDate = getNextRecurrenceDate(currentDate, pattern);
        }
        
        List<AvailabilityEntity> savedAvailabilities = availabilityRepository.saveAll(availabilities);
        
        return savedAvailabilities.stream()
                .map(AvailabilityEntity::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AvailabilityResponseDto getAvailabilityById(UUID id) {
        AvailabilityEntity availability = getAvailabilityEntityById(id);
        return AvailabilityEntity.toDto(availability);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AvailabilityResponseDto> getAvailabilitiesByProviderId(UUID providerId) {
        // Verify provider exists
        providerService.getProviderEntityById(providerId);
        
        List<AvailabilityEntity> availabilities = availabilityRepository.findByProviderId(providerId);
        
        return availabilities.stream()
                .map(AvailabilityEntity::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AvailabilityResponseDto> getAvailabilitiesByProviderIdAndDateRange(
            UUID providerId, LocalDate startDate, LocalDate endDate) {
        // Verify provider exists
        providerService.getProviderEntityById(providerId);
        
        validateDateRange(startDate, endDate);
        
        List<AvailabilityEntity> availabilities = 
                availabilityRepository.findByProviderIdAndDateBetween(providerId, startDate, endDate);
        
        return availabilities.stream()
                .map(AvailabilityEntity::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AvailabilityResponseDto> getAvailabilitiesByProviderIdAndStatus(
            UUID providerId, AvailabilityStatus status) {
        // Verify provider exists
        providerService.getProviderEntityById(providerId);
        
        List<AvailabilityEntity> availabilities = 
                availabilityRepository.findByProviderIdAndStatus(providerId, status);
        
        return availabilities.stream()
                .map(AvailabilityEntity::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AvailabilityResponseDto> searchAvailabilities(AvailabilitySearchRequestDto searchRequestDto) {
        validateDateRange(searchRequestDto.getStartDate(), searchRequestDto.getEndDate());
        
        List<AvailabilityEntity> availabilities = availabilityRepository.findAll();
        
        // Filter by date range
        availabilities = availabilities.stream()
                .filter(a -> !a.getDate().isBefore(searchRequestDto.getStartDate()) && 
                             !a.getDate().isAfter(searchRequestDto.getEndDate()))
                .collect(Collectors.toList());
        
        // Filter by status
        availabilities = availabilities.stream()
                .filter(a -> a.getStatus() == AvailabilityStatus.AVAILABLE)
                .collect(Collectors.toList());
        
        // Filter by specialization if provided
        if (searchRequestDto.getSpecialization() != null && !searchRequestDto.getSpecialization().isEmpty()) {
            availabilities = availabilities.stream()
                    .filter(a -> a.getProvider().getSpecialization()
                            .equalsIgnoreCase(searchRequestDto.getSpecialization()))
                    .collect(Collectors.toList());
        }
        
        // Filter by appointment type if provided
        if (searchRequestDto.getAppointmentType() != null) {
            availabilities = availabilities.stream()
                    .filter(a -> a.getAppointmentType() == searchRequestDto.getAppointmentType())
                    .collect(Collectors.toList());
        }
        
        // Filter by location if provided
        if (searchRequestDto.getCity() != null && !searchRequestDto.getCity().isEmpty()) {
            availabilities = availabilities.stream()
                    .filter(a -> a.getLocation() != null && 
                                 a.getLocation().getAddress() != null &&
                                 searchRequestDto.getCity().equalsIgnoreCase(a.getLocation().getAddress().getCity()))
                    .collect(Collectors.toList());
        }
        
        if (searchRequestDto.getState() != null && !searchRequestDto.getState().isEmpty()) {
            availabilities = availabilities.stream()
                    .filter(a -> a.getLocation() != null && 
                                 a.getLocation().getAddress() != null &&
                                 searchRequestDto.getState().equalsIgnoreCase(a.getLocation().getAddress().getState()))
                    .collect(Collectors.toList());
        }
        
        if (searchRequestDto.getZipCode() != null && !searchRequestDto.getZipCode().isEmpty()) {
            availabilities = availabilities.stream()
                    .filter(a -> a.getLocation() != null && 
                                 a.getLocation().getAddress() != null &&
                                 searchRequestDto.getZipCode().equalsIgnoreCase(a.getLocation().getAddress().getZipCode()))
                    .collect(Collectors.toList());
        }
        
        // Filter by insurance accepted if provided
        if (searchRequestDto.getInsuranceAccepted() != null) {
            availabilities = availabilities.stream()
                    .filter(a -> a.getPricing() != null && 
                                 searchRequestDto.getInsuranceAccepted().equals(a.getPricing().getInsuranceAccepted()))
                    .collect(Collectors.toList());
        }
        
        return availabilities.stream()
                .map(AvailabilityEntity::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AvailabilityResponseDto> searchAvailabilitiesBySpecialization(
            String specialization, LocalDate startDate, LocalDate endDate) {
        validateDateRange(startDate, endDate);
        
        List<AvailabilityEntity> availabilities = 
                availabilityRepository.findAvailableSlotsBySpecializationAndDateRange(
                        AvailabilityStatus.AVAILABLE, startDate, endDate, specialization);
        
        return availabilities.stream()
                .map(AvailabilityEntity::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AvailabilityResponseDto> searchAvailabilitiesByAppointmentType(
            AppointmentType appointmentType, LocalDate startDate, LocalDate endDate) {
        validateDateRange(startDate, endDate);
        
        List<AvailabilityEntity> availabilities = 
                availabilityRepository.findAvailableSlotsByTypeAndDateRange(
                        AvailabilityStatus.AVAILABLE, startDate, endDate, appointmentType);
        
        return availabilities.stream()
                .map(AvailabilityEntity::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AvailabilityResponseDto updateAvailability(UUID id, AvailabilityRequestDto requestDto) {
        validateAvailabilityRequest(requestDto);
        
        AvailabilityEntity availability = getAvailabilityEntityById(id);
        
        // Update the availability entity with new values
        AvailabilityEntity.updateEntity(requestDto, availability);
        
        AvailabilityEntity updatedAvailability = availabilityRepository.save(availability);
        
        return AvailabilityEntity.toDto(updatedAvailability);
    }

    @Override
    @Transactional
    public void deleteAvailability(UUID id) {
        AvailabilityEntity availability = getAvailabilityEntityById(id);
        availabilityRepository.delete(availability);
    }

    @Override
    @Transactional
    public void deleteRecurringAvailabilities(UUID id) {
        AvailabilityEntity availability = getAvailabilityEntityById(id);
        
        if (!availability.getIsRecurring() || availability.getRecurrencePattern() == null) {
            throw new BadRequestException("The specified availability is not part of a recurring series");
        }
        
        // Find all availabilities with the same provider, pattern, and time
        List<AvailabilityEntity> recurringAvailabilities = availabilityRepository.findByProviderId(availability.getProvider().getId())
                .stream()
                .filter(a -> a.getIsRecurring() && 
                             a.getRecurrencePattern() == availability.getRecurrencePattern() &&
                             a.getStartTime().equals(availability.getStartTime()) &&
                             a.getEndTime().equals(availability.getEndTime()) &&
                             !a.getDate().isBefore(availability.getDate()))
                .collect(Collectors.toList());
        
        availabilityRepository.deleteAll(recurringAvailabilities);
    }
    
    private AvailabilityEntity getAvailabilityEntityById(UUID id) {
        return availabilityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Availability", "id", id));
    }
    
    private void validateAvailabilityRequest(AvailabilityRequestDto requestDto) {
        if (requestDto.getStartTime().isAfter(requestDto.getEndTime())) {
            throw new BadRequestException("Start time must be before end time");
        }
        
        if (requestDto.getDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Date must be in the future");
        }
        
        if (requestDto.getSlotDuration() <= 0) {
            throw new BadRequestException("Slot duration must be positive");
        }
        
        if (requestDto.getBreakDuration() < 0) {
            throw new BadRequestException("Break duration cannot be negative");
        }
    }
    
    private void validateRecurringAvailabilityRequest(AvailabilityRequestDto requestDto) {
        validateAvailabilityRequest(requestDto);
        
        if (!Boolean.TRUE.equals(requestDto.getIsRecurring())) {
            throw new BadRequestException("Availability must be recurring");
        }
        
        if (requestDto.getRecurrencePattern() == null) {
            throw new BadRequestException("Recurrence pattern is required for recurring availability");
        }
        
        if (requestDto.getRecurrenceEndDate() == null) {
            throw new BadRequestException("Recurrence end date is required for recurring availability");
        }
        
        if (requestDto.getRecurrenceEndDate().isBefore(requestDto.getDate())) {
            throw new BadRequestException("Recurrence end date must be after start date");
        }
    }
    
    private void validateDateRange(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            throw new BadRequestException("Start date and end date are required");
        }
        
        if (startDate.isAfter(endDate)) {
            throw new BadRequestException("Start date must be before or equal to end date");
        }
    }
    
    private LocalDate getNextRecurrenceDate(LocalDate currentDate, RecurrencePattern pattern) {
        switch (pattern) {
            case DAILY:
                return currentDate.plusDays(1);
            case WEEKLY:
                return currentDate.plusWeeks(1);
            case MONTHLY:
                return currentDate.plusMonths(1);
            default:
                throw new IllegalArgumentException("Unsupported recurrence pattern: " + pattern);
        }
    }
    
    private AvailabilityRequestDto copyAvailabilityRequestWithNewDate(AvailabilityRequestDto original, LocalDate newDate) {
        AvailabilityRequestDto copy = new AvailabilityRequestDto();
        
        copy.setDate(newDate);
        copy.setStartTime(original.getStartTime());
        copy.setEndTime(original.getEndTime());
        copy.setTimezone(original.getTimezone());
        copy.setIsRecurring(original.getIsRecurring());
        copy.setRecurrencePattern(original.getRecurrencePattern());
        copy.setRecurrenceEndDate(original.getRecurrenceEndDate());
        copy.setSlotDuration(original.getSlotDuration());
        copy.setBreakDuration(original.getBreakDuration());
        copy.setAppointmentType(original.getAppointmentType());
        copy.setMaxAppointmentsPerSlot(original.getMaxAppointmentsPerSlot());
        copy.setLocation(original.getLocation());
        copy.setPricing(original.getPricing());
        copy.setNotes(original.getNotes());
        copy.setSpecialRequirements(original.getSpecialRequirements());
        
        return copy;
    }
} 