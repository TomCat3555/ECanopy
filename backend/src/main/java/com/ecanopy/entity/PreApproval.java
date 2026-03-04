package com.ecanopy.entity;

import com.ecanopy.entity.enums.VisitorCategory;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "pre_approvals")
@EntityListeners(AuditingEntityListener.class)
public class PreApproval {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String visitorName;

    @Column(nullable = false)
    private String visitorPhone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VisitorCategory category;

    @Column(nullable = false)
    private LocalDateTime validFrom;

    @Column(nullable = false)
    private LocalDateTime validUntil;

    @Column(unique = true, length = 6)
    private String code; // 6-digit access code

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private boolean isUsed = false;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resident_id", nullable = false)
    private Resident resident;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flat_id", nullable = false)
    private Flat flat;

    public PreApproval() {
    }

    public PreApproval(Long id, String visitorName, String visitorPhone, VisitorCategory category, LocalDateTime validFrom, LocalDateTime validUntil, String code, LocalDateTime createdAt, boolean isUsed, Resident resident, Flat flat) {
        this.id = id;
        this.visitorName = visitorName;
        this.visitorPhone = visitorPhone;
        this.category = category;
        this.validFrom = validFrom;
        this.validUntil = validUntil;
        this.code = code;
        this.createdAt = createdAt;
        this.isUsed = isUsed;
        this.resident = resident;
        this.flat = flat;
    }

    public static PreApprovalBuilder builder() {
        return new PreApprovalBuilder();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVisitorName() {
        return visitorName;
    }

    public void setVisitorName(String visitorName) {
        this.visitorName = visitorName;
    }

    public String getVisitorPhone() {
        return visitorPhone;
    }

    public void setVisitorPhone(String visitorPhone) {
        this.visitorPhone = visitorPhone;
    }

    public VisitorCategory getCategory() {
        return category;
    }

    public void setCategory(VisitorCategory category) {
        this.category = category;
    }

    public LocalDateTime getValidFrom() {
        return validFrom;
    }

    public void setValidFrom(LocalDateTime validFrom) {
        this.validFrom = validFrom;
    }

    public LocalDateTime getValidUntil() {
        return validUntil;
    }

    public void setValidUntil(LocalDateTime validUntil) {
        this.validUntil = validUntil;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isUsed() {
        return isUsed;
    }

    public void setUsed(boolean used) {
        isUsed = used;
    }

    public Resident getResident() {
        return resident;
    }

    public void setResident(Resident resident) {
        this.resident = resident;
    }

    public Flat getFlat() {
        return flat;
    }

    public void setFlat(Flat flat) {
        this.flat = flat;
    }

    public static class PreApprovalBuilder {
        private Long id;
        private String visitorName;
        private String visitorPhone;
        private VisitorCategory category;
        private LocalDateTime validFrom;
        private LocalDateTime validUntil;
        private String code;
        private LocalDateTime createdAt;
        private boolean isUsed;
        private Resident resident;
        private Flat flat;

        PreApprovalBuilder() {
        }

        public PreApprovalBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public PreApprovalBuilder visitorName(String visitorName) {
            this.visitorName = visitorName;
            return this;
        }

        public PreApprovalBuilder visitorPhone(String visitorPhone) {
            this.visitorPhone = visitorPhone;
            return this;
        }

        public PreApprovalBuilder category(VisitorCategory category) {
            this.category = category;
            return this;
        }

        public PreApprovalBuilder validFrom(LocalDateTime validFrom) {
            this.validFrom = validFrom;
            return this;
        }

        public PreApprovalBuilder validUntil(LocalDateTime validUntil) {
            this.validUntil = validUntil;
            return this;
        }

        public PreApprovalBuilder code(String code) {
            this.code = code;
            return this;
        }

        public PreApprovalBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public PreApprovalBuilder isUsed(boolean isUsed) {
            this.isUsed = isUsed;
            return this;
        }

        public PreApprovalBuilder resident(Resident resident) {
            this.resident = resident;
            return this;
        }

        public PreApprovalBuilder flat(Flat flat) {
            this.flat = flat;
            return this;
        }

        public PreApproval build() {
            return new PreApproval(id, visitorName, visitorPhone, category, validFrom, validUntil, code, createdAt, isUsed, resident, flat);
        }

        public String toString() {
            return "PreApproval.PreApprovalBuilder(id=" + this.id + ", visitorName=" + this.visitorName + ", visitorPhone=" + this.visitorPhone + ", category=" + this.category + ", validFrom=" + this.validFrom + ", validUntil=" + this.validUntil + ", code=" + this.code + ", createdAt=" + this.createdAt + ", isUsed=" + this.isUsed + ", resident=" + this.resident + ", flat=" + this.flat + ")";
        }
    }
}
