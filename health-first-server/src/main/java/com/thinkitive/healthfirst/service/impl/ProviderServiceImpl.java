package com.thinkitive.healthfirst.service.impl;

import com.thinkitive.healthfirst.dto.response.ProviderResponseDto;
import com.thinkitive.healthfirst.entity.ProviderEntity;
import com.thinkitive.healthfirst.exception.ResourceNotFoundException;
import com.thinkitive.healthfirst.repository.ProviderRepository;
import com.thinkitive.healthfirst.service.ProviderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProviderServiceImpl implements ProviderService {

    private final ProviderRepository providerRepository;

    @Override
    @Transactional(readOnly = true)
    public ProviderResponseDto getProviderById(UUID id) {
        ProviderEntity provider = getProviderEntityById(id);
        return ProviderEntity.toDto(provider);
    }

    @Override
    @Transactional(readOnly = true)
    public ProviderResponseDto getProviderByUserId(UUID userId) {
        ProviderEntity provider = getProviderEntityByUserId(userId);
        return ProviderEntity.toDto(provider);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProviderResponseDto> getAllProviders() {
        return providerRepository.findAll().stream()
                .map(ProviderEntity::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProviderResponseDto> getProvidersBySpecialization(String specialization) {
        return providerRepository.findAll().stream()
                .filter(provider -> provider.getSpecialization().equalsIgnoreCase(specialization))
                .map(ProviderEntity::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProviderEntity getProviderEntityById(UUID id) {
        return providerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider", "id", id));
    }

    @Override
    @Transactional(readOnly = true)
    public ProviderEntity getProviderEntityByUserId(UUID userId) {
        return providerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider", "userId", userId));
    }
} 