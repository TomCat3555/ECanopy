package com.ecanopy.repository;

import com.ecanopy.entity.Poll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PollRepository extends JpaRepository<Poll, Long> {
    List<Poll> findBySociety_SocietyId(Long societyId);
}
