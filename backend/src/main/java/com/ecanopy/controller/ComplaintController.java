package com.ecanopy.controller;

import com.ecanopy.dto.request.ComplaintRequest;
import com.ecanopy.dto.response.ComplaintResponse;
import com.ecanopy.service.ComplaintService;
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
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
@Tag(name = "Complaint Management", description = "Endpoints for resident complaints")
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping
    @PreAuthorize("hasRole('RESIDENT')")
    @Operation(summary = "Create Complaint", description = "File a new complaint")
    public ResponseEntity<ComplaintResponse> createComplaint(@Valid @RequestBody ComplaintRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(complaintService.createComplaint(request));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('RESIDENT')")
    @Operation(summary = "My Complaints", description = "Get complaints filed by current user")
    public ResponseEntity<List<ComplaintResponse>> getMyComplaints() {
        return ResponseEntity.ok(complaintService.getMyComplaints());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('RWA_PRESIDENT')")
    @Operation(summary = "All Complaints", description = "Get all complaints (Admin/RWA only)")
    public ResponseEntity<List<ComplaintResponse>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @GetMapping("/society/{societyId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RWA_PRESIDENT') or hasRole('RWA_SECRETARY')")
    @Operation(summary = "Complaints by Society", description = "Get complaints for a specific society")
    public ResponseEntity<List<ComplaintResponse>> getComplaintsBySociety(@PathVariable Long societyId) {
        return ResponseEntity.ok(complaintService.getComplaintsBySociety(societyId));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RWA_PRESIDENT') or hasRole('RWA_SECRETARY') or hasRole('STAFF')")
    @Operation(summary = "Update Status", description = "Update complaint status")
    public ResponseEntity<ComplaintResponse> updateStatus(@PathVariable Long id,
            @RequestBody java.util.Map<String, String> payload) {
        String status = payload.get("status");
        return ResponseEntity.ok(complaintService.updateStatus(id, status));
    }

    @GetMapping("/{id}/comments")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RWA_PRESIDENT') or hasRole('RWA_SECRETARY') or hasRole('RESIDENT') or hasRole('STAFF')")
    @Operation(summary = "Get Comments", description = "Get all comments for a complaint")
    public ResponseEntity<List<com.ecanopy.dto.response.CommentResponse>> getComments(@PathVariable Long id) {
        return ResponseEntity.ok(complaintService.getComments(id));
    }

    @PostMapping("/{id}/comments")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RWA_PRESIDENT') or hasRole('RWA_SECRETARY') or hasRole('RESIDENT') or hasRole('STAFF')")
    @Operation(summary = "Add Comment", description = "Add a comment/reply to a complaint")
    public ResponseEntity<com.ecanopy.dto.response.CommentResponse> addComment(@PathVariable Long id,
            @Valid @RequestBody com.ecanopy.dto.request.CommentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(complaintService.addComment(id, request));
    }
}
