package com.ecanopy.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Poll Entity
 * Represents polls created for society residents
 */
@Entity
@Table(name = "polls")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Poll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pollId;

    @NotBlank(message = "Question is required")
    @Column(nullable = false, length = 500)
    private String question;

    @Column(nullable = false)
    private String option1;

    @Column(nullable = false)
    private String option2;

    private String option3;
    private String option4;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "society_id", nullable = false)
    private Society society;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @OneToMany(mappedBy = "poll", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<PollVote> votes = new HashSet<>();
}
