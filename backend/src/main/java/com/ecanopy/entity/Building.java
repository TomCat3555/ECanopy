package com.ecanopy.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Building Entity
 * Represents buildings/wings within a society
 */
@Entity
@Table(name = "buildings", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "society_id", "building_name" })
})
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Building {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long buildingId;

    @NotBlank(message = "Building name is required")
    @Column(nullable = false, length = 50)
    private String buildingName;

    @Min(value = 1, message = "Total floors must be at least 1")
    @Column(nullable = false)
    private Integer totalFloors;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "society_id", nullable = false)
    private Society society;

    @OneToMany(mappedBy = "building", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Flat> flats = new HashSet<>();
}
