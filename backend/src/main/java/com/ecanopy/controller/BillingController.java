package com.ecanopy.controller;

import com.ecanopy.dto.response.MaintenanceBillResponse;
import com.ecanopy.service.BillingService;
import com.ecanopy.service.AuthService;
import com.ecanopy.repository.UserRepository;
import com.ecanopy.repository.ResidentRepository;
import com.ecanopy.entity.User;
import com.ecanopy.entity.Resident;
import com.ecanopy.exception.NotFoundException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/billing")
@RequiredArgsConstructor
@Tag(name = "Billing Management", description = "Endpoints for maintenance bills")
public class BillingController {

    private final BillingService billingService;
    private final AuthService authService;
    private final UserRepository userRepository;
    private final ResidentRepository residentRepository;

    @PostMapping("/generate")
    @PreAuthorize("hasRole('RWA_SECRETARY')")
    @Operation(summary = "Generate Monthly Bills", description = "Generate maintenance bills for all flats in the current user's society")
    public ResponseEntity<Void> generateBills(@RequestBody Map<String, BigDecimal> payload) {
        BigDecimal rate = payload.get("ratePerSqFt");
        if (rate == null || rate.compareTo(BigDecimal.ZERO) <= 0) {
            throw new com.ecanopy.exception.BadRequestException("Invalid rate per sq ft");
        }

        User currentUser = userRepository.findByEmail(authService.getCurrentUser().getEmail())
                .orElseThrow(() -> new NotFoundException("User not found"));

        Long societyId = currentUser.getSocietyId();
        if (societyId == null) {
            // Try derived
            Resident resident = residentRepository.findByUserId(currentUser.getId())
                    .orElseThrow(() -> new NotFoundException("User is not associated with any society"));
            societyId = resident.getFlat().getBuilding().getSociety().getSocietyId();
        }

        billingService.generateMonthlyBills(societyId, rate);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RWA_PRESIDENT', 'RWA_SECRETARY', 'RESIDENT')")
    @Operation(summary = "Get All Bills", description = "Get all maintenance bills visible to the current user")
    public ResponseEntity<List<MaintenanceBillResponse>> getAllBills() {
        return ResponseEntity.ok(billingService.getAllBills());
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('RESIDENT')")
    @Operation(summary = "My Bills", description = "Get bills for the current resident's flat")
    public ResponseEntity<List<MaintenanceBillResponse>> getMyBills() {
        User currentUser = userRepository.findByEmail(authService.getCurrentUser().getEmail())
                .orElseThrow(() -> new NotFoundException("User not found"));

        Resident resident = residentRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new NotFoundException("Resident profile not found"));

        return ResponseEntity.ok(billingService.getBillsByFlat(resident.getFlat().getFlatId()));
    }

    @PutMapping("/{id}/pay")
    @PreAuthorize("hasRole('RWA_SECRETARY')")
    @Operation(summary = "Mark Bill as Paid", description = "Manually mark a bill as paid (offline payment received)")
    public ResponseEntity<Void> markAsPaid(@PathVariable Long id) {
        billingService.markBillAsPaid(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/pay-online")
    @PreAuthorize("hasRole('RESIDENT')")
    @Operation(summary = "Pay Bill Online", description = "Simulate an online payment by resident")
    public ResponseEntity<Void> payOnline(@PathVariable Long id) {

        billingService.markBillAsPaid(id);
        return ResponseEntity.ok().build();
    }
}
