package com.thinkitive.healthfirst.services;

import com.thinkitive.healthfirst.models.Provider;
import com.thinkitive.healthfirst.utils.EmailUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    private final EmailUtils emailUtils;

    /**
     * Send a verification email to a provider
     * @param provider the provider to send the verification email to
     * @return the verification token
     */
    public String sendVerificationEmail(Provider provider) {
        String token = emailUtils.generateVerificationToken();
        
        // In a real application, we would send an actual email here
        // For this example, we'll just log the token
        log.info("Sending verification email to {} with token: {}", provider.getEmail(), token);
        log.info("Verification link: http://localhost:8080/api/v1/provider/verify?token={}", token);
        
        return token;
    }

    /**
     * Send a welcome email to a provider
     * @param provider the provider to send the welcome email to
     */
    public void sendWelcomeEmail(Provider provider) {
        // In a real application, we would send an actual email here
        // For this example, we'll just log the message
        log.info("Sending welcome email to {}", provider.getEmail());
    }
} 