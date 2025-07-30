package com.thinkitive.healthfirst.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Component
public class PasswordUtils {
    private static final int BCRYPT_STRENGTH = 12;
    private static final PasswordEncoder PASSWORD_ENCODER = new BCryptPasswordEncoder(BCRYPT_STRENGTH);
    
    // Pattern for password validation: at least 8 characters, 1 uppercase, 1 lowercase, 1 digit, 1 special char
    private static final Pattern PASSWORD_PATTERN = 
        Pattern.compile("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$");

    /**
     * Encode a raw password
     * @param rawPassword the raw password to encode
     * @return the encoded password
     */
    public String encode(String rawPassword) {
        return PASSWORD_ENCODER.encode(rawPassword);
    }

    /**
     * Check if a raw password matches an encoded password
     * @param rawPassword the raw password to check
     * @param encodedPassword the encoded password to check against
     * @return true if the passwords match, false otherwise
     */
    public boolean matches(String rawPassword, String encodedPassword) {
        return PASSWORD_ENCODER.matches(rawPassword, encodedPassword);
    }

    /**
     * Validate a password against the password policy
     * @param password the password to validate
     * @return true if the password is valid, false otherwise
     */
    public boolean isValid(String password) {
        return password != null && PASSWORD_PATTERN.matcher(password).matches();
    }
} 