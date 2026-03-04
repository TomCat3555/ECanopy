package com.ecanopy.controller;

import com.ecanopy.dto.request.ApprovalRequest;
import com.ecanopy.dto.request.JoinRequestDto;
import com.ecanopy.dto.response.JoinRequestResponse;
import com.ecanopy.service.JoinRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/join-requests")
@RequiredArgsConstructor
@Tag(name = "Join Requests", description = "Workflows for joining a society")
public class JoinRequestController {

    private final JoinRequestService joinRequestService;

    @PostMapping
    @Operation(summary = "Submit Join Request", description = "User requests to join a flat")
    public ResponseEntity<JoinRequestResponse> submitRequest(@Valid @RequestBody JoinRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(joinRequestService.submitJoinRequest(request));
    }

    @GetMapping("/society/{societyId}/pending")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RWA_PRESIDENT') or hasRole('RWA_SECRETARY')")
    @Operation(summary = "Get Pending Requests", description = "List pending join requests for a society")
    public ResponseEntity<List<JoinRequestResponse>> getPendingRequests(@PathVariable Long societyId) {
        return ResponseEntity.ok(joinRequestService.getPendingRequests(societyId));
    }

    @GetMapping("/my-requests")
    @Operation(summary = "Get My Requests", description = "List join requests submitted by current user")
    public ResponseEntity<List<JoinRequestResponse>> getMyRequests() {
        return ResponseEntity.ok(joinRequestService.getMyRequests());
    }

    @PutMapping("/{requestId}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RWA_PRESIDENT') or hasRole('RWA_SECRETARY')")
    @Operation(summary = "Update Request Status", description = "Approve or Reject a join request")
    public ResponseEntity<JoinRequestResponse> updateStatus(@PathVariable Long requestId,
            @Valid @RequestBody ApprovalRequest request) {
        return ResponseEntity.ok(joinRequestService.updateStatus(requestId, request.getStatus()));
    }
}
