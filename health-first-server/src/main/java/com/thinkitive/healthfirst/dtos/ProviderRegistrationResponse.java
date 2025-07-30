package com.thinkitive.healthfirst.dtos;

import com.thinkitive.healthfirst.models.Provider;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProviderRegistrationResponse {
    private UUID providerId;
    private String email;
    private Provider.VerificationStatus verificationStatus;

    public static ProviderRegistrationResponse fromProvider(Provider provider) {
        return ProviderRegistrationResponse.builder()
                .providerId(provider.getId())
                .email(provider.getEmail())
                .verificationStatus(provider.getVerificationStatus())
                .build();
    }
} 