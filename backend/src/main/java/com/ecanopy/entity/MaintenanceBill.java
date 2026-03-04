package com.ecanopy.entity;

import com.ecanopy.entity.enums.BillStatus;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "maintenance_bills", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "flat_id", "bill_month" })
})
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceBill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long billId;

    @Column(nullable = false)
    private LocalDate billMonth;

    @Column(precision = 10, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal waterCharges = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal parkingCharges = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal sinkingFund = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal electricityCharges = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal penalties = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(nullable = false)
    private LocalDate dueDate;

    private LocalDate paidDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private BillStatus status = BillStatus.PENDING;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flat_id", nullable = false)
    private Flat flat;

    @OneToMany(mappedBy = "maintenanceBill", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Payment> payments = new HashSet<>();
}
