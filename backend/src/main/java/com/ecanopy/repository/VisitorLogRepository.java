package com.ecanopy.repository;

import com.ecanopy.entity.VisitorLog;
import com.ecanopy.entity.enums.VisitorCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VisitorLogRepository extends JpaRepository<VisitorLog, Long> {
        List<VisitorLog> findByFlatFlatId(Long flatId);

        // Multi-tenancy: Active visitors by society
        List<VisitorLog> findByOutTimeIsNull();

        List<VisitorLog> findByOutTimeIsNullAndFlat_Building_Society_SocietyId(Long societyId);

        // Multi-tenancy: All visitor logs by society
        List<VisitorLog> findAllByOrderByInTimeDesc();

        List<VisitorLog> findByFlat_Building_Society_SocietyIdOrderByInTimeDesc(Long societyId);

        // Search and filter
        List<VisitorLog> findByFlat_Building_Society_SocietyIdAndVisitor_FullNameContainingIgnoreCaseOrderByInTimeDesc(
                        Long societyId, String name);

        List<VisitorLog> findByFlat_Building_Society_SocietyIdAndVisitor_PhoneContainingOrderByInTimeDesc(
                        Long societyId, String phone);

        List<VisitorLog> findByFlat_Building_Society_SocietyIdAndCategoryOrderByInTimeDesc(
                        Long societyId, VisitorCategory category);

        List<VisitorLog> findByFlat_Building_Society_SocietyIdAndInTimeBetweenOrderByInTimeDesc(
                        Long societyId, LocalDateTime startDate, LocalDateTime endDate);

        // Overstaying visitors
        List<VisitorLog> findByOutTimeIsNullAndExpectedOutTimeBeforeAndFlat_Building_Society_SocietyId(
                        LocalDateTime now, Long societyId);

        long countByInTimeBetween(LocalDateTime start, LocalDateTime end);

        long countByFlat_Building_Society_SocietyIdAndInTimeBetween(Long societyId, LocalDateTime start,
                        LocalDateTime end);
}
