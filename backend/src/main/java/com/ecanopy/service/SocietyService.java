package com.ecanopy.service;

import com.ecanopy.dto.request.BuildingRequest;
import com.ecanopy.dto.request.FlatRequest;
import com.ecanopy.dto.request.SocietyRequest;
import com.ecanopy.dto.response.BuildingResponse;
import com.ecanopy.dto.response.FlatResponse;
import com.ecanopy.dto.response.SocietyResponse;
import com.ecanopy.entity.Building;
import com.ecanopy.entity.Flat;
import com.ecanopy.entity.Society;
import com.ecanopy.exception.NotFoundException;
import com.ecanopy.repository.BuildingRepository;
import com.ecanopy.repository.FlatRepository;
import com.ecanopy.repository.SocietyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SocietyService {

    private final SocietyRepository societyRepository;
    private final BuildingRepository buildingRepository;
    private final FlatRepository flatRepository;

    @Transactional
    public SocietyResponse createSociety(SocietyRequest request) {
        Society society = new Society();
        society.setSocietyName(request.getSocietyName());

        // Map address fields to single address string
        String fullAddress = String.format("%s, %s, %s - %s",
                request.getAddress(), request.getCity(), request.getState(), request.getPostalCode());
        society.setAddress(fullAddress);

        society.setCreatedAt(LocalDateTime.now());

        Society savedSociety = societyRepository.save(society);
        return mapToSocietyResponse(savedSociety);
    }

    public List<SocietyResponse> getAllSocieties() {
        return societyRepository.findAll().stream()
                .map(this::mapToSocietyResponse)
                .collect(Collectors.toList());
    }

    public SocietyResponse getSocietyById(Long id) {
        Society society = societyRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Society not found"));
        return mapToSocietyResponse(society);
    }

    @Transactional
    public BuildingResponse addBuilding(Long societyId, BuildingRequest request) {
        Society society = societyRepository.findById(societyId)
                .orElseThrow(() -> new NotFoundException("Society not found"));

        Building building = new Building();
        building.setBuildingName(request.getBuildingName());
        building.setTotalFloors(request.getTotalFloors());
        building.setSociety(society);

        Building savedBuilding = buildingRepository.save(building);
        return mapToBuildingResponse(savedBuilding);
    }

    public List<BuildingResponse> getBuildingsBySociety(Long societyId) {
        return buildingRepository.findBySocietySocietyId(societyId).stream()
                .map(this::mapToBuildingResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public FlatResponse addFlat(Long buildingId, FlatRequest request) {
        Building building = buildingRepository.findById(buildingId)
                .orElseThrow(() -> new NotFoundException("Building not found"));

        Flat flat = new Flat();
        flat.setFlatNumber(request.getFlatNumber());
        flat.setFloor(request.getFloorNumber());
        flat.setBuilding(building);
        flat.setIsOccupied(false);

        Flat savedFlat = flatRepository.save(flat);
        return mapToFlatResponse(savedFlat);
    }

    public List<FlatResponse> getFlatsByBuilding(Long buildingId) {
        return flatRepository.findByBuildingBuildingId(buildingId).stream()
                .map(this::mapToFlatResponse)
                .collect(Collectors.toList());
    }

    private SocietyResponse mapToSocietyResponse(Society society) {
        return SocietyResponse.builder()
                .societyId(society.getSocietyId())
                .societyName(society.getSocietyName())
                .address(society.getAddress())
                .build();
    }

    private BuildingResponse mapToBuildingResponse(Building building) {
        return BuildingResponse.builder()
                .buildingId(building.getBuildingId())
                .buildingName(building.getBuildingName())
                .totalFloors(building.getTotalFloors())
                .societyId(building.getSociety().getSocietyId())
                .build();
    }

    private FlatResponse mapToFlatResponse(Flat flat) {
        return FlatResponse.builder()
                .flatId(flat.getFlatId())
                .flatNumber(flat.getFlatNumber())
                .floorNumber(flat.getFloor())
                .buildingId(flat.getBuilding().getBuildingId())
                .build();
    }
}
