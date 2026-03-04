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

@Entity
@Table(name = "amenities")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Amenity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long amenityId;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String amenityName;

    @Column(length = 500)
    private String description;

    @Min(1)
    private Integer capacity;

    @Column(length = 1000)
    private String rules;

    @Column(length = 500)
    private String imageUrl;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isActive = true;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "society_id", nullable = false)
    private Society society;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "amenity", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<AmenityBooking> bookings = new HashSet<>();
}
