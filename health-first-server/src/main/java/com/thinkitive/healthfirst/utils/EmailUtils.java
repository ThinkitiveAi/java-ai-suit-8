package com.thinkitive.healthfirst.utils;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.regex.Pattern;

@Component
public class EmailUtils {
    private static final Pattern EMAIL_PATTERN = 
        Pattern.compile("^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$");
    
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    /**
     * Validate an email address
     * @param email the email to validate
     * @return true if the email is valid, false otherwise
     */
    public boolean isValid(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }

    /**
     * Generate a secure verification token
     * @return a secure verification token
     */
    public String generateVerificationToken() {
        byte[] tokenBytes = new byte[32]; // 256 bits
        SECURE_RANDOM.nextBytes(tokenBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
    }

    /**
     * Sanitize an email address
     * @param email the email to sanitize
     * @return the sanitized email
     */
    public String sanitize(String email) {
        if (email == null) {
            return null;
        }
        return email.trim().toLowerCase();
    }
} 