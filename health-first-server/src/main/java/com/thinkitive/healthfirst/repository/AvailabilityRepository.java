package com.thinkitive.healthfirst.repository;

import com.thinkitive.healthfirst.entity.AppointmentType;
import com.thinkitive.healthfirst.entity.AvailabilityEntity;
import com.thinkitive.healthfirst.entity.AvailabilityStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface AvailabilityRepository extends JpaRepository<AvailabilityEntity, UUID> {
    
    List<AvailabilityEntity> findByProviderId(UUID providerId);
    
    List<AvailabilityEntity> findByProviderIdAndDateBetween(UUID providerId, LocalDate startDate, LocalDate endDate);
    
    List<AvailabilityEntity> findByProviderIdAndStatus(UUID providerId, AvailabilityStatus status);
    
    List<AvailabilityEntity> findByProviderIdAndDateBetweenAndStatus(
            UUID providerId, LocalDate startDate, LocalDate endDate, AvailabilityStatus status);
    
    @Query("SELECT a FROM AvailabilityEntity a WHERE a.status = :status " +
           "AND a.date BETWEEN :startDate AND :endDate " +
           "AND a.appointmentType = :appointmentType")
    List<AvailabilityEntity> findAvailableSlotsByTypeAndDateRange(
            AvailabilityStatus status, LocalDate startDate, LocalDate endDate, AppointmentType appointmentType);
    
    @Query("SELECT a FROM AvailabilityEntity a WHERE a.status = :status " +
           "AND a.date BETWEEN :startDate AND :endDate " +
           "AND a.provider.specialization = :specialization")
    List<AvailabilityEntity> findAvailableSlotsBySpecializationAndDateRange(
            AvailabilityStatus status, LocalDate startDate, LocalDate endDate, String specialization);
} 