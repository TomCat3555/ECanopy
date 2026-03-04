package com.ecanopy.repository;

import com.ecanopy.entity.Society;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SocietyRepository extends JpaRepository<Society, Long> {
    Optional<Society> findBySocietyName(String societyName);

    List<Society> findByIsActiveTrue();
}
