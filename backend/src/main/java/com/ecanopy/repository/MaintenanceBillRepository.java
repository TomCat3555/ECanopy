package com.ecanopy.repository;

import com.ecanopy.entity.MaintenanceBill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecanopy.entity.enums.BillStatus;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface MaintenanceBillRepository extends JpaRepository<MaintenanceBill, Long> {
    List<MaintenanceBill> findByFlatFlatId(Long flatId);

    List<MaintenanceBill> findByFlatBuildingSocietySocietyId(Long societyId);

    @Query("SELECT SUM(b.totalAmount) FROM MaintenanceBill b WHERE b.status = :status")
    BigDecimal sumTotalAmountByStatus(@Param("status") BillStatus status);

    @Query("SELECT SUM(b.totalAmount) FROM MaintenanceBill b WHERE b.flat.building.society.societyId = :societyId AND b.status = :status")
    BigDecimal sumTotalAmountBySocietyAndStatus(@Param("societyId") Long societyId, @Param("status") BillStatus status);
}
