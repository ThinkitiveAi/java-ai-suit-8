package com.thinkitive.healthfirst.controller;

import com.thinkitive.healthfirst.dto.request.AvailabilityRequestDto;
import com.thinkitive.healthfirst.dto.request.AvailabilitySearchRequestDto;
import com.thinkitive.healthfirst.dto.response.ApiResponse;
import com.thinkitive.healthfirst.dto.response.AvailabilityResponseDto;
import com.thinkitive.healthfirst.entity.AppointmentType;
import com.thinkitive.healthfirst.entity.AvailabilityStatus;
import com.thinkitive.healthfirst.service.AvailabilityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ProviderAvailabilityController {
    
    private final AvailabilityService availabilityService;
    
    @PostMapping("/provider/{providerId}/availability")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ApiResponse<AvailabilityResponseDto>> createAvailability(
            @PathVariable UUID providerId,
            @Valid @RequestBody AvailabilityRequestDto requestDto) {
        
        AvailabilityResponseDto responseDto = availabilityService.createAvailability(providerId, requestDto);
        
        return new ResponseEntity<>(
                ApiResponse.success("Availability created successfully", responseDto),
                HttpStatus.CREATED
        );
    }
    
    @PostMapping("/provider/{providerId}/availability/recurring")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ApiResponse<List<AvailabilityResponseDto>>> createRecurringAvailability(
            @PathVariable UUID providerId,
            @Valid @RequestBody AvailabilityRequestDto requestDto) {
        
        List<AvailabilityResponseDto> responseDtos = availabilityService.createRecurringAvailability(providerId, requestDto);
        
        return new ResponseEntity<>(
                ApiResponse.success("Recurring availability created successfully", responseDtos),
                HttpStatus.CREATED
        );
    }
    
    @GetMapping("/provider/{providerId}/availability")
    @PreAuthorize("hasRole('PROVIDER') or hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<List<AvailabilityResponseDto>>> getProviderAvailability(
            @PathVariable UUID providerId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) AvailabilityStatus status) {
        
        List<AvailabilityResponseDto> availabilities;
        
        if (startDate != null && endDate != null) {
            if (status != null) {
                // Filter by date range and status
                availabilities = availabilityService.getAvailabilitiesByProviderIdAndDateRange(providerId, startDate, endDate)
                        .stream()
                        .filter(a -> a.getStatus() == status)
                        .toList();
            } else {
                // Filter by date range only
                availabilities = availabilityService.getAvailabilitiesByProviderIdAndDateRange(providerId, startDate, endDate);
            }
        } else if (status != null) {
            // Filter by status only
            availabilities = availabilityService.getAvailabilitiesByProviderIdAndStatus(providerId, status);
        } else {
            // No filters
            availabilities = availabilityService.getAvailabilitiesByProviderId(providerId);
        }
        
        return ResponseEntity.ok(ApiResponse.success("Provider availability retrieved successfully", availabilities));
    }
    
    @GetMapping("/availability/{id}")
    @PreAuthorize("hasRole('PROVIDER') or hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<AvailabilityResponseDto>> getAvailabilityById(@PathVariable UUID id) {
        AvailabilityResponseDto availability = availabilityService.getAvailabilityById(id);
        return ResponseEntity.ok(ApiResponse.success("Availability retrieved successfully", availability));
    }
    
    @PutMapping("/provider/availability/{id}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ApiResponse<AvailabilityResponseDto>> updateAvailability(
            @PathVariable UUID id,
            @Valid @RequestBody AvailabilityRequestDto requestDto) {
        
        AvailabilityResponseDto updatedAvailability = availabilityService.updateAvailability(id, requestDto);
        
        return ResponseEntity.ok(ApiResponse.success("Availability updated successfully", updatedAvailability));
    }
    
    @DeleteMapping("/provider/availability/{id}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ApiResponse<Void>> deleteAvailability(@PathVariable UUID id) {
        availabilityService.deleteAvailability(id);
        return ResponseEntity.ok(ApiResponse.success("Availability deleted successfully", null));
    }
    
    @DeleteMapping("/provider/availability/{id}/recurring")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ApiResponse<Void>> deleteRecurringAvailability(@PathVariable UUID id) {
        availabilityService.deleteRecurringAvailabilities(id);
        return ResponseEntity.ok(ApiResponse.success("Recurring availability deleted successfully", null));
    }
    
    @GetMapping("/availability/search")
    public ResponseEntity<ApiResponse<List<AvailabilityResponseDto>>> searchAvailability(
            @Valid AvailabilitySearchRequestDto searchRequestDto) {
        
        List<AvailabilityResponseDto> availabilities = availabilityService.searchAvailabilities(searchRequestDto);
        
        return ResponseEntity.ok(ApiResponse.success("Availabilities retrieved successfully", availabilities));
    }
    
    @GetMapping("/availability/search/specialization/{specialization}")
    public ResponseEntity<ApiResponse<List<AvailabilityResponseDto>>> searchAvailabilityBySpecialization(
            @PathVariable String specialization,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<AvailabilityResponseDto> availabilities = 
                availabilityService.searchAvailabilitiesBySpecialization(specialization, startDate, endDate);
        
        return ResponseEntity.ok(ApiResponse.success("Availabilities retrieved successfully", availabilities));
    }
    
    @GetMapping("/availability/search/appointment-type/{appointmentType}")
    public ResponseEntity<ApiResponse<List<AvailabilityResponseDto>>> searchAvailabilityByAppointmentType(
            @PathVariable AppointmentType appointmentType,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<AvailabilityResponseDto> availabilities = 
                availabilityService.searchAvailabilitiesByAppointmentType(appointmentType, startDate, endDate);
        
        return ResponseEntity.ok(ApiResponse.success("Availabilities retrieved successfully", availabilities));
    }
} 