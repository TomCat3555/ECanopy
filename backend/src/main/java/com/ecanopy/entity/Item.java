package com.ecanopy.entity;

import com.ecanopy.entity.enums.ItemStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "items")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itemId;

    @NotBlank
    @Column(nullable = false, length = 200)
    private String itemName;

    @NotBlank
    @Column(nullable = false, length = 1000)
    private String description;

    @DecimalMin(value = "0.00")
    @Column(precision = 10, scale = 2)
    private BigDecimal minPrice;

    @DecimalMin(value = "0.00")
    @Column(precision = 10, scale = 2)
    private BigDecimal maxPrice;

    @Column(nullable = false)
    @Builder.Default
    private Boolean negotiable = false;

    @Column(length = 50)
    private String category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ItemStatus status = ItemStatus.AVAILABLE;

    @Column(length = 500)
    private String imageUrl;

    @Column(length = 500)
    private String videoUrl;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;
}
