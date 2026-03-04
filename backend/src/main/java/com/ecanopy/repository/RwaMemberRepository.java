package com.ecanopy.repository;

import com.ecanopy.entity.RwaMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RwaMemberRepository extends JpaRepository<RwaMember, Long> {
    List<RwaMember> findBySocietySocietyId(Long societyId);
}
