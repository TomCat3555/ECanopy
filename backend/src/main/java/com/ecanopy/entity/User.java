package com.ecanopy.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * User Entity
 * Represents application users with Spring Security integration
 * Replaces ASP.NET ApplicationUser
 */
@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email")
})
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Full name is required")
    @Pattern(regexp = "^[a-zA-Z\\s().'-]{3,50}$", message = "Full name must be 3-50 characters")
    @Column(nullable = false, length = 50)
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Pattern(regexp = "^[0-9+\\-()\\s]{10,20}$", message = "Phone number must be 10-20 digits wide and can contain +, -, (, )")
    @Column(length = 20)
    private String phoneNumber;

    @NotBlank(message = "Password is required")
    @Column(nullable = false)
    private String password;

    @Column(name = "flat_id")
    private Long flatId;

    @Column(name = "society_id")
    private Long societyId;

    @Column(nullable = false)
    private Boolean enabled = true;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Relationships
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Resident resident;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ResidentJoinRequest> joinRequests = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<RoleRequest> roleRequests = new HashSet<>();

    @OneToMany(mappedBy = "requestedByUser")
    private Set<VisitorApproval> visitorApprovals = new HashSet<>();

    @OneToMany(mappedBy = "approvedByUser")
    private Set<AmenityBooking> amenityBookings = new HashSet<>();

    @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Item> items = new HashSet<>();

    public static UserBuilder builder() {
        return new UserBuilder();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toList());
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Long getFlatId() {
        return flatId;
    }

    public void setFlatId(Long flatId) {
        this.flatId = flatId;
    }

    public Long getSocietyId() {
        return societyId;
    }

    public void setSocietyId(Long societyId) {
        this.societyId = societyId;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public Resident getResident() {
        return resident;
    }

    public void setResident(Resident resident) {
        this.resident = resident;
    }

    public Set<ResidentJoinRequest> getJoinRequests() {
        return joinRequests;
    }

    public void setJoinRequests(Set<ResidentJoinRequest> joinRequests) {
        this.joinRequests = joinRequests;
    }

    public Set<RoleRequest> getRoleRequests() {
        return roleRequests;
    }

    public void setRoleRequests(Set<RoleRequest> roleRequests) {
        this.roleRequests = roleRequests;
    }

    public Set<VisitorApproval> getVisitorApprovals() {
        return visitorApprovals;
    }

    public void setVisitorApprovals(Set<VisitorApproval> visitorApprovals) {
        this.visitorApprovals = visitorApprovals;
    }

    public Set<AmenityBooking> getAmenityBookings() {
        return amenityBookings;
    }

    public void setAmenityBookings(Set<AmenityBooking> amenityBookings) {
        this.amenityBookings = amenityBookings;
    }

    public Set<Item> getItems() {
        return items;
    }

    public void setItems(Set<Item> items) {
        this.items = items;
    }

    public static class UserBuilder {
        private Long id;
        private String fullName;
        private String email;
        private String phoneNumber;
        private String password;
        private Long flatId;
        private Long societyId;
        private Boolean enabled = true;
        private LocalDateTime createdAt;
        private Set<Role> roles = new HashSet<>();
        private Resident resident;
        private Set<ResidentJoinRequest> joinRequests = new HashSet<>();
        private Set<RoleRequest> roleRequests = new HashSet<>();
        private Set<VisitorApproval> visitorApprovals = new HashSet<>();
        private Set<AmenityBooking> amenityBookings = new HashSet<>();
        private Set<Item> items = new HashSet<>();

        UserBuilder() {
        }

        public UserBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public UserBuilder fullName(String fullName) {
            this.fullName = fullName;
            return this;
        }

        public UserBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserBuilder phoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
            return this;
        }

        public UserBuilder password(String password) {
            this.password = password;
            return this;
        }

        public UserBuilder flatId(Long flatId) {
            this.flatId = flatId;
            return this;
        }

        public UserBuilder societyId(Long societyId) {
            this.societyId = societyId;
            return this;
        }

        public UserBuilder enabled(Boolean enabled) {
            this.enabled = enabled;
            return this;
        }

        public UserBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public UserBuilder roles(Set<Role> roles) {
            this.roles = roles;
            return this;
        }

        public UserBuilder resident(Resident resident) {
            this.resident = resident;
            return this;
        }

        public UserBuilder joinRequests(Set<ResidentJoinRequest> joinRequests) {
            this.joinRequests = joinRequests;
            return this;
        }

        public UserBuilder roleRequests(Set<RoleRequest> roleRequests) {
            this.roleRequests = roleRequests;
            return this;
        }

        public UserBuilder visitorApprovals(Set<VisitorApproval> visitorApprovals) {
            this.visitorApprovals = visitorApprovals;
            return this;
        }

        public UserBuilder amenityBookings(Set<AmenityBooking> amenityBookings) {
            this.amenityBookings = amenityBookings;
            return this;
        }

        public UserBuilder items(Set<Item> items) {
            this.items = items;
            return this;
        }

        public User build() {
            return new User(id, fullName, email, phoneNumber, password, flatId, societyId, enabled, createdAt, roles,
                    resident, joinRequests, roleRequests, visitorApprovals, amenityBookings, items);
        }

        public String toString() {
            return "User.UserBuilder(id=" + this.id + ", fullName=" + this.fullName + ", email=" + this.email
                    + ", phoneNumber=" + this.phoneNumber + ", password=" + this.password + ", flatId=" + this.flatId
                    + ", societyId=" + this.societyId + ", enabled=" + this.enabled + ", createdAt=" + this.createdAt
                    + ", roles=" + this.roles + ", resident=" + this.resident + ", joinRequests=" + this.joinRequests
                    + ", roleRequests=" + this.roleRequests + ", visitorApprovals=" + this.visitorApprovals
                    + ", amenityBookings=" + this.amenityBookings + ", items=" + this.items + ")";
        }
    }
}
