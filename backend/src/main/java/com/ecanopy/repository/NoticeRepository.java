package com.ecanopy.repository;

import com.ecanopy.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {
    List<Notice> findBySocietySocietyIdOrderByCreatedAtDesc(Long societyId);

    List<Notice> findBySocietySocietyIdAndIsActiveTrueOrderByCreatedAtDesc(Long societyId);

    long countByIsActiveTrue();

    long countBySocietySocietyIdAndIsActiveTrue(Long societyId);
}
