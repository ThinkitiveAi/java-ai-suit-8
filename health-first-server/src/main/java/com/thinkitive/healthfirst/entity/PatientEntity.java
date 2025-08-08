package com.thinkitive.healthfirst.entity;

import com.thinkitive.healthfirst.dto.request.PatientRegistrationDto;
import com.thinkitive.healthfirst.dto.response.PatientResponseDto;
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

import java.time.LocalDate;

@Entity
@Table(name = "patients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientEntity extends BaseEntity {

    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Column(nullable = false)
    private LocalDate dateOfBirth;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;
    
    @Embedded
    private Address address;
    
    @Embedded
    private EmergencyContact emergencyContact;
    
    @Embedded
    private InsuranceInfo insuranceInfo;
    
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;
    
    public static PatientEntity toEntity(PatientRegistrationDto dto) {
        return PatientEntity.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .dateOfBirth(dto.getDateOfBirth())
                .gender(dto.getGender())
                .address(dto.getAddress() != null ? Address.toEntity(dto.getAddress()) : null)
                .emergencyContact(dto.getEmergencyContact() != null ? EmergencyContact.toEntity(dto.getEmergencyContact()) : null)
                .insuranceInfo(dto.getInsuranceInfo() != null ? InsuranceInfo.toEntity(dto.getInsuranceInfo()) : null)
                // user will be set separately
                .build();
    }
    
    public static PatientResponseDto toDto(PatientEntity entity) {
        return PatientResponseDto.builder()
                .id(entity.getId())
                .user(entity.getUser() != null ? UserEntity.toDto(entity.getUser()) : null)
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .dateOfBirth(entity.getDateOfBirth())
                .gender(entity.getGender())
                .address(entity.getAddress() != null ? Address.toDto(entity.getAddress()) : null)
                .emergencyContact(entity.getEmergencyContact() != null ? EmergencyContact.toDto(entity.getEmergencyContact()) : null)
                .insuranceInfo(entity.getInsuranceInfo() != null ? InsuranceInfo.toDto(entity.getInsuranceInfo()) : null)
                .build();
    }
    
    public static void updateEntity(PatientRegistrationDto dto, PatientEntity entity) {
        entity.setFirstName(dto.getFirstName());
        entity.setLastName(dto.getLastName());
        entity.setDateOfBirth(dto.getDateOfBirth());
        entity.setGender(dto.getGender());
        
        if (dto.getAddress() != null) {
            if (entity.getAddress() == null) {
                entity.setAddress(Address.toEntity(dto.getAddress()));
            } else {
                Address.updateEntity(dto.getAddress(), entity.getAddress());
            }
        }
        
        if (dto.getEmergencyContact() != null) {
            if (entity.getEmergencyContact() == null) {
                entity.setEmergencyContact(EmergencyContact.toEntity(dto.getEmergencyContact()));
            } else {
                EmergencyContact.updateEntity(dto.getEmergencyContact(), entity.getEmergencyContact());
            }
        }
        
        if (dto.getInsuranceInfo() != null) {
            if (entity.getInsuranceInfo() == null) {
                entity.setInsuranceInfo(InsuranceInfo.toEntity(dto.getInsuranceInfo()));
            } else {
                InsuranceInfo.updateEntity(dto.getInsuranceInfo(), entity.getInsuranceInfo());
            }
        }
        // user is not updated here
    }
} 