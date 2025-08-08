package com.thinkitive.healthfirst.repository;

import com.thinkitive.healthfirst.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, UUID> {
    
    Optional<UserEntity> findByEmail(String email);
    
    Optional<UserEntity> findByPhoneNumber(String phoneNumber);
    
    boolean existsByEmail(String email);
    
    boolean existsByPhoneNumber(String phoneNumber);
    
    Optional<UserEntity> findByEmailOrPhoneNumber(String email, String phoneNumber);
} 