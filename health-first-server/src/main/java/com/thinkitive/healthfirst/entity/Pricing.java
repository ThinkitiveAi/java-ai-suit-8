package com.thinkitive.healthfirst.entity;

import com.thinkitive.healthfirst.dto.request.PricingDto;
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
public class Pricing {
    private Double baseFee;
    private String currency;
    private Boolean insuranceAccepted;
    
    public static Pricing toEntity(PricingDto dto) {
        if (dto == null) {
            return null;
        }
        return Pricing.builder()
                .baseFee(dto.getBaseFee())
                .currency(dto.getCurrency())
                .insuranceAccepted(dto.getInsuranceAccepted())
                .build();
    }
    
    public static PricingDto toDto(Pricing entity) {
        if (entity == null) {
            return null;
        }
        return PricingDto.builder()
                .baseFee(entity.getBaseFee())
                .currency(entity.getCurrency())
                .insuranceAccepted(entity.getInsuranceAccepted())
                .build();
    }
    
    public static void updateEntity(PricingDto dto, Pricing entity) {
        if (dto == null || entity == null) {
            return;
        }
        entity.setBaseFee(dto.getBaseFee());
        entity.setCurrency(dto.getCurrency());
        entity.setInsuranceAccepted(dto.getInsuranceAccepted());
    }
} 