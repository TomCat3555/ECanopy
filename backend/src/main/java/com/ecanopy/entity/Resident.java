package com.ecanopy.entity;

import com.ecanopy.entity.enums.ResidentType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Resident Entity
 * Represents residents living in flats
 */
@Entity
@Table(name = "residents", uniqueConstraints = {
        @UniqueConstraint(columnNames = "user_id")
})
@EntityListeners(AuditingEntityListener.class)
public class Resident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long residentId;

    @NotBlank(message = "Full name is required")
    @Column(nullable = false, length = 100)
    private String fullName;

    // @NotBlank(message = "Phone is required") // Made optional to match User
    // entity
    @Pattern(regexp = "^[0-9+\\-()\\s]{10,20}$", message = "Phone must be 10-20 digits")
    @Column(name = "contact_no", nullable = true, length = 20)
    private String phone;

    // @Column(name = "phone", nullable = false, length = 10)
    // private String oldPhone = "0000000000"; // Dummy value to satisfy DB
    // constraint of old column

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Column(nullable = false, length = 100)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ResidentType residentType = ResidentType.OWNER;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column(nullable = false)
    private LocalDate moveInDate = LocalDate.now();

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Relationships
    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flat_id", nullable = false)
    private Flat flat;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "resident", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Complaint> complaints = new HashSet<>();

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "resident", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<AmenityBooking> amenityBookings = new HashSet<>();

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "resident")
    private Set<VisitorApproval> visitorApprovals = new HashSet<>();

    public Resident() {
    }

    public Resident(Long residentId, String fullName, String phone, String email, ResidentType residentType,
            Boolean isActive, LocalDate moveInDate, LocalDateTime createdAt, Flat flat, User user,
            Set<Complaint> complaints, Set<AmenityBooking> amenityBookings, Set<VisitorApproval> visitorApprovals) {
        this.residentId = residentId;
        this.fullName = fullName;
        this.phone = phone;
        this.email = email;
        this.residentType = residentType != null ? residentType : ResidentType.OWNER;
        this.isActive = isActive != null ? isActive : true;
        this.moveInDate = moveInDate != null ? moveInDate : LocalDate.now();
        this.createdAt = createdAt;
        this.flat = flat;
        this.user = user;
        this.complaints = complaints != null ? complaints : new HashSet<>();
        this.amenityBookings = amenityBookings != null ? amenityBookings : new HashSet<>();
        this.visitorApprovals = visitorApprovals != null ? visitorApprovals : new HashSet<>();
    }

    public static ResidentBuilder builder() {
        return new ResidentBuilder();
    }

    public Long getResidentId() {
        return residentId;
    }

    public void setResidentId(Long residentId) {
        this.residentId = residentId;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public ResidentType getResidentType() {
        return residentType;
    }

    public void setResidentType(ResidentType residentType) {
        this.residentType = residentType;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public LocalDate getMoveInDate() {
        return moveInDate;
    }

    public void setMoveInDate(LocalDate moveInDate) {
        this.moveInDate = moveInDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Flat getFlat() {
        return flat;
    }

    public void setFlat(Flat flat) {
        this.flat = flat;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Set<Complaint> getComplaints() {
        return complaints;
    }

    public void setComplaints(Set<Complaint> complaints) {
        this.complaints = complaints;
    }

    public Set<AmenityBooking> getAmenityBookings() {
        return amenityBookings;
    }

    public void setAmenityBookings(Set<AmenityBooking> amenityBookings) {
        this.amenityBookings = amenityBookings;
    }

    public Set<VisitorApproval> getVisitorApprovals() {
        return visitorApprovals;
    }

    public void setVisitorApprovals(Set<VisitorApproval> visitorApprovals) {
        this.visitorApprovals = visitorApprovals;
    }

    public static class ResidentBuilder {
        private Long residentId;
        private String fullName;
        private String phone;
        private String email;
        private ResidentType residentType;
        private Boolean isActive;
        private LocalDate moveInDate;
        private LocalDateTime createdAt;
        private Flat flat;
        private User user;
        private Set<Complaint> complaints;
        private Set<AmenityBooking> amenityBookings;
        private Set<VisitorApproval> visitorApprovals;

        ResidentBuilder() {
        }

        public ResidentBuilder residentId(Long residentId) {
            this.residentId = residentId;
            return this;
        }

        public ResidentBuilder fullName(String fullName) {
            this.fullName = fullName;
            return this;
        }

        public ResidentBuilder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public ResidentBuilder email(String email) {
            this.email = email;
            return this;
        }

        public ResidentBuilder residentType(ResidentType residentType) {
            this.residentType = residentType;
            return this;
        }

        public ResidentBuilder isActive(Boolean isActive) {
            this.isActive = isActive;
            return this;
        }

        public ResidentBuilder moveInDate(LocalDate moveInDate) {
            this.moveInDate = moveInDate;
            return this;
        }

        public ResidentBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public ResidentBuilder flat(Flat flat) {
            this.flat = flat;
            return this;
        }

        public ResidentBuilder user(User user) {
            this.user = user;
            return this;
        }

        public ResidentBuilder complaints(Set<Complaint> complaints) {
            this.complaints = complaints;
            return this;
        }

        public ResidentBuilder amenityBookings(Set<AmenityBooking> amenityBookings) {
            this.amenityBookings = amenityBookings;
            return this;
        }

        public ResidentBuilder visitorApprovals(Set<VisitorApproval> visitorApprovals) {
            this.visitorApprovals = visitorApprovals;
            return this;
        }

        public Resident build() {
            return new Resident(residentId, fullName, phone, email, residentType, isActive, moveInDate, createdAt, flat,
                    user, complaints, amenityBookings, visitorApprovals);
        }

        public String toString() {
            return "Resident.ResidentBuilder(residentId=" + this.residentId + ", fullName=" + this.fullName + ", phone="
                    + this.phone + ", email=" + this.email + ", residentType=" + this.residentType + ", isActive="
                    + this.isActive + ", moveInDate=" + this.moveInDate + ", createdAt=" + this.createdAt + ", flat="
                    + this.flat + ", user=" + this.user + ", complaints=" + this.complaints + ", amenityBookings="
                    + this.amenityBookings + ", visitorApprovals=" + this.visitorApprovals + ")";
        }
    }
}
