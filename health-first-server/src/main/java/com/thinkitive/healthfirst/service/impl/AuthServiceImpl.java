package com.thinkitive.healthfirst.service.impl;

import com.thinkitive.healthfirst.dto.request.LoginRequestDto;
import com.thinkitive.healthfirst.dto.request.PatientRegistrationDto;
import com.thinkitive.healthfirst.dto.request.ProviderRegistrationDto;
import com.thinkitive.healthfirst.dto.response.JwtAuthResponse;
import com.thinkitive.healthfirst.dto.response.PatientResponseDto;
import com.thinkitive.healthfirst.dto.response.ProviderResponseDto;
import com.thinkitive.healthfirst.entity.PatientEntity;
import com.thinkitive.healthfirst.entity.ProviderEntity;
import com.thinkitive.healthfirst.entity.UserEntity;
import com.thinkitive.healthfirst.entity.UserRole;
import com.thinkitive.healthfirst.exception.BadRequestException;
import com.thinkitive.healthfirst.exception.UnauthorizedException;
import com.thinkitive.healthfirst.exception.ValidationException;
import com.thinkitive.healthfirst.repository.PatientRepository;
import com.thinkitive.healthfirst.repository.ProviderRepository;
import com.thinkitive.healthfirst.repository.UserRepository;
import com.thinkitive.healthfirst.security.JwtTokenProvider;
import com.thinkitive.healthfirst.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final ProviderRepository providerRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Override
    @Transactional
    public ProviderResponseDto registerProvider(ProviderRegistrationDto registrationDto) {
        // Validate unique fields
        validateUniqueEmail(registrationDto.getUser().getEmail());
        validateUniquePhone(registrationDto.getUser().getPhoneNumber());
        validateUniqueLicenseNumber(registrationDto.getLicenseNumber());

        // Create user entity
        UserEntity userEntity = UserEntity.toEntity(registrationDto.getUser());
        userEntity.setRole(UserRole.PROVIDER);
        userEntity.setPasswordHash(passwordEncoder.encode(registrationDto.getUser().getPassword()));
        
        UserEntity savedUser = userRepository.save(userEntity);

        // Create provider entity
        ProviderEntity providerEntity = ProviderEntity.toEntity(registrationDto);
        providerEntity.setUser(savedUser);
        
        ProviderEntity savedProvider = providerRepository.save(providerEntity);
        
        return ProviderEntity.toDto(savedProvider);
    }

    @Override
    @Transactional
    public PatientResponseDto registerPatient(PatientRegistrationDto registrationDto) {
        // Validate unique fields
        validateUniqueEmail(registrationDto.getUser().getEmail());
        validateUniquePhone(registrationDto.getUser().getPhoneNumber());
        validatePatientAge(registrationDto.getDateOfBirth());

        // Create user entity
        UserEntity userEntity = UserEntity.toEntity(registrationDto.getUser());
        userEntity.setRole(UserRole.PATIENT);
        userEntity.setPasswordHash(passwordEncoder.encode(registrationDto.getUser().getPassword()));
        
        UserEntity savedUser = userRepository.save(userEntity);

        // Create patient entity
        PatientEntity patientEntity = PatientEntity.toEntity(registrationDto);
        patientEntity.setUser(savedUser);
        
        PatientEntity savedPatient = patientRepository.save(patientEntity);
        
        return PatientEntity.toDto(savedPatient);
    }

    @Override
    public JwtAuthResponse loginProvider(LoginRequestDto loginRequestDto) {
        Authentication authentication = authenticateUser(loginRequestDto.getUsername(), loginRequestDto.getPassword());
        
        UserEntity user = userRepository.findByEmail(loginRequestDto.getUsername())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));
        
        if (user.getRole() != UserRole.PROVIDER) {
            throw new UnauthorizedException("Invalid provider credentials");
        }
        
        ProviderEntity provider = providerRepository.findByUser(user)
                .orElseThrow(() -> new UnauthorizedException("Provider profile not found"));
        
        String token = tokenProvider.generateToken(authentication);
        
        return JwtAuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .expiresIn(tokenProvider.getExpirationTime())
                .userData(ProviderEntity.toDto(provider))
                .build();
    }

    @Override
    public JwtAuthResponse loginPatient(LoginRequestDto loginRequestDto) {
        Authentication authentication = authenticateUser(loginRequestDto.getUsername(), loginRequestDto.getPassword());
        
        UserEntity user = userRepository.findByEmailOrPhoneNumber(loginRequestDto.getUsername(), loginRequestDto.getUsername())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));
        
        if (user.getRole() != UserRole.PATIENT) {
            throw new UnauthorizedException("Invalid patient credentials");
        }
        
        PatientEntity patient = patientRepository.findByUser(user)
                .orElseThrow(() -> new UnauthorizedException("Patient profile not found"));
        
        String token = tokenProvider.generateToken(authentication);
        
        return JwtAuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .expiresIn(tokenProvider.getExpirationTime())
                .userData(PatientEntity.toDto(patient))
                .build();
    }

    private Authentication authenticateUser(String username, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password));
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return authentication;
    }

    private void validateUniqueEmail(String email) {
        if (userRepository.existsByEmail(email)) {
            Map<String, String[]> errors = new HashMap<>();
            errors.put("email", new String[]{"Email is already registered"});
            throw new ValidationException("Email is already registered", errors);
        }
    }

    private void validateUniquePhone(String phone) {
        if (userRepository.existsByPhoneNumber(phone)) {
            Map<String, String[]> errors = new HashMap<>();
            errors.put("phoneNumber", new String[]{"Phone number is already registered"});
            throw new ValidationException("Phone number is already registered", errors);
        }
    }

    private void validateUniqueLicenseNumber(String licenseNumber) {
        if (providerRepository.existsByLicenseNumber(licenseNumber)) {
            Map<String, String[]> errors = new HashMap<>();
            errors.put("licenseNumber", new String[]{"License number is already registered"});
            throw new ValidationException("License number is already registered", errors);
        }
    }

    private void validatePatientAge(LocalDate dateOfBirth) {
        if (dateOfBirth == null) {
            throw new BadRequestException("Date of birth is required");
        }
        
        int age = Period.between(dateOfBirth, LocalDate.now()).getYears();
        if (age < 13) {
            Map<String, String[]> errors = new HashMap<>();
            errors.put("dateOfBirth", new String[]{"Patient must be at least 13 years old"});
            throw new ValidationException("Patient must be at least 13 years old", errors);
        }
    }
} 