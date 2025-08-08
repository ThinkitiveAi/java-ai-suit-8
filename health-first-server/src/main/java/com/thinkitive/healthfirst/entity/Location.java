package com.thinkitive.healthfirst.entity;

import com.thinkitive.healthfirst.dto.request.LocationDto;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class Location {
    private String type; // e.g., CLINIC, HOSPITAL, VIRTUAL
    
    @Embedded
    private Address address;
    
    private String roomNumber;
    
    public static Location toEntity(LocationDto dto) {
        if (dto == null) {
            return null;
        }
        return Location.builder()
                .type(dto.getType())
                .address(Address.toEntity(dto.getAddress()))
                .roomNumber(dto.getRoomNumber())
                .build();
    }
    
    public static LocationDto toDto(Location entity) {
        if (entity == null) {
            return null;
        }
        return LocationDto.builder()
                .type(entity.getType())
                .address(Address.toDto(entity.getAddress()))
                .roomNumber(entity.getRoomNumber())
                .build();
    }
    
    public static void updateEntity(LocationDto dto, Location entity) {
        if (dto == null || entity == null) {
            return;
        }
        entity.setType(dto.getType());
        entity.setRoomNumber(dto.getRoomNumber());
        
        if (dto.getAddress() != null) {
            if (entity.getAddress() == null) {
                entity.setAddress(Address.toEntity(dto.getAddress()));
            } else {
                Address.updateEntity(dto.getAddress(), entity.getAddress());
            }
        }
    }
} 