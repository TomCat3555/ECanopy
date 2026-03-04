package com.ecanopy.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "complaint_attachments")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintAttachment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long complaintAttachmentId;

    @NotBlank
    @Column(nullable = false, length = 255)
    private String fileName;

    @NotBlank
    @Column(nullable = false, length = 500)
    private String filePath;

    @Column(length = 100)
    private String contentType;

    private Long fileSize;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime uploadedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complaint_id", nullable = false)
    private Complaint complaint;
}
