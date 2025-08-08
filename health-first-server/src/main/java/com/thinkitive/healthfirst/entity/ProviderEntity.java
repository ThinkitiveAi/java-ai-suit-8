package com.thinkitive.healthfirst.entity;

import com.thinkitive.healthfirst.dto.request.AddressDto;
import com.thinkitive.healthfirst.dto.request.ProviderRegistrationDto;
import com.thinkitive.healthfirst.dto.response.ProviderResponseDto;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "providers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProviderEntity extends BaseEntity {

    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Column(nullable = false)
    private String specialization;
    
    @Column(nullable = false, unique = true)
    private String licenseNumber;
    
    private Integer yearsOfExperience;
    
    @Embedded
    private Address clinicAddress;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;
    
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;
    
    public static ProviderEntity toEntity(ProviderRegistrationDto dto) {
        return ProviderEntity.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .specialization(dto.getSpecialization())
                .licenseNumber(dto.getLicenseNumber())
                .yearsOfExperience(dto.getYearsOfExperience())
                .clinicAddress(dto.getClinicAddress() != null ? Address.toEntity(dto.getClinicAddress()) : null)
                .verificationStatus(VerificationStatus.PENDING)
                // user will be set separately
                .build();
    }
    
    public static ProviderResponseDto toDto(ProviderEntity entity) {
        return ProviderResponseDto.builder()
                .id(entity.getId())
                .user(entity.getUser() != null ? UserEntity.toDto(entity.getUser()) : null)
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .specialization(entity.getSpecialization())
                .licenseNumber(entity.getLicenseNumber())
                .yearsOfExperience(entity.getYearsOfExperience())
                .clinicAddress(entity.getClinicAddress() != null ? Address.toDto(entity.getClinicAddress()) : null)
                .verificationStatus(entity.getVerificationStatus())
                .build();
    }
    
    public static void updateEntity(ProviderRegistrationDto dto, ProviderEntity entity) {
        entity.setFirstName(dto.getFirstName());
        entity.setLastName(dto.getLastName());
        entity.setSpecialization(dto.getSpecialization());
        entity.setLicenseNumber(dto.getLicenseNumber());
        entity.setYearsOfExperience(dto.getYearsOfExperience());
        
        if (dto.getClinicAddress() != null) {
            if (entity.getClinicAddress() == null) {
                entity.setClinicAddress(Address.toEntity(dto.getClinicAddress()));
            } else {
                Address.updateEntity(dto.getClinicAddress(), entity.getClinicAddress());
            }
        }
        // user and verificationStatus are not updated here
    }
} 