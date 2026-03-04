package com.ecanopy.repository;

import com.ecanopy.entity.VisitorApproval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VisitorApprovalRepository extends JpaRepository<VisitorApproval, Long> {
    List<VisitorApproval> findByResidentResidentId(Long residentId);

    List<VisitorApproval> findByResident_ResidentIdAndStatus(Long residentId,
            com.ecanopy.entity.enums.ApprovalStatus status);

    List<VisitorApproval> findByVisitorLog_LogId(Long logId);

    List<VisitorApproval> findByResident_ResidentIdOrderByRequestedAtDesc(Long residentId);
}
