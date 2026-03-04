package com.ecanopy.repository;

import com.ecanopy.entity.PollVote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PollVoteRepository extends JpaRepository<PollVote, Long> {
    Optional<PollVote> findByPoll_PollIdAndUser_Id(Long pollId, Long userId);
}
