package com.ecanopy.entity;

import com.ecanopy.entity.enums.ApprovalStatus;
import com.ecanopy.entity.enums.VisitorCategory;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "visitor_logs")
public class VisitorLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long logId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private VisitorCategory category = VisitorCategory.GUEST;

    @Column(length = 200)
    private String purpose;

    @Column(length = 20)
    private String vehicleNumber;

    @Column(nullable = false)
    private LocalDateTime inTime;

    private LocalDateTime outTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ApprovalStatus status = ApprovalStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "visitor_id", nullable = false)
    private Visitor visitor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flat_id", nullable = false)
    private Flat flat;

    // Gate and Guard tracking
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "checked_in_by_user_id")
    private User checkedInBy; // Security guard who checked in

    @Column(length = 50)
    private String gateEntry; // "Main Gate", "Side Gate", etc.

    // Expected checkout time for overstay tracking
    private LocalDateTime expectedOutTime;

    @OneToMany(mappedBy = "visitorLog", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<VisitorApproval> visitorApprovals = new HashSet<>();

    public VisitorLog() {
    }

    public VisitorLog(Long logId, VisitorCategory category, String purpose, String vehicleNumber, LocalDateTime inTime,
            LocalDateTime outTime, ApprovalStatus status, Visitor visitor, Flat flat, User checkedInBy,
            String gateEntry, LocalDateTime expectedOutTime, Set<VisitorApproval> visitorApprovals) {
        this.logId = logId;
        this.category = category != null ? category : VisitorCategory.GUEST;
        this.purpose = purpose;
        this.vehicleNumber = vehicleNumber;
        this.inTime = inTime;
        this.outTime = outTime;
        this.status = status != null ? status : ApprovalStatus.PENDING;
        this.visitor = visitor;
        this.flat = flat;
        this.checkedInBy = checkedInBy;
        this.gateEntry = gateEntry;
        this.expectedOutTime = expectedOutTime;
        this.visitorApprovals = visitorApprovals != null ? visitorApprovals : new HashSet<>();
    }

    public static VisitorLogBuilder builder() {
        return new VisitorLogBuilder();
    }

    public Long getLogId() {
        return logId;
    }

    public void setLogId(Long logId) {
        this.logId = logId;
    }

    public VisitorCategory getCategory() {
        return category;
    }

    public void setCategory(VisitorCategory category) {
        this.category = category;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public LocalDateTime getInTime() {
        return inTime;
    }

    public void setInTime(LocalDateTime inTime) {
        this.inTime = inTime;
    }

    public LocalDateTime getOutTime() {
        return outTime;
    }

    public void setOutTime(LocalDateTime outTime) {
        this.outTime = outTime;
    }

    public ApprovalStatus getStatus() {
        return status;
    }

    public void setStatus(ApprovalStatus status) {
        this.status = status;
    }

    public Visitor getVisitor() {
        return visitor;
    }

    public void setVisitor(Visitor visitor) {
        this.visitor = visitor;
    }

    public Flat getFlat() {
        return flat;
    }

    public void setFlat(Flat flat) {
        this.flat = flat;
    }

    public User getCheckedInBy() {
        return checkedInBy;
    }

    public void setCheckedInBy(User checkedInBy) {
        this.checkedInBy = checkedInBy;
    }

    public String getGateEntry() {
        return gateEntry;
    }

    public void setGateEntry(String gateEntry) {
        this.gateEntry = gateEntry;
    }

    public LocalDateTime getExpectedOutTime() {
        return expectedOutTime;
    }

    public void setExpectedOutTime(LocalDateTime expectedOutTime) {
        this.expectedOutTime = expectedOutTime;
    }

    public Set<VisitorApproval> getVisitorApprovals() {
        return visitorApprovals;
    }

    public void setVisitorApprovals(Set<VisitorApproval> visitorApprovals) {
        this.visitorApprovals = visitorApprovals;
    }

    public static class VisitorLogBuilder {
        private Long logId;
        private VisitorCategory category;
        private String purpose;
        private String vehicleNumber;
        private LocalDateTime inTime;
        private LocalDateTime outTime;
        private ApprovalStatus status;
        private Visitor visitor;
        private Flat flat;
        private User checkedInBy;
        private String gateEntry;
        private LocalDateTime expectedOutTime;
        private Set<VisitorApproval> visitorApprovals;

        VisitorLogBuilder() {
        }

        public VisitorLogBuilder logId(Long logId) {
            this.logId = logId;
            return this;
        }

        public VisitorLogBuilder category(VisitorCategory category) {
            this.category = category;
            return this;
        }

        public VisitorLogBuilder purpose(String purpose) {
            this.purpose = purpose;
            return this;
        }

        public VisitorLogBuilder vehicleNumber(String vehicleNumber) {
            this.vehicleNumber = vehicleNumber;
            return this;
        }

        public VisitorLogBuilder inTime(LocalDateTime inTime) {
            this.inTime = inTime;
            return this;
        }

        public VisitorLogBuilder outTime(LocalDateTime outTime) {
            this.outTime = outTime;
            return this;
        }

        public VisitorLogBuilder status(ApprovalStatus status) {
            this.status = status;
            return this;
        }

        public VisitorLogBuilder visitor(Visitor visitor) {
            this.visitor = visitor;
            return this;
        }

        public VisitorLogBuilder flat(Flat flat) {
            this.flat = flat;
            return this;
        }

        public VisitorLogBuilder checkedInBy(User checkedInBy) {
            this.checkedInBy = checkedInBy;
            return this;
        }

        public VisitorLogBuilder gateEntry(String gateEntry) {
            this.gateEntry = gateEntry;
            return this;
        }

        public VisitorLogBuilder expectedOutTime(LocalDateTime expectedOutTime) {
            this.expectedOutTime = expectedOutTime;
            return this;
        }

        public VisitorLogBuilder visitorApprovals(Set<VisitorApproval> visitorApprovals) {
            this.visitorApprovals = visitorApprovals;
            return this;
        }

        public VisitorLog build() {
            return new VisitorLog(logId, category, purpose, vehicleNumber, inTime, outTime, status, visitor, flat,
                    checkedInBy, gateEntry, expectedOutTime, visitorApprovals);
        }

        public String toString() {
            return "VisitorLog.VisitorLogBuilder(logId=" + this.logId + ", category=" + this.category + ", purpose="
                    + this.purpose + ", vehicleNumber=" + this.vehicleNumber + ", inTime=" + this.inTime + ", outTime="
                    + this.outTime + ", status=" + this.status + ", visitor=" + this.visitor + ", flat=" + this.flat
                    + ", checkedInBy=" + this.checkedInBy + ", gateEntry=" + this.gateEntry + ", expectedOutTime="
                    + this.expectedOutTime + ", visitorApprovals=" + this.visitorApprovals + ")";
        }
    }
}
