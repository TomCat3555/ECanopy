package com.ecanopy.repository;

import com.ecanopy.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByMaintenanceBillBillId(Long billId);

    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);
}
