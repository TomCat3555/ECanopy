package com.ecanopy.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

/**
 * Role Entity
 * Represents user roles for authorization
 * Roles: ROLE_ADMIN, ROLE_RESIDENT, ROLE_SECURITY_GUARD,
 * ROLE_RWA_PRESIDENT, ROLE_RWA_SECRETARY, ROLE_RWA_TREASURER, ROLE_STAFF
 */
@Entity
@Table(name = "roles", uniqueConstraints = {
        @UniqueConstraint(columnNames = "name")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Role name is required")
    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @ManyToMany(mappedBy = "roles")
    @Builder.Default
    private Set<User> users = new HashSet<>();

    public Role(String name) {
        this.name = name;
    }
}
