package com.ecanopy.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * PollVote Entity
 * Tracks votes cast by residents
 */
@Entity
@Table(name = "poll_votes", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "poll_id", "user_id" })
})
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PollVote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long voteId;

    @Column(nullable = false)
    private String selectedOption; // Matches option1, option2, etc.

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime votedAt;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "poll_id", nullable = false)
    private Poll poll;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
