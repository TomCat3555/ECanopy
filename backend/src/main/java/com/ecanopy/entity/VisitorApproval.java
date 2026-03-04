package com.ecanopy.entity;

import com.ecanopy.entity.enums.ApprovalStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "visitor_approvals", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "visitor_log_id", "resident_id" })
})
public class VisitorApproval {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long approvalId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ApprovalStatus status = ApprovalStatus.PENDING;

    @Column(nullable = false)
    private LocalDateTime requestedAt;

    private LocalDateTime respondedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "visitor_log_id", nullable = false)
    private VisitorLog visitorLog;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resident_id", nullable = false)
    private Resident resident;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requested_by_user_id")
    private User requestedByUser;

    public VisitorApproval() {
    }

    public VisitorApproval(Long approvalId, ApprovalStatus status, LocalDateTime requestedAt, LocalDateTime respondedAt,
            VisitorLog visitorLog, Resident resident, User requestedByUser) {
        this.approvalId = approvalId;
        this.status = status != null ? status : ApprovalStatus.PENDING;
        this.requestedAt = requestedAt;
        this.respondedAt = respondedAt;
        this.visitorLog = visitorLog;
        this.resident = resident;
        this.requestedByUser = requestedByUser;
    }

    public static VisitorApprovalBuilder builder() {
        return new VisitorApprovalBuilder();
    }

    public Long getApprovalId() {
        return approvalId;
    }

    public void setApprovalId(Long approvalId) {
        this.approvalId = approvalId;
    }

    public ApprovalStatus getStatus() {
        return status;
    }

    public void setStatus(ApprovalStatus status) {
        this.status = status;
    }

    public LocalDateTime getRequestedAt() {
        return requestedAt;
    }

    public void setRequestedAt(LocalDateTime requestedAt) {
        this.requestedAt = requestedAt;
    }

    public LocalDateTime getRespondedAt() {
        return respondedAt;
    }

    public void setRespondedAt(LocalDateTime respondedAt) {
        this.respondedAt = respondedAt;
    }

    public VisitorLog getVisitorLog() {
        return visitorLog;
    }

    public void setVisitorLog(VisitorLog visitorLog) {
        this.visitorLog = visitorLog;
    }

    public Resident getResident() {
        return resident;
    }

    public void setResident(Resident resident) {
        this.resident = resident;
    }

    public User getRequestedByUser() {
        return requestedByUser;
    }

    public void setRequestedByUser(User requestedByUser) {
        this.requestedByUser = requestedByUser;
    }

    public static class VisitorApprovalBuilder {
        private Long approvalId;
        private ApprovalStatus status;
        private LocalDateTime requestedAt;
        private LocalDateTime respondedAt;
        private VisitorLog visitorLog;
        private Resident resident;
        private User requestedByUser;

        VisitorApprovalBuilder() {
        }

        public VisitorApprovalBuilder approvalId(Long approvalId) {
            this.approvalId = approvalId;
            return this;
        }

        public VisitorApprovalBuilder status(ApprovalStatus status) {
            this.status = status;
            return this;
        }

        public VisitorApprovalBuilder requestedAt(LocalDateTime requestedAt) {
            this.requestedAt = requestedAt;
            return this;
        }

        public VisitorApprovalBuilder respondedAt(LocalDateTime respondedAt) {
            this.respondedAt = respondedAt;
            return this;
        }

        public VisitorApprovalBuilder visitorLog(VisitorLog visitorLog) {
            this.visitorLog = visitorLog;
            return this;
        }

        public VisitorApprovalBuilder resident(Resident resident) {
            this.resident = resident;
            return this;
        }

        public VisitorApprovalBuilder requestedByUser(User requestedByUser) {
            this.requestedByUser = requestedByUser;
            return this;
        }

        public VisitorApproval build() {
            return new VisitorApproval(approvalId, status, requestedAt, respondedAt, visitorLog, resident,
                    requestedByUser);
        }

        public String toString() {
            return "VisitorApproval.VisitorApprovalBuilder(approvalId=" + this.approvalId + ", status=" + this.status
                    + ", requestedAt=" + this.requestedAt + ", respondedAt=" + this.respondedAt + ", visitorLog="
                    + this.visitorLog + ", resident=" + this.resident + ", requestedByUser=" + this.requestedByUser
                    + ")";
        }
    }
}
