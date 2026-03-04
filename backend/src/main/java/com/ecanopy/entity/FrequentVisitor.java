package com.ecanopy.entity;

import com.ecanopy.entity.enums.VisitorCategory;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * FrequentVisitor Entity
 * Represents regular visitors like domestic help, regular delivery persons,
 * etc.
 * who get permanent/monthly passes for auto-approval
 */
@Entity
@Table(name = "frequent_visitors", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "visitor_id", "flat_id" })
})
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FrequentVisitor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "visitor_id", nullable = false)
    private Visitor visitor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flat_id", nullable = false)
    private Flat flat;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private VisitorCategory category;

    @Column(length = 100)
    private String purpose; // "Domestic Help", "Regular Delivery", etc.

    @Column(nullable = false)
    private LocalDate validFrom;

    @Column(nullable = false)
    private LocalDate validUntil;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_resident_id", nullable = false)
    private Resident createdBy;
}
