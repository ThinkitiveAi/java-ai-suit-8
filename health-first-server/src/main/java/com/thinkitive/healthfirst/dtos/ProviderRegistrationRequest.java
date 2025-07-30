package com.thinkitive.healthfirst.dtos;

import com.thinkitive.healthfirst.models.ClinicAddress;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProviderRegistrationRequest {

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Phone number must be valid")
    private String phoneNumber;

    @NotBlank(message = "Password is required")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$", 
             message = "Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character")
    private String password;

    @NotBlank(message = "Password confirmation is required")
    private String confirmPassword;

    @NotBlank(message = "Specialization is required")
    private String specialization;

    @NotBlank(message = "License number is required")
    private String licenseNumber;

    private String licenseDocumentUrl;

    @Min(value = 0, message = "Years of experience must be positive")
    private Integer yearsOfExperience;

    @Valid
    private ClinicAddressDTO clinicAddress;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ClinicAddressDTO {
        @NotBlank(message = "Street address is required")
        @Size(max = 100, message = "Street address must be less than 100 characters")
        private String street;

        @NotBlank(message = "City is required")
        @Size(max = 50, message = "City must be less than 50 characters")
        private String city;

        @NotBlank(message = "State is required")
        @Size(max = 50, message = "State must be less than 50 characters")
        private String state;

        @NotBlank(message = "ZIP code is required")
        @Pattern(regexp = "^\\d{5}(-\\d{4})?$", message = "ZIP code must be valid (e.g., 12345 or 12345-6789)")
        private String zip;

        public ClinicAddress toEntity() {
            return ClinicAddress.builder()
                    .street(this.street)
                    .city(this.city)
                    .state(this.state)
                    .zip(this.zip)
                    .build();
        }
    }
} 