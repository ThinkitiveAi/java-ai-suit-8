package com.thinkitive.healthfirst.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.thinkitive.healthfirst.dtos.ProviderRegistrationRequest;
import com.thinkitive.healthfirst.dtos.ProviderRegistrationResponse;
import com.thinkitive.healthfirst.models.Provider;
import com.thinkitive.healthfirst.services.ProviderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class ProviderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProviderService providerService;

    private ProviderRegistrationRequest validRequest;
    private ProviderRegistrationResponse mockResponse;

    @BeforeEach
    void setUp() {
        // Set up a valid registration request
        ProviderRegistrationRequest.ClinicAddressDTO addressDTO = ProviderRegistrationRequest.ClinicAddressDTO.builder()
                .street("123 Main St")
                .city("Boston")
                .state("MA")
                .zip("02108")
                .build();

        validRequest = ProviderRegistrationRequest.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .phoneNumber("1234567890")
                .password("Password1!")
                .confirmPassword("Password1!")
                .specialization("Cardiology")
                .licenseNumber("LIC12345")
                .yearsOfExperience(5)
                .clinicAddress(addressDTO)
                .build();

        // Set up mock response
        mockResponse = ProviderRegistrationResponse.builder()
                .providerId(UUID.randomUUID())
                .email("john.doe@example.com")
                .verificationStatus(Provider.VerificationStatus.PENDING)
                .build();
    }

    @Test
    void whenValidInput_thenReturns201() throws Exception {
        when(providerService.registerProvider(any(ProviderRegistrationRequest.class)))
                .thenReturn(mockResponse);

        mockMvc.perform(post("/api/v1/provider/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Provider registered successfully. Verification email sent."))
                .andExpect(jsonPath("$.data.email").value(mockResponse.getEmail()))
                .andExpect(jsonPath("$.data.verificationStatus").value(mockResponse.getVerificationStatus().name()));
    }
} 