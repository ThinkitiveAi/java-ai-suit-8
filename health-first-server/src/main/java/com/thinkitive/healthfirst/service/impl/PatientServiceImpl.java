package com.thinkitive.healthfirst.service.impl;

import com.thinkitive.healthfirst.dto.response.PatientResponseDto;
import com.thinkitive.healthfirst.entity.PatientEntity;
import com.thinkitive.healthfirst.exception.ResourceNotFoundException;
import com.thinkitive.healthfirst.repository.PatientRepository;
import com.thinkitive.healthfirst.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;

    @Override
    @Transactional(readOnly = true)
    public PatientResponseDto getPatientById(UUID id) {
        PatientEntity patient = getPatientEntityById(id);
        return PatientEntity.toDto(patient);
    }

    @Override
    @Transactional(readOnly = true)
    public PatientResponseDto getPatientByUserId(UUID userId) {
        PatientEntity patient = getPatientEntityByUserId(userId);
        return PatientEntity.toDto(patient);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PatientResponseDto> getAllPatients() {
        return patientRepository.findAll().stream()
                .map(PatientEntity::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PatientEntity getPatientEntityById(UUID id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", id));
    }

    @Override
    @Transactional(readOnly = true)
    public PatientEntity getPatientEntityByUserId(UUID userId) {
        return patientRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "userId", userId));
    }
} 