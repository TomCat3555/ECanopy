package com.ecanopy.entity;

import com.ecanopy.entity.enums.AccessType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "access_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccessLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to User (for Residents)
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Link to DomesticHelp (for Staff)
    @ManyToOne
    @JoinColumn(name = "domestic_help_id")
    private DomesticHelp domesticHelp;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccessType accessType; // ENTRY or EXIT

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "scanned_by")
    private String scannedBy; // Username/ID of guard who scanned
}
