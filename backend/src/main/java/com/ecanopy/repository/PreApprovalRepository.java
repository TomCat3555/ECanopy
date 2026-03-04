package com.ecanopy.repository;

import com.ecanopy.entity.PreApproval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PreApprovalRepository extends JpaRepository<PreApproval, Long> {
    Optional<PreApproval> findByCodeAndIsUsedFalse(String code);

    // Fixed: Now validates both phone AND flat for security
    Optional<PreApproval> findByVisitorPhoneAndFlat_FlatIdAndIsUsedFalseAndValidFromBeforeAndValidUntilAfter(
            String phone, Long flatId, LocalDateTime now1, LocalDateTime now2);

    // Get all active pre-approvals for a flat
    List<PreApproval> findByFlat_FlatIdAndIsUsedFalseAndValidUntilAfter(Long flatId, LocalDateTime now);

    // Get all pre-approvals by resident
    List<PreApproval> findByResident_ResidentIdOrderByCreatedAtDesc(Long residentId);
}
