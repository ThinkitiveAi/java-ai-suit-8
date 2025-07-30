package com.thinkitive.healthfirst.controllers;

import com.thinkitive.healthfirst.dtos.ApiResponse;
import com.thinkitive.healthfirst.dtos.ProviderRegistrationRequest;
import com.thinkitive.healthfirst.dtos.ProviderRegistrationResponse;
import com.thinkitive.healthfirst.services.ProviderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/provider")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Provider", description = "Provider API endpoints")
public class ProviderController {

    private final ProviderService providerService;

    @PostMapping("/register")
    @Operation(summary = "Register a new provider", description = "Register a new provider with the system")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201",
                    description = "Provider registered successfully",
                    content = @Content(schema = @Schema(implementation = ProviderRegistrationResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Invalid request data",
                    content = @Content(schema = @Schema(implementation = com.thinkitive.healthfirst.dtos.ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409",
                    description = "Provider already exists",
                    content = @Content(schema = @Schema(implementation = com.thinkitive.healthfirst.dtos.ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "429",
                    description = "Too many requests",
                    content = @Content(schema = @Schema(implementation = com.thinkitive.healthfirst.dtos.ApiResponse.class))
            )
    })
    public ResponseEntity<com.thinkitive.healthfirst.dtos.ApiResponse<ProviderRegistrationResponse>> registerProvider(
            @Valid @RequestBody ProviderRegistrationRequest request) {
        
        log.info("Received provider registration request for email: {}", request.getEmail());
        
        ProviderRegistrationResponse response = providerService.registerProvider(request);
        
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(com.thinkitive.healthfirst.dtos.ApiResponse.success(
                        "Provider registered successfully. Verification email sent.",
                        response));
    }

    @GetMapping("/verify")
    @Operation(summary = "Verify provider email", description = "Verify a provider's email address using a verification token")
    public ResponseEntity<com.thinkitive.healthfirst.dtos.ApiResponse<Void>> verifyEmail(
            @RequestParam String token) {
        
        // This is a placeholder for the actual verification logic
        log.info("Received verification request with token: {}", token);
        
        return ResponseEntity.ok(com.thinkitive.healthfirst.dtos.ApiResponse.success(
                "Email verification successful. You can now log in."));
    }
} 