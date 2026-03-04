package com.ecanopy.service;

import com.ecanopy.entity.Poll;
import com.ecanopy.entity.PollVote;
import com.ecanopy.entity.User;
import com.ecanopy.exception.NotFoundException;
import com.ecanopy.repository.PollRepository;
import com.ecanopy.repository.PollVoteRepository;
import com.ecanopy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PollService {

    private final PollRepository pollRepository;
    private final PollVoteRepository pollVoteRepository;
    private final UserRepository userRepository;

    public List<Poll> getActivePolls(Long societyId) {
        return pollRepository.findBySociety_SocietyId(societyId);
    }

    public Poll createPoll(Poll poll) {
        poll.setCreatedAt(LocalDateTime.now());
        poll.setIsActive(true);
        return pollRepository.save(poll);
    }

    @Transactional
    public PollVote vote(Long pollId, Long userId, String option) {
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new NotFoundException("Poll not found"));

        if (LocalDateTime.now().isAfter(poll.getExpiryDate())) {
            throw new RuntimeException("Poll expired");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (pollVoteRepository.findByPoll_PollIdAndUser_Id(pollId, userId).isPresent()) {
            throw new RuntimeException("Already voted");
        }

        PollVote vote = PollVote.builder()
                .poll(poll)
                .user(user)
                .selectedOption(option)
                .votedAt(LocalDateTime.now())
                .build();

        return pollVoteRepository.save(vote);
    }

    public void deletePoll(Long pollId) {
        if (!pollRepository.existsById(pollId)) {
            throw new NotFoundException("Poll not found");
        }
        pollRepository.deleteById(pollId);
    }
}
