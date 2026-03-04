package com.ecanopy.repository;

import com.ecanopy.entity.DomesticHelp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DomesticHelpRepository extends JpaRepository<DomesticHelp, Long> {
    List<DomesticHelp> findByFlats_FlatId(Long flatId);

    List<DomesticHelp> findBySocietySocietyId(Long societyId);

    java.util.Optional<DomesticHelp> findByPassCode(String passCode);

    boolean existsByPassCode(String passCode);
}
