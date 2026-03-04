package com.ecanopy.controller;

import com.ecanopy.dto.request.BuildingRequest;
import com.ecanopy.dto.request.FlatRequest;
import com.ecanopy.dto.request.SocietyRequest;
import com.ecanopy.dto.response.BuildingResponse;
import com.ecanopy.dto.response.FlatResponse;
import com.ecanopy.dto.response.SocietyResponse;
import com.ecanopy.service.SocietyService;
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
@RequestMapping("/api/societies")
@RequiredArgsConstructor
@Tag(name = "Society Management", description = "Endpoints for managing society structure")
public class SocietyController {

    private final SocietyService societyService;

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Create Society", description = "Create a new society (Admin only)")
    public ResponseEntity<SocietyResponse> createSociety(@Valid @RequestBody SocietyRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(societyService.createSociety(request));
    }

    @GetMapping
    @Operation(summary = "Get All Societies", description = "List all registered societies")
    public ResponseEntity<List<SocietyResponse>> getAllSocieties() {
        return ResponseEntity.ok(societyService.getAllSocieties());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Society by ID", description = "Get details of a specific society")
    public ResponseEntity<SocietyResponse> getSocietyById(@PathVariable Long id) {
        return ResponseEntity.ok(societyService.getSocietyById(id));
    }

    @PostMapping("/{societyId}/buildings")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Add Building", description = "Add a building to a society")
    public ResponseEntity<BuildingResponse> addBuilding(@PathVariable Long societyId,
            @Valid @RequestBody BuildingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(societyService.addBuilding(societyId, request));
    }

    @GetMapping("/{societyId}/buildings")
    @Operation(summary = "Get Buildings", description = "List all buildings in a society")
    public ResponseEntity<List<BuildingResponse>> getBuildings(@PathVariable Long societyId) {
        return ResponseEntity.ok(societyService.getBuildingsBySociety(societyId));
    }

    @PostMapping("/buildings/{buildingId}/flats")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Add Flat", description = "Add a flat to a building")
    public ResponseEntity<FlatResponse> addFlat(@PathVariable Long buildingId,
            @Valid @RequestBody FlatRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(societyService.addFlat(buildingId, request));
    }

    @GetMapping("/buildings/{buildingId}/flats")
    @Operation(summary = "Get Flats", description = "List all flats in a building")
    public ResponseEntity<List<FlatResponse>> getFlats(@PathVariable Long buildingId) {
        return ResponseEntity.ok(societyService.getFlatsByBuilding(buildingId));
    }
}
