package com.ecanopy.repository;

import com.ecanopy.entity.Resident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResidentRepository extends JpaRepository<Resident, Long> {
    List<Resident> findByFlatFlatId(Long flatId);

    List<Resident> findByFlat_FlatIdAndIsActiveTrue(Long flatId);

    Optional<Resident> findByUserId(Long userId);

    List<Resident> findByIsActiveTrue();

    List<Resident> findByFlat_Building_Society_SocietyId(Long societyId);

    long countByFlat_Building_Society_SocietyId(Long societyId);

    long countByIsActiveTrue();

    long countByFlat_FlatId(Long flatId);
}
