package com.thinkitive.healthfirst.service;

import com.thinkitive.healthfirst.dto.request.LoginRequestDto;
import com.thinkitive.healthfirst.dto.request.PatientRegistrationDto;
import com.thinkitive.healthfirst.dto.request.ProviderRegistrationDto;
import com.thinkitive.healthfirst.dto.response.JwtAuthResponse;
import com.thinkitive.healthfirst.dto.response.PatientResponseDto;
import com.thinkitive.healthfirst.dto.response.ProviderResponseDto;

public interface AuthService {
    
    ProviderResponseDto registerProvider(ProviderRegistrationDto registrationDto);
    
    PatientResponseDto registerPatient(PatientRegistrationDto registrationDto);
    
    JwtAuthResponse loginProvider(LoginRequestDto loginRequestDto);
    
    JwtAuthResponse loginPatient(LoginRequestDto loginRequestDto);
} 