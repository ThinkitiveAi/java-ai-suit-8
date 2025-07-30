package com.thinkitive.healthfirst.service;

import com.thinkitive.healthfirst.dtos.ProviderRegistrationRequest;
import com.thinkitive.healthfirst.dtos.ProviderRegistrationResponse;
import com.thinkitive.healthfirst.models.Provider;
import com.thinkitive.healthfirst.repositories.ProviderRepository;
import com.thinkitive.healthfirst.services.EmailService;
import com.thinkitive.healthfirst.services.ProviderService;
import com.thinkitive.healthfirst.services.ValidationService;
import com.thinkitive.healthfirst.utils.PasswordUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProviderServiceTest {

    @Mock
    private ProviderRepository providerRepository;

    @Mock
    private ValidationService validationService;

    @Mock
    private EmailService emailService;

    @Mock
    private PasswordUtils passwordUtils;

    @InjectMocks
    private ProviderService providerService;

    private ProviderRegistrationRequest validRequest;

    @BeforeEach
    void setUp() {
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
    }

    @Test
    void whenValidRequest_thenProviderIsRegistered() {
        // Arrange
        Map<String, String> emptyErrors = new HashMap<>();
        when(validationService.validateProviderRegistration(any(ProviderRegistrationRequest.class)))
                .thenReturn(emptyErrors);
        when(passwordUtils.encode(anyString())).thenReturn("hashedPassword");
        
        Provider savedProvider = Provider.builder()
                .id(UUID.randomUUID())
                .firstName(validRequest.getFirstName())
                .lastName(validRequest.getLastName())
                .email(validRequest.getEmail())
                .verificationStatus(Provider.VerificationStatus.PENDING)
                .build();
        
        when(providerRepository.save(any(Provider.class))).thenReturn(savedProvider);
        when(emailService.sendVerificationEmail(any(Provider.class))).thenReturn("token");

        // Act
        ProviderRegistrationResponse response = providerService.registerProvider(validRequest);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getEmail()).isEqualTo(validRequest.getEmail());
        assertThat(response.getVerificationStatus()).isEqualTo(Provider.VerificationStatus.PENDING);
        
        verify(providerRepository, times(1)).save(any(Provider.class));
        verify(emailService, times(1)).sendVerificationEmail(any(Provider.class));
    }

    @Test
    void whenInvalidRequest_thenThrowsException() {
        // Arrange
        Map<String, String> errors = new HashMap<>();
        errors.put("email", "Email already registered");
        
        when(validationService.validateProviderRegistration(any(ProviderRegistrationRequest.class)))
                .thenReturn(errors);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            providerService.registerProvider(validRequest);
        });
        
        verify(providerRepository, never()).save(any(Provider.class));
        verify(emailService, never()).sendVerificationEmail(any(Provider.class));
    }
} 