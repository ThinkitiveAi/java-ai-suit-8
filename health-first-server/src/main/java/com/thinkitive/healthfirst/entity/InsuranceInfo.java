package com.thinkitive.healthfirst.entity;

import com.thinkitive.healthfirst.dto.request.InsuranceInfoDto;
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
public class InsuranceInfo {
    private String provider;
    private String policyNumber;
    private String groupNumber;
    private String subscriberName;
    private String subscriberRelationship;
    
    public static InsuranceInfo toEntity(InsuranceInfoDto dto) {
        if (dto == null) {
            return null;
        }
        return InsuranceInfo.builder()
                .provider(dto.getProvider())
                .policyNumber(dto.getPolicyNumber())
                .groupNumber(dto.getGroupNumber())
                .subscriberName(dto.getSubscriberName())
                .subscriberRelationship(dto.getSubscriberRelationship())
                .build();
    }
    
    public static InsuranceInfoDto toDto(InsuranceInfo entity) {
        if (entity == null) {
            return null;
        }
        return InsuranceInfoDto.builder()
                .provider(entity.getProvider())
                .policyNumber(entity.getPolicyNumber())
                .groupNumber(entity.getGroupNumber())
                .subscriberName(entity.getSubscriberName())
                .subscriberRelationship(entity.getSubscriberRelationship())
                .build();
    }
    
    public static void updateEntity(InsuranceInfoDto dto, InsuranceInfo entity) {
        if (dto == null || entity == null) {
            return;
        }
        entity.setProvider(dto.getProvider());
        entity.setPolicyNumber(dto.getPolicyNumber());
        entity.setGroupNumber(dto.getGroupNumber());
        entity.setSubscriberName(dto.getSubscriberName());
        entity.setSubscriberRelationship(dto.getSubscriberRelationship());
    }
} 