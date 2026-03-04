package com.ecanopy.controller;

import com.ecanopy.dto.response.ResidentDashboardDTO;
import com.ecanopy.dto.response.UserResponse;
import com.ecanopy.service.AuthService;
import com.ecanopy.service.ResidentDashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/resident")
@RequiredArgsConstructor
@Tag(name = "Resident Dashboard", description = "Endpoints for resident personalized dashboard")
public class ResidentDashboardController {

    private final ResidentDashboardService residentDashboardService;
    private final AuthService authService;

    @GetMapping("/dashboard-stats")
    @PreAuthorize("hasRole('RESIDENT')")
    @Operation(summary = "Get Resident Dashboard Stats", description = "Get personalized stats for the logged-in resident")
    public ResponseEntity<ResidentDashboardDTO> getDashboardStats() {
        UserResponse user = authService.getCurrentUser();
        return ResponseEntity.ok(residentDashboardService.getDashboardStats(user.getId()));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get Resident by User ID", description = "Get resident data for a specific user")
    public ResponseEntity<?> getResidentByUserId(@org.springframework.web.bind.annotation.PathVariable Long userId) {
        UserResponse user = authService.getCurrentUser();
        if (!user.getId().equals(userId)) {
            return ResponseEntity.status(403).body("Access denied");
        }
        return ResponseEntity.ok(residentDashboardService.getResidentByUserId(userId));
    }
}
