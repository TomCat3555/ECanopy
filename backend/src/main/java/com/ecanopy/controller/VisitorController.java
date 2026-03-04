package com.ecanopy.controller;

import com.ecanopy.dto.request.VisitorRequest;
import com.ecanopy.dto.response.VisitorResponse;
import com.ecanopy.entity.PreApproval;
import com.ecanopy.entity.enums.VisitorCategory;
import com.ecanopy.service.VisitorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/visitors")
@RequiredArgsConstructor
@Tag(name = "Visitor Management", description = "Endpoints for gatekeeping and visitor logs")
public class VisitorController {

    private final VisitorService visitorService;

    @PostMapping("/check-in")
    @PreAuthorize("hasRole('SECURITY_GUARD') or hasRole('ADMIN') or hasRole('RWA_SECRETARY') or hasRole('RWA_PRESIDENT')")
    @Operation(summary = "Check-In Visitor", description = "Log a new visitor entry")
    public ResponseEntity<VisitorResponse> checkInVisitor(@Valid @RequestBody VisitorRequest request) {
        System.out.println(
                "DEBUG: checkInVisitor called. FlatID: " + request.getFlatId() + ", Phone: " + request.getPhone());
        return ResponseEntity.status(HttpStatus.CREATED).body(visitorService.checkInVisitor(request));
    }

    @PostMapping("/check-out/{logId}")
    @PreAuthorize("hasRole('SECURITY_GUARD') or hasRole('ADMIN') or hasRole('RWA_SECRETARY') or hasRole('RWA_PRESIDENT')")
    @Operation(summary = "Check-Out Visitor", description = "Log visitor exit")
    public ResponseEntity<VisitorResponse> checkOutVisitor(@PathVariable Long logId) {
        return ResponseEntity.ok(visitorService.checkOutVisitor(logId));
    }

    @GetMapping("/active")
    @PreAuthorize("hasRole('SECURITY_GUARD') or hasRole('ADMIN') or hasRole('RWA_SECRETARY') or hasRole('RWA_PRESIDENT')")
    @Operation(summary = "Active Visitors", description = "List all visitors currently inside (multi-tenant)")
    public ResponseEntity<List<VisitorResponse>> getActiveVisitors(
            @RequestParam(required = false) Long societyId) {
        if (societyId != null) {
            return ResponseEntity.ok(visitorService.getActiveVisitorsBySociety(societyId));
        }
        return ResponseEntity.ok(visitorService.getActiveVisitors());
    }

    @GetMapping("/history")
    @PreAuthorize("hasRole('SECURITY_GUARD') or hasRole('ADMIN') or hasRole('RWA_SECRETARY') or hasRole('RWA_PRESIDENT')")
    @Operation(summary = "Visitor History", description = "List complete visitor history (multi-tenant)")
    public ResponseEntity<List<VisitorResponse>> getVisitorHistory(
            @RequestParam(required = false) Long societyId) {
        if (societyId != null) {
            return ResponseEntity.ok(visitorService.getAllVisitorLogsBySociety(societyId));
        }
        return ResponseEntity.ok(visitorService.getAllVisitorLogs());
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('SECURITY_GUARD') or hasRole('ADMIN') or hasRole('RWA_SECRETARY') or hasRole('RWA_PRESIDENT')")
    @Operation(summary = "Search Visitors", description = "Search visitors by name or phone")
    public ResponseEntity<List<VisitorResponse>> searchVisitors(
            @RequestParam Long societyId,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String phone) {
        if (name != null && !name.isEmpty()) {
            return ResponseEntity.ok(visitorService.searchVisitorsByName(societyId, name));
        } else if (phone != null && !phone.isEmpty()) {
            return ResponseEntity.ok(visitorService.searchVisitorsByPhone(societyId, phone));
        }
        return ResponseEntity.ok(visitorService.getAllVisitorLogsBySociety(societyId));
    }

    @GetMapping("/filter")
    @PreAuthorize("hasRole('SECURITY_GUARD') or hasRole('ADMIN') or hasRole('RWA_SECRETARY') or hasRole('RWA_PRESIDENT')")
    @Operation(summary = "Filter Visitors", description = "Filter visitors by category or date range")
    public ResponseEntity<List<VisitorResponse>> filterVisitors(
            @RequestParam Long societyId,
            @RequestParam(required = false) VisitorCategory category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        if (category != null) {
            return ResponseEntity.ok(visitorService.filterVisitorsByCategory(societyId, category));
        } else if (startDate != null && endDate != null) {
            return ResponseEntity.ok(visitorService.filterVisitorsByDateRange(societyId, startDate, endDate));
        }
        return ResponseEntity.ok(visitorService.getAllVisitorLogsBySociety(societyId));
    }

    @GetMapping("/overstaying")
    @PreAuthorize("hasRole('SECURITY_GUARD') or hasRole('ADMIN') or hasRole('RWA_SECRETARY') or hasRole('RWA_PRESIDENT')")
    @Operation(summary = "Overstaying Visitors", description = "Get visitors who have exceeded expected checkout time")
    public ResponseEntity<List<VisitorResponse>> getOverstayingVisitors(@RequestParam Long societyId) {
        return ResponseEntity.ok(visitorService.getOverstayingVisitors(societyId));
    }

    @PostMapping("/pre-approve")
    @PreAuthorize("hasRole('RESIDENT')")
    @Operation(summary = "Pre-approve Visitor", description = "Resident creates a pre-approval")
    public ResponseEntity<PreApproval> createPreApproval(
            @RequestBody com.ecanopy.dto.request.PreApprovalRequest request) {
        PreApproval entity = PreApproval.builder()
                .visitorName(request.getVisitorName())
                .visitorPhone(request.getVisitorPhone())
                .category(request.getCategory())
                .validFrom(request.getValidFrom())
                .validUntil(request.getValidUntil())
                .code(null) // will be generated
                .isUsed(false)
                .build();

        com.ecanopy.entity.Resident resident = new com.ecanopy.entity.Resident();
        resident.setResidentId(request.getResidentId());
        entity.setResident(resident);

        com.ecanopy.entity.Flat flat = new com.ecanopy.entity.Flat();
        flat.setFlatId(request.getFlatId());
        entity.setFlat(flat);

        return ResponseEntity.ok(visitorService.createPreApproval(entity));
    }

    @GetMapping("/flat/{flatId}")
    @Operation(summary = "Flat Visitor History", description = "Get visitor history for a specific flat")
    public ResponseEntity<List<VisitorResponse>> getVisitorsByFlat(@PathVariable Long flatId) {
        System.out.println("DEBUG: getVisitorsByFlat called. FlatID: " + flatId);
        List<VisitorResponse> visitors = visitorService.getVisitorsByFlat(flatId);
        System.out.println("DEBUG: Found " + visitors.size() + " visitors for flat " + flatId);
        return ResponseEntity.ok(visitors);
    }

    @PostMapping("/{logId}/approve")
    @PreAuthorize("hasRole('RESIDENT')")
    @Operation(summary = "Approve Visitor", description = "Resident approves a visitor")
    public ResponseEntity<VisitorResponse> approveVisitor(@PathVariable Long logId) {
        return ResponseEntity.ok(visitorService.updateVisitorStatus(logId, true));
    }

    @PostMapping("/{logId}/reject")
    @PreAuthorize("hasRole('RESIDENT')")
    @Operation(summary = "Reject Visitor", description = "Resident rejects a visitor")
    public ResponseEntity<VisitorResponse> rejectVisitor(@PathVariable Long logId) {
        return ResponseEntity.ok(visitorService.updateVisitorStatus(logId, false));
    }

    @GetMapping("/{logId}")
    @Operation(summary = "Get Visitor Log", description = "Get details of a specific visitor log")
    public ResponseEntity<VisitorResponse> getVisitorLog(@PathVariable Long logId) {
        return ResponseEntity.ok(visitorService.getVisitorLog(logId));
    }

    @GetMapping("/pending-approvals/{residentId}")
    @PreAuthorize("hasRole('RESIDENT')")
    @Operation(summary = "Pending Approvals", description = "Get pending visitor approvals for a resident")
    public ResponseEntity<List<VisitorResponse>> getPendingApprovals(@PathVariable Long residentId) {
        return ResponseEntity.ok(visitorService.getPendingApprovalsForResident(residentId));
    }
}
