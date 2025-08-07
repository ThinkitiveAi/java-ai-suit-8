package com.thinkitive.healthfirst.repository;

import com.thinkitive.healthfirst.entity.ProviderEntity;
import com.thinkitive.healthfirst.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProviderRepository extends JpaRepository<ProviderEntity, UUID> {
    
    Optional<ProviderEntity> findByUser(UserEntity user);
    
    Optional<ProviderEntity> findByUserId(UUID userId);
    
    boolean existsByLicenseNumber(String licenseNumber);
} 