package com.ecanopy.controller;

import com.ecanopy.dto.request.PromoteSecretaryRequest;
import com.ecanopy.dto.response.UserResponse;
import com.ecanopy.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/super-admin")
@RequiredArgsConstructor
@Tag(name = "Super Admin Management", description = "Endpoints for Super Admin workflows")
public class SuperAdminController {

    private final AdminService adminService;

    @GetMapping("/societies/{societyId}/residents")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Get Residents by Society", description = "List all residents of a specific society")
    public ResponseEntity<List<UserResponse>> getResidentsBySociety(@PathVariable Long societyId) {
        return ResponseEntity.ok(adminService.getResidentsBySociety(societyId));
    }

    @PostMapping("/promote-secretary")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Promote to Secretary", description = "Promote a user to RWA Secretary (One per society)")
    public ResponseEntity<UserResponse> promoteSecretary(@Valid @RequestBody PromoteSecretaryRequest request) {
        return ResponseEntity.ok(adminService.promoteToSecretary(request.getUserId()));
    }

    @PostMapping("/create-secretary")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Create Secretary", description = "Create a standalone Secretary user for a society")
    public ResponseEntity<UserResponse> createSecretary(
            @Valid @RequestBody com.ecanopy.dto.request.CreateSecretaryRequest request) {
        return ResponseEntity.ok(adminService.createSecretary(request));
    }
}
