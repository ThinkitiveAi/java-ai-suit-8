package com.thinkitive.healthfirst.controller;

import com.thinkitive.healthfirst.dto.request.LoginRequestDto;
import com.thinkitive.healthfirst.dto.request.PatientRegistrationDto;
import com.thinkitive.healthfirst.dto.request.ProviderRegistrationDto;
import com.thinkitive.healthfirst.dto.response.ApiResponse;
import com.thinkitive.healthfirst.dto.response.JwtAuthResponse;
import com.thinkitive.healthfirst.dto.response.PatientResponseDto;
import com.thinkitive.healthfirst.dto.response.ProviderResponseDto;
import com.thinkitive.healthfirst.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/provider-register")
    public ResponseEntity<ApiResponse<ProviderResponseDto>> registerProvider(
            @Valid @RequestBody ProviderRegistrationDto registrationDto) {
        ProviderResponseDto responseDto = authService.registerProvider(registrationDto);
        return new ResponseEntity<>(
                ApiResponse.success("Provider registered successfully", responseDto),
                HttpStatus.CREATED
        );
    }
    
    @PostMapping("/patient-register")
    public ResponseEntity<ApiResponse<PatientResponseDto>> registerPatient(
            @Valid @RequestBody PatientRegistrationDto registrationDto) {
        PatientResponseDto responseDto = authService.registerPatient(registrationDto);
        return new ResponseEntity<>(
                ApiResponse.success("Patient registered successfully", responseDto),
                HttpStatus.CREATED
        );
    }
    
    @PostMapping("/provider-login")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> loginProvider(
            @Valid @RequestBody LoginRequestDto loginRequestDto) {
        JwtAuthResponse jwtAuthResponse = authService.loginProvider(loginRequestDto);
        return ResponseEntity.ok(ApiResponse.success("Provider logged in successfully", jwtAuthResponse));
    }
    
    @PostMapping("/patient-login")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> loginPatient(
            @Valid @RequestBody LoginRequestDto loginRequestDto) {
        JwtAuthResponse jwtAuthResponse = authService.loginPatient(loginRequestDto);
        return ResponseEntity.ok(ApiResponse.success("Patient logged in successfully", jwtAuthResponse));
    }
} 