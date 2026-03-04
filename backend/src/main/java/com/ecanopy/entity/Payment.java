package com.ecanopy.entity;

import com.ecanopy.entity.enums.PaymentMethod;
import com.ecanopy.entity.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private PaymentStatus status = PaymentStatus.CREATED;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private PaymentMethod paymentMethod;

    // Razorpay specific fields
    @Column(unique = true, length = 100)
    private String razorpayOrderId;

    @Column(unique = true, length = 100)
    private String razorpayPaymentId;

    @Column(length = 500)
    private String razorpaySignature;

    @Column(length = 100)
    private String transactionId; // Legacy field, can be used for other gateways

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime paidAt;

    @Column(length = 500)
    private String remarks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bill_id", nullable = false)
    private MaintenanceBill maintenanceBill;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paid_by_user_id")
    private User paidByUser;
}
