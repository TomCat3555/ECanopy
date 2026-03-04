package com.ecanopy.repository;

import com.ecanopy.entity.Flat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FlatRepository extends JpaRepository<Flat, Long> {
    List<Flat> findByBuildingBuildingId(Long buildingId);

    Optional<Flat> findByBuildingBuildingIdAndFlatNumber(Long buildingId, String flatNumber);

    List<Flat> findByBuildingSocietySocietyId(Long societyId);

    long countByBuildingSocietySocietyId(Long societyId);
}
