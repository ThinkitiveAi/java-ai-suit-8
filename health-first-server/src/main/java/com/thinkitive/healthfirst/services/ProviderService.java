package com.thinkitive.healthfirst.services;

import com.thinkitive.healthfirst.dtos.ProviderRegistrationRequest;
import com.thinkitive.healthfirst.dtos.ProviderRegistrationResponse;
import com.thinkitive.healthfirst.models.ClinicAddress;
import com.thinkitive.healthfirst.models.Provider;
import com.thinkitive.healthfirst.repositories.ProviderRepository;
import com.thinkitive.healthfirst.utils.PasswordUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProviderService {
    private final ProviderRepository providerRepository;
    private final ValidationService validationService;
    private final EmailService emailService;
    private final PasswordUtils passwordUtils;

    /**
     * Register a new provider
     * @param request the registration request
     * @return the registration response
     * @throws IllegalArgumentException if the registration request is invalid
     */
    @Transactional
    public ProviderRegistrationResponse registerProvider(ProviderRegistrationRequest request) {
        // Validate the registration request
        Map<String, String> validationErrors = validationService.validateProviderRegistration(request);
        if (!validationErrors.isEmpty()) {
            log.warn("Provider registration validation errors: {}", validationErrors);  // <== ADD THIS
            throw new IllegalArgumentException("Invalid registration request: " + validationErrors);
        }

        // Create the provider entity
        Provider provider = Provider.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .passwordHash(passwordUtils.encode(request.getPassword()))
                .specialization(request.getSpecialization())
                .licenseNumber(request.getLicenseNumber())
                .licenseDocumentUrl(request.getLicenseDocumentUrl())
                .yearsOfExperience(request.getYearsOfExperience())
                .clinicAddress(request.getClinicAddress() != null 
                    ? request.getClinicAddress().toEntity() 
                    : ClinicAddress.builder().build())
                .verificationStatus(Provider.VerificationStatus.PENDING)
                .isActive(true)
                .build();

        // Save the provider
        Provider savedProvider = providerRepository.save(provider);
        log.info("Provider registered: {}", savedProvider.getId());

        // Send verification email
        emailService.sendVerificationEmail(savedProvider);

        // Return the registration response
        return ProviderRegistrationResponse.fromProvider(savedProvider);
    }
} 