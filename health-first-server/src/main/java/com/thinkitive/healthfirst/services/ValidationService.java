package com.thinkitive.healthfirst.services;

import com.thinkitive.healthfirst.dtos.ProviderRegistrationRequest;
import com.thinkitive.healthfirst.repositories.ProviderRepository;
import com.thinkitive.healthfirst.utils.EmailUtils;
import com.thinkitive.healthfirst.utils.PasswordUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ValidationService {
    private final ProviderRepository providerRepository;
    private final EmailUtils emailUtils;
    private final PasswordUtils passwordUtils;
    
    private static final Pattern PHONE_PATTERN = Pattern.compile("^\\+?[0-9]{10,15}$");

    /**
     * Validate a provider registration request
     * @param request the registration request to validate
     * @return a map of field errors, or an empty map if the request is valid
     */
    public Map<String, String> validateProviderRegistration(ProviderRegistrationRequest request) {
        Map<String, String> errors = new HashMap<>();
        
        // Validate email
        if (!emailUtils.isValid(request.getEmail())) {
            errors.put("email", "Invalid email format");
        } else if (providerRepository.existsByEmail(request.getEmail())) {
            errors.put("email", "Email already registered");
        }
        
        // Validate phone number
        if (!PHONE_PATTERN.matcher(request.getPhoneNumber()).matches()) {
            errors.put("phoneNumber", "Invalid phone number format");
        } else if (providerRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            errors.put("phoneNumber", "Phone number already registered");
        }
        
        // Validate license number
        if (providerRepository.existsByLicenseNumber(request.getLicenseNumber())) {
            errors.put("licenseNumber", "License number already registered");
        }
        
        // Validate password
        if (!passwordUtils.isValid(request.getPassword())) {
            errors.put("password", "Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character");
        }
        
        // Validate password confirmation
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            errors.put("confirmPassword", "Passwords do not match");
        }
        
        return errors;
    }
} 