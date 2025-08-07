package com.thinkitive.healthfirst.service;

import com.thinkitive.healthfirst.dto.response.ProviderResponseDto;
import com.thinkitive.healthfirst.entity.ProviderEntity;

import java.util.List;
import java.util.UUID;

public interface ProviderService {
    
    ProviderResponseDto getProviderById(UUID id);
    
    ProviderResponseDto getProviderByUserId(UUID userId);
    
    List<ProviderResponseDto> getAllProviders();
    
    List<ProviderResponseDto> getProvidersBySpecialization(String specialization);
    
    ProviderEntity getProviderEntityById(UUID id);
    
    ProviderEntity getProviderEntityByUserId(UUID userId);
} 