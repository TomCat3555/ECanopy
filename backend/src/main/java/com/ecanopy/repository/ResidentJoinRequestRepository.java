package com.ecanopy.repository;

import com.ecanopy.entity.ResidentJoinRequest;
import com.ecanopy.entity.enums.ApprovalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResidentJoinRequestRepository extends JpaRepository<ResidentJoinRequest, Long> {
    List<ResidentJoinRequest> findByUserIdAndStatus(Long userId, ApprovalStatus status);

    List<ResidentJoinRequest> findByUser(com.ecanopy.entity.User user);

    List<ResidentJoinRequest> findByFlat_Building_Society_SocietyIdAndStatus(Long societyId, ApprovalStatus status);

    long countByFlat_Building_Society_SocietyIdAndStatus(Long societyId, ApprovalStatus status);
}
