package com.thinkitive.healthfirst.controller;

import com.thinkitive.healthfirst.dto.response.ApiResponse;
import com.thinkitive.healthfirst.dto.response.PatientResponseDto;
import com.thinkitive.healthfirst.service.PatientService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @Operation(summary = "Get patient by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PatientResponseDto>> getPatientById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(patientService.getPatientById(id)));
    }

    @Operation(summary = "Get patient by User ID")
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<PatientResponseDto>> getPatientByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(ApiResponse.success(patientService.getPatientByUserId(userId)));
    }

    @Operation(summary = "Get all patients")
    @GetMapping
    public ResponseEntity<ApiResponse<List<PatientResponseDto>>> getAllPatients() {
        return ResponseEntity.ok(ApiResponse.success(patientService.getAllPatients()));
    }
}
