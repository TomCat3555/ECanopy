package com.ecanopy.repository;

import com.ecanopy.entity.FrequentVisitor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FrequentVisitorRepository extends JpaRepository<FrequentVisitor, Long> {

    // Check if visitor is a frequent visitor for a specific flat
    Optional<FrequentVisitor> findByVisitor_VisitorIdAndFlat_FlatIdAndIsActiveTrueAndValidFromBeforeAndValidUntilAfter(
            Long visitorId, Long flatId, LocalDate now1, LocalDate now2);

    // Get all active frequent visitors for a flat
    List<FrequentVisitor> findByFlat_FlatIdAndIsActiveTrueAndValidUntilAfter(Long flatId, LocalDate now);

    // Get all frequent visitors created by a resident
    List<FrequentVisitor> findByCreatedBy_ResidentIdOrderByCreatedAtDesc(Long residentId);

    // Get all frequent visitors for a society
    List<FrequentVisitor> findByFlat_Building_Society_SocietyIdAndIsActiveTrueOrderByCreatedAtDesc(Long societyId);
}
