package com.thinkitive.healthfirst.entity;

import com.thinkitive.healthfirst.dto.request.AddressDto;
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
public class Address {
    private String street;
    private String city;
    private String state;
    private String zipCode;
    private String country;
    
    public static Address toEntity(AddressDto dto) {
        if (dto == null) {
            return null;
        }
        return Address.builder()
                .street(dto.getStreet())
                .city(dto.getCity())
                .state(dto.getState())
                .zipCode(dto.getZipCode())
                .country(dto.getCountry())
                .build();
    }
    
    public static AddressDto toDto(Address entity) {
        if (entity == null) {
            return null;
        }
        return AddressDto.builder()
                .street(entity.getStreet())
                .city(entity.getCity())
                .state(entity.getState())
                .zipCode(entity.getZipCode())
                .country(entity.getCountry())
                .build();
    }
    
    public static void updateEntity(AddressDto dto, Address entity) {
        if (dto == null || entity == null) {
            return;
        }
        entity.setStreet(dto.getStreet());
        entity.setCity(dto.getCity());
        entity.setState(dto.getState());
        entity.setZipCode(dto.getZipCode());
        entity.setCountry(dto.getCountry());
    }
} 