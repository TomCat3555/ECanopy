package com.ecanopy.controller;

import com.ecanopy.entity.Poll;
import com.ecanopy.entity.PollVote;
import com.ecanopy.service.PollService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/polls")
@RequiredArgsConstructor
@Tag(name = "Polls", description = "Community Voting Endpoints")
public class PollController {

    private final PollService pollService;

    @GetMapping("/society/{societyId}")
    @PreAuthorize("hasRole('RESIDENT') or hasRole('ADMIN')")
    @Operation(summary = "Get active polls", description = "Get list of active polls for a society")
    public ResponseEntity<List<Poll>> getActivePolls(@PathVariable Long societyId) {
        return ResponseEntity.ok(pollService.getActivePolls(societyId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create poll", description = "Admin creates a new poll")
    public ResponseEntity<Poll> createPoll(@RequestBody Poll poll) {
        return ResponseEntity.ok(pollService.createPoll(poll));
    }

    @PostMapping("/{pollId}/vote")
    @PreAuthorize("hasRole('RESIDENT')")
    @Operation(summary = "Vote on poll", description = "Resident casts a vote")
    public ResponseEntity<PollVote> vote(
            @PathVariable Long pollId,
            @RequestParam Long userId,
            @RequestBody Map<String, String> payload) {
        String option = payload.get("option");
        return ResponseEntity.ok(pollService.vote(pollId, userId, option));
    }

    @DeleteMapping("/{pollId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete Poll", description = "Remove a poll")
    public ResponseEntity<Void> deletePoll(@PathVariable Long pollId) {
        pollService.deletePoll(pollId);
        return ResponseEntity.noContent().build();
    }
}
