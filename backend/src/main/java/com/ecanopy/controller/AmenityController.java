package com.ecanopy.controller;

import com.ecanopy.entity.Amenity;
import com.ecanopy.entity.AmenityBooking;
import com.ecanopy.service.AmenityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/amenities")
@RequiredArgsConstructor
@Tag(name = "Amenity Management", description = "Endpoints for booking clubhouse, swimming pool, etc.")
public class AmenityController {

    private final AmenityService amenityService;
    private final com.ecanopy.service.AuthService authService; // To get current user

    @GetMapping
    @Operation(summary = "Get all amenities", description = "List all available amenities for the user's society")
    public ResponseEntity<List<Amenity>> getAllAmenities() {
        com.ecanopy.dto.response.UserResponse user = authService.getCurrentUser();
        System.out.println("DEBUG: AmenityController.getAllAmenities called for User: " + user.getEmail());
        return ResponseEntity.ok(amenityService.getAllAmenitiesByUserId(user.getId()));
    }

    @GetMapping("/bookings")
    @PreAuthorize("hasAnyRole('ADMIN', 'RWA_SECRETARY', 'RWA_PRESIDENT')")
    @Operation(summary = "Get all bookings", description = "List all amenity bookings for the society")
    public ResponseEntity<List<com.ecanopy.dto.response.AmenityBookingResponse>> getAllBookings() {
        Long societyId = authService.getCurrentUser().getSocietyId();
        return ResponseEntity.ok(amenityService.getAllBookings(societyId));
    }

    @GetMapping("/my-bookings")
    @PreAuthorize("hasRole('RESIDENT')")
    @Operation(summary = "My Bookings", description = "List bookings for the current resident")
    public ResponseEntity<List<com.ecanopy.dto.response.AmenityBookingResponse>> getMyBookings() {
        Long userId = authService.getCurrentUser().getId();
        // Assuming user -> resident relation is straightforward and we have a
        // service/repo method to get residentId
        // Ideally AuthService should provide this, but for MVP let's find it via
        // ResidentRepository or similar?
        // Let's use logic from BillingController: find by userId.
        // Or if AmenityService is robust, we can pass userId?
        // AmenityService.getMyBookings takes residentId.

        // Let's inject ResidentRepository here to be safe and clean.
        // Actually, let's update AmenityService to accept userId and resolve residentId
        // internally.
        // It's cleaner.
        // But for now, let's assume we can fetch it or pass userId.
        // Wait, AmenityService.getMyBookings(Long residentId).
        // I need residentId.
        // Let's change AmenityService to take userId? Or fetch it in Controller.
        // Controller doesn't have ResidentRepository injected.
        // I'll add 'getMyBookingsByUserId' to Service?
        // Or just let Service handle it.
        // I'll modify Service to take userId in next step.
        // For now, let's put the endpoint signature and I'll fix service.
        return ResponseEntity.ok(amenityService.getMyBookingsByUserId(userId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('RWA_SECRETARY')")
    @Operation(summary = "Add Amenity", description = "Admin/Secretary adds a new amenity")
    public ResponseEntity<Amenity> addAmenity(@Valid @RequestBody Amenity amenity) {
        Long societyId = authService.getCurrentUser().getSocietyId();
        System.out.println("DEBUG: Adding Amenity: " + amenity.getAmenityName() + " for SocietyID: " + societyId);
        return ResponseEntity.ok(amenityService.addAmenity(amenity, societyId));
    }

    @PostMapping("/{amenityId}/book")
    @PreAuthorize("hasRole('RESIDENT')")
    @Operation(summary = "Book Amenity", description = "Resident books an amenity")
    public ResponseEntity<AmenityBooking> bookAmenity(
            @PathVariable Long amenityId,
            @RequestParam Long userId,
            @RequestBody Map<String, String> payload) {
        // payload: { "startTime": "2023-10-27T10:00:00", "endTime":
        // "2023-10-27T12:00:00" }
        LocalDateTime start = LocalDateTime.parse(payload.get("startTime"));
        LocalDateTime end = LocalDateTime.parse(payload.get("endTime"));
        return ResponseEntity.ok(amenityService.bookAmenity(amenityId, userId, start, end));
    }

    @PutMapping("/{amenityId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RWA_SECRETARY')")
    @Operation(summary = "Update Amenity", description = "Admin/Secretary updates an existing amenity")
    public ResponseEntity<Amenity> updateAmenity(@PathVariable Long amenityId, @Valid @RequestBody Amenity amenity) {
        return ResponseEntity.ok(amenityService.updateAmenity(amenityId, amenity));
    }

    @DeleteMapping("/{amenityId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RWA_SECRETARY')")
    @Operation(summary = "Delete Amenity", description = "Remove an amenity")
    public ResponseEntity<Void> deleteAmenity(@PathVariable Long amenityId) {
        amenityService.deleteAmenity(amenityId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/bookings/{bookingId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RWA_SECRETARY')")
    @Operation(summary = "Update Booking Status", description = "Approve or Reject a booking")
    public ResponseEntity<com.ecanopy.dto.response.AmenityBookingResponse> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestParam String status) {
        String approvedBy = authService.getCurrentUser().getEmail(); // Ideally User object
        return ResponseEntity.ok(amenityService.updateBookingStatus(bookingId, status, approvedBy));
    }
}
