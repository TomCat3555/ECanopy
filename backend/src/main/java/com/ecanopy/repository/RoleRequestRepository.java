package com.ecanopy.repository;

import com.ecanopy.entity.RoleRequest;
import com.ecanopy.entity.enums.ApprovalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoleRequestRepository extends JpaRepository<RoleRequest, Long> {
    List<RoleRequest> findByStatus(ApprovalStatus status);
}
