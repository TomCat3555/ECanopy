package com.ecanopy.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Society Entity
 * Root entity representing a residential society
 */
@Entity
@Table(name = "societies", uniqueConstraints = {
        @UniqueConstraint(columnNames = "society_name")
})
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Society {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long societyId;

    @NotBlank(message = "Society name is required")
    @Pattern(regexp = "^[a-zA-Z0-9\\s]{3,100}$", message = "Society name must be 3-100 characters")
    @Column(nullable = false, unique = true, length = 100)
    private String societyName;

    @Pattern(regexp = "^[a-zA-Z0-9\\s,.-_+()':]{0,300}$", message = "Invalid society description")
    @Column(length = 300)
    private String societyDescription;

    @Pattern(regexp = "^[a-zA-Z0-9\\s,.-_+()':/#]{5,200}$", message = "Invalid address format")
    @Column(length = 200)
    private String address;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    // Relationships
    @OneToMany(mappedBy = "society", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Building> buildings = new HashSet<>();

    @OneToMany(mappedBy = "society", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Amenity> amenities = new HashSet<>();

    @OneToMany(mappedBy = "society", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Notice> notices = new HashSet<>();

    @OneToMany(mappedBy = "society", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<RwaMember> rwaMembers = new HashSet<>();

    @OneToMany(mappedBy = "society", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Poll> polls = new HashSet<>();
}
