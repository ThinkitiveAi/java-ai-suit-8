package com.thinkitive.healthfirst.entity;

import com.thinkitive.healthfirst.dto.request.EmergencyContactDto;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class EmergencyContact {
    private String name;
    private String phone;
    private String relationship;
    
    public static EmergencyContact toEntity(EmergencyContactDto dto) {
        if (dto == null) {
            return null;
        }
        return EmergencyContact.builder()
                .name(dto.getName())
                .phone(dto.getPhone())
                .relationship(dto.getRelationship())
                .build();
    }
    
    public static EmergencyContactDto toDto(EmergencyContact entity) {
        if (entity == null) {
            return null;
        }
        return EmergencyContactDto.builder()
                .name(entity.getName())
                .phone(entity.getPhone())
                .relationship(entity.getRelationship())
                .build();
    }
    
    public static void updateEntity(EmergencyContactDto dto, EmergencyContact entity) {
        if (dto == null || entity == null) {
            return;
        }
        entity.setName(dto.getName());
        entity.setPhone(dto.getPhone());
        entity.setRelationship(dto.getRelationship());
    }
} 