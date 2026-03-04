package com.ecanopy.entity;

import com.ecanopy.entity.enums.ComplaintStatus;
import com.ecanopy.entity.enums.Priority;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "complaints", uniqueConstraints = {
        @UniqueConstraint(columnNames = "ticket_number")
})
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Complaint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long complaintId;

    @NotBlank
    @Column(nullable = false, unique = true, length = 50)
    private String ticketNumber;

    @NotBlank
    @Column(nullable = false, length = 200)
    private String title;

    @NotBlank
    @Column(nullable = false, length = 2000)
    private String description;

    @Column(length = 50)
    private String category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private Priority priority = Priority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ComplaintStatus status = ComplaintStatus.OPEN;

    @Column(length = 100)
    private String assignedTo;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime resolvedAt;

    @Builder.Default
    @Column(columnDefinition = "boolean default false")
    private boolean unreadByResident = false;

    @Builder.Default
    @Column(columnDefinition = "boolean default false")
    private boolean unreadByStaff = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resident_id", nullable = false)
    private Resident resident;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to_user_id")
    private User assignedToUser;

    @OneToMany(mappedBy = "complaint", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<ComplaintComment> comments = new HashSet<>();

    @OneToMany(mappedBy = "complaint", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<ComplaintAttachment> attachments = new HashSet<>();
}
