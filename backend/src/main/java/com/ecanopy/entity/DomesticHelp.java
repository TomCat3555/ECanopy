package com.ecanopy.entity;

import com.ecanopy.entity.enums.HelpType;
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
 * DomesticHelp Entity
 * Represents daily help staff like maids, drivers, cooks
 */
@Entity
@Table(name = "domestic_helps")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DomesticHelp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long helpId;

    @NotBlank(message = "Name is required")
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be 10 digits")
    @Column(nullable = false, length = 10)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private HelpType helpType; // MAID, DRIVER, COOK, NANNY, OTHER

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    private String photoUrl;

    // Unique code for gate entry
    @Column(unique = true, length = 6)
    private String passCode;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "society_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Society society;

    // Relationships
    @ManyToMany
    @JoinTable(name = "flat_domestic_helps", joinColumns = @JoinColumn(name = "help_id"), inverseJoinColumns = @JoinColumn(name = "flat_id"))
    @Builder.Default
    private Set<Flat> flats = new HashSet<>();

    @OneToMany(mappedBy = "domesticHelp", cascade = CascadeType.ALL)
    @Builder.Default
    private Set<DailyHelpLog> attendanceLogs = new HashSet<>();
}
