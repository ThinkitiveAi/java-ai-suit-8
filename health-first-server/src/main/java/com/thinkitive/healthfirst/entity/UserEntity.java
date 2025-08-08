package com.thinkitive.healthfirst.entity;

import com.thinkitive.healthfirst.dto.request.UserRegistrationDto;
import com.thinkitive.healthfirst.dto.response.UserResponseDto;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEntity extends BaseEntity {

    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(unique = true, nullable = false)
    private String phoneNumber;
    
    @Column(nullable = false)
    private String passwordHash;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;
    
    @Column(nullable = false)
    private Boolean isActive;
    
    @Builder.Default
    private Boolean emailVerified = false;
    
    @Builder.Default
    private Boolean phoneVerified = false;
    
    public static UserEntity toEntity(UserRegistrationDto dto) {
        return UserEntity.builder()
                .email(dto.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                // passwordHash will be set separately after encoding
                .isActive(true)
                .emailVerified(false)
                .phoneVerified(false)
                // role will be set separately
                .build();
    }
    
    public static UserResponseDto toDto(UserEntity entity) {
        return UserResponseDto.builder()
                .id(entity.getId())
                .email(entity.getEmail())
                .phoneNumber(entity.getPhoneNumber())
                .role(entity.getRole())
                .isActive(entity.getIsActive())
                .emailVerified(entity.getEmailVerified())
                .phoneVerified(entity.getPhoneVerified())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
    
    public static void updateEntity(UserRegistrationDto dto, UserEntity entity) {
        entity.setEmail(dto.getEmail());
        entity.setPhoneNumber(dto.getPhoneNumber());
        // passwordHash and role are not updated here
    }
} 