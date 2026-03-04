package com.ecanopy.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "visitors")
@EntityListeners(AuditingEntityListener.class)
public class Visitor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long visitorId;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String fullName;

    @NotBlank
    @Column(nullable = false, length = 10)
    private String phone;

    @Column(length = 50)
    private String idProofType;

    @Column(length = 50)
    private String idProofNumber;

    @Column(length = 255)
    private String photoUrl;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "visitor", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<VisitorLog> visitorLogs = new HashSet<>();

    public Visitor() {
    }

    public Visitor(Long visitorId, String fullName, String phone, String idProofType, String idProofNumber, String photoUrl, LocalDateTime createdAt, Set<VisitorLog> visitorLogs) {
        this.visitorId = visitorId;
        this.fullName = fullName;
        this.phone = phone;
        this.idProofType = idProofType;
        this.idProofNumber = idProofNumber;
        this.photoUrl = photoUrl;
        this.createdAt = createdAt;
        this.visitorLogs = visitorLogs != null ? visitorLogs : new HashSet<>();
    }

    public static VisitorBuilder builder() {
        return new VisitorBuilder();
    }

    public Long getVisitorId() {
        return visitorId;
    }

    public void setVisitorId(Long visitorId) {
        this.visitorId = visitorId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getIdProofType() {
        return idProofType;
    }

    public void setIdProofType(String idProofType) {
        this.idProofType = idProofType;
    }

    public String getIdProofNumber() {
        return idProofNumber;
    }

    public void setIdProofNumber(String idProofNumber) {
        this.idProofNumber = idProofNumber;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Set<VisitorLog> getVisitorLogs() {
        return visitorLogs;
    }

    public void setVisitorLogs(Set<VisitorLog> visitorLogs) {
        this.visitorLogs = visitorLogs;
    }

    public static class VisitorBuilder {
        private Long visitorId;
        private String fullName;
        private String phone;
        private String idProofType;
        private String idProofNumber;
        private String photoUrl;
        private LocalDateTime createdAt;
        private Set<VisitorLog> visitorLogs;

        VisitorBuilder() {
        }

        public VisitorBuilder visitorId(Long visitorId) {
            this.visitorId = visitorId;
            return this;
        }

        public VisitorBuilder fullName(String fullName) {
            this.fullName = fullName;
            return this;
        }

        public VisitorBuilder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public VisitorBuilder idProofType(String idProofType) {
            this.idProofType = idProofType;
            return this;
        }

        public VisitorBuilder idProofNumber(String idProofNumber) {
            this.idProofNumber = idProofNumber;
            return this;
        }

        public VisitorBuilder photoUrl(String photoUrl) {
            this.photoUrl = photoUrl;
            return this;
        }

        public VisitorBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public VisitorBuilder visitorLogs(Set<VisitorLog> visitorLogs) {
            this.visitorLogs = visitorLogs;
            return this;
        }

        public Visitor build() {
            return new Visitor(visitorId, fullName, phone, idProofType, idProofNumber, photoUrl, createdAt, visitorLogs);
        }

        public String toString() {
            return "Visitor.VisitorBuilder(visitorId=" + this.visitorId + ", fullName=" + this.fullName + ", phone=" + this.phone + ", idProofType=" + this.idProofType + ", idProofNumber=" + this.idProofNumber + ", photoUrl=" + this.photoUrl + ", createdAt=" + this.createdAt + ", visitorLogs=" + this.visitorLogs + ")";
        }
    }
}
