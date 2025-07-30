package com.thinkitive.healthfirst.models;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClinicAddress {

    @NotBlank(message = "Street address is required")
    @Size(max = 100, message = "Street address must be less than 100 characters")
    @Column(name = "street")
    private String street;

    @NotBlank(message = "City is required")
    @Size(max = 50, message = "City must be less than 50 characters")
    @Column(name = "city")
    private String city;

    @NotBlank(message = "State is required")
    @Size(max = 50, message = "State must be less than 50 characters")
    @Column(name = "state")
    private String state;

    @NotBlank(message = "ZIP code is required")
    @Pattern(regexp = "^\\d{5}(-\\d{4})?$", message = "ZIP code must be valid (e.g., 12345 or 12345-6789)")
    @Column(name = "zip")
    private String zip;
} 