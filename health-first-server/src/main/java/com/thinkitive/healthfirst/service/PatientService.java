package com.thinkitive.healthfirst.service;

import com.thinkitive.healthfirst.dto.response.PatientResponseDto;
import com.thinkitive.healthfirst.entity.PatientEntity;

import java.util.List;
import java.util.UUID;

public interface PatientService {
    
    PatientResponseDto getPatientById(UUID id);
    
    PatientResponseDto getPatientByUserId(UUID userId);
    
    List<PatientResponseDto> getAllPatients();
    
    PatientEntity getPatientEntityById(UUID id);
    
    PatientEntity getPatientEntityByUserId(UUID userId);
} 