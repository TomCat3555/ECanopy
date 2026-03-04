package com.ecanopy.controller;

import com.ecanopy.dto.DashboardStatsDTO;
import com.ecanopy.dto.response.UserResponse;
import com.ecanopy.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Admin User Management endpoints")
@PreAuthorize("hasAnyRole('ADMIN', 'RWA_SECRETARY', 'RWA_PRESIDENT')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    @Operation(summary = "Get all users", description = "Retrieve a list of all registered users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/dashboard-stats")
    @Operation(summary = "Get Dashboard Statistics", description = "Get real-time stats for Admin Dashboard")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @PostMapping("/create-guard")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RWA_SECRETARY')")
    @Operation(summary = "Create Security Guard", description = "Create a new security guard")
    public ResponseEntity<UserResponse> createSecurityGuard(
            @jakarta.validation.Valid @RequestBody com.ecanopy.dto.request.CreateSecurityGuardRequest request) {
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED)
                .body(adminService.createSecurityGuard(request));
    }

    @PutMapping("/users/{userId}/role")
    @Operation(summary = "Add role to user", description = "Promote a user by adding a role (e.g., RWA_SECRETARY)")
    public ResponseEntity<UserResponse> updateUserRole(
            @PathVariable Long userId,
            @RequestBody Map<String, String> payload) {
        // payload: { "role": "RWA_SECRETARY" }
        String role = payload.get("role");
        return ResponseEntity.ok(adminService.updateUserRole(userId, role));
    }

    @DeleteMapping("/users/{userId}/role")
    @Operation(summary = "Remove role from user", description = "Demote a user by removing a role")
    public ResponseEntity<UserResponse> removeUserRole(
            @PathVariable Long userId,
            @RequestBody Map<String, String> payload) {
        String role = payload.get("role");
        return ResponseEntity.ok(adminService.removeUserRole(userId, role));
    }
}
