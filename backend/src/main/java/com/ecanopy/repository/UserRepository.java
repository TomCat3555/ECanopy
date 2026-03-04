package com.ecanopy.repository;

import com.ecanopy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    Optional<User> findByEmailAndEnabledTrue(String email);

    java.util.List<User> findBySocietyId(Long societyId);

    @org.springframework.data.jpa.repository.Query("SELECT u FROM User u LEFT JOIN u.resident r LEFT JOIN r.flat f LEFT JOIN f.building b LEFT JOIN b.society s WHERE u.societyId = :societyId OR s.societyId = :societyId")
    java.util.List<User> findAllBySocietyIdCustom(
            @org.springframework.data.repository.query.Param("societyId") Long societyId);
}
