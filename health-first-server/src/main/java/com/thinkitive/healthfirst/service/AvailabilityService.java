package com.thinkitive.healthfirst.service;

import com.thinkitive.healthfirst.dto.request.AvailabilityRequestDto;
import com.thinkitive.healthfirst.dto.request.AvailabilitySearchRequestDto;
import com.thinkitive.healthfirst.dto.response.AvailabilityResponseDto;
import com.thinkitive.healthfirst.entity.AppointmentType;
import com.thinkitive.healthfirst.entity.AvailabilityStatus;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface AvailabilityService {
    
    AvailabilityResponseDto createAvailability(UUID providerId, AvailabilityRequestDto requestDto);
    
    List<AvailabilityResponseDto> createRecurringAvailability(UUID providerId, AvailabilityRequestDto requestDto);
    
    AvailabilityResponseDto getAvailabilityById(UUID id);
    
    List<AvailabilityResponseDto> getAvailabilitiesByProviderId(UUID providerId);
    
    List<AvailabilityResponseDto> getAvailabilitiesByProviderIdAndDateRange(
            UUID providerId, LocalDate startDate, LocalDate endDate);
    
    List<AvailabilityResponseDto> getAvailabilitiesByProviderIdAndStatus(
            UUID providerId, AvailabilityStatus status);
    
    List<AvailabilityResponseDto> searchAvailabilities(AvailabilitySearchRequestDto searchRequestDto);
    
    List<AvailabilityResponseDto> searchAvailabilitiesBySpecialization(
            String specialization, LocalDate startDate, LocalDate endDate);
    
    List<AvailabilityResponseDto> searchAvailabilitiesByAppointmentType(
            AppointmentType appointmentType, LocalDate startDate, LocalDate endDate);
    
    AvailabilityResponseDto updateAvailability(UUID id, AvailabilityRequestDto requestDto);
    
    void deleteAvailability(UUID id);
    
    void deleteRecurringAvailabilities(UUID id);
} 