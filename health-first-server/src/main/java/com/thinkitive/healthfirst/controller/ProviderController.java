package com.thinkitive.healthfirst.controller;

import com.thinkitive.healthfirst.dto.response.ApiResponse;
import com.thinkitive.healthfirst.dto.response.ProviderResponseDto;
import com.thinkitive.healthfirst.service.ProviderService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/providers")
@RequiredArgsConstructor
public class ProviderController {

    private final ProviderService providerService;

    @Operation(summary = "Get provider by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProviderResponseDto>> getProviderById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(providerService.getProviderById(id)));
    }

    @Operation(summary = "Get provider by User ID")
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<ProviderResponseDto>> getProviderByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(ApiResponse.success(providerService.getProviderByUserId(userId)));
    }

    @Operation(summary = "Get all providers")
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProviderResponseDto>>> getAllProviders() {
        return ResponseEntity.ok(ApiResponse.success(providerService.getAllProviders()));
    }

    @Operation(summary = "Get providers by specialization")
    @GetMapping("/specialization/{specialization}")
    public ResponseEntity<ApiResponse<List<ProviderResponseDto>>> getProvidersBySpecialization(
            @PathVariable String specialization) {
        return ResponseEntity.ok(ApiResponse.success(providerService.getProvidersBySpecialization(specialization)));
    }
}
