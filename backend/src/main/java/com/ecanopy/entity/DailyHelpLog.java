package com.ecanopy.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * DailyHelpLog Entity
 * Tracks entry and exit of domestic help
 */
@Entity
@Table(name = "daily_help_logs")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyHelpLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long logId;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime entryTime;

    private LocalDateTime exitTime;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "help_id", nullable = false)
    private DomesticHelp domesticHelp;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guard_id") // Guard who allowed entry
    private User guard;
}
