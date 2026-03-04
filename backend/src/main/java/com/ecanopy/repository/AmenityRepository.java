package com.ecanopy.repository;

import com.ecanopy.entity.Amenity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AmenityRepository extends JpaRepository<Amenity, Long> {
    List<Amenity> findBySocietySocietyId(Long societyId);

    List<Amenity> findBySocietySocietyIdAndIsActiveTrue(Long societyId);
}
