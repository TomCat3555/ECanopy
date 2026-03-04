package com.ecanopy.entity;

import com.ecanopy.entity.enums.RwaRole;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "rwa_members")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RwaMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rwaMemberId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RwaRole role;

    @Column(nullable = false)
    @Builder.Default
    private LocalDate appointedAt = LocalDate.now();

    private LocalDate termEndsAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "society_id", nullable = false)
    private Society society;
}
