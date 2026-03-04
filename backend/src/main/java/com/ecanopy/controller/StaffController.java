package com.ecanopy.controller;

import com.ecanopy.entity.DomesticHelp;
import com.ecanopy.service.DomesticHelpService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
@Tag(name = "Staff Management", description = "Endpoints for Domestic Help and Staff")
public class StaffController {

    private final DomesticHelpService domesticHelpService;
    private final com.ecanopy.service.AuthService authService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RWA_SECRETARY', 'SECURITY_GUARD', 'RESIDENT')")
    @Operation(summary = "Get all staff", description = "Retrieve list of all domestic help staff for your society")
    public ResponseEntity<List<DomesticHelp>> getAllStaff() {
        Long societyId = authService.getCurrentUser().getSocietyId();
        return ResponseEntity.ok(domesticHelpService.getAllStaff(societyId));
    }

    @PostMapping("/scan")
    @PreAuthorize("hasRole('SECURITY_GUARD')")
    @Operation(summary = "Scan Staff Passcode", description = "Record entry/exit for domestic help")
    public ResponseEntity<java.util.Map<String, Object>> scanPassCode(@RequestParam String passCode) {
        String scannedBy = authService.getCurrentUser().getEmail();
        return ResponseEntity.ok(domesticHelpService.recordStaffAccess(passCode, scannedBy));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RWA_SECRETARY')")
    @Operation(summary = "Add new staff", description = "Onboard new domestic help")
    public ResponseEntity<DomesticHelp> addStaff(@RequestBody DomesticHelp staff) {
        Long societyId = authService.getCurrentUser().getSocietyId();
        return ResponseEntity.ok(domesticHelpService.addStaff(staff, societyId));
    }

    @GetMapping("/flat/{flatId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESIDENT')")
    @Operation(summary = "Get staff for flat", description = "Get domestic help assigned to a flat")
    public ResponseEntity<List<DomesticHelp>> getStaffByFlat(@PathVariable Long flatId) {
        return ResponseEntity.ok(domesticHelpService.getStaffByFlat(flatId));
    }

    @PostMapping("/{staffId}/link-flat/{flatId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RWA_SECRETARY', 'RESIDENT')")
    @Operation(summary = "Assign Staff to Flat", description = "Link a domestic help to a specific flat")
    public ResponseEntity<Void> linkStaffToFlat(@PathVariable Long staffId, @PathVariable Long flatId) {
        // TODO: For residents, verify they actually live in this flat
        domesticHelpService.linkStaffToFlat(staffId, flatId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{staffId}/unlink-flat/{flatId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RWA_SECRETARY', 'RESIDENT')")
    @Operation(summary = "Unassign Staff from Flat", description = "Remove domestic help from a flat")
    public ResponseEntity<Void> unlinkStaffFromFlat(@PathVariable Long staffId, @PathVariable Long flatId) {
        domesticHelpService.unlinkStaffFromFlat(staffId, flatId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{staffId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RWA_SECRETARY')")
    @Operation(summary = "Delete Staff", description = "Remove a staff member")
    public ResponseEntity<Void> deleteStaff(@PathVariable Long staffId) {
        domesticHelpService.deleteStaff(staffId);
        return ResponseEntity.noContent().build();
    }
}
