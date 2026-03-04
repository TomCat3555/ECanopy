package com.ecanopy.service;

import com.ecanopy.dto.request.JoinRequestDto;
import com.ecanopy.dto.response.JoinRequestResponse;
import com.ecanopy.entity.*;
import com.ecanopy.entity.enums.ApprovalStatus;
import com.ecanopy.exception.NotFoundException;
import com.ecanopy.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JoinRequestService {

    private final ResidentJoinRequestRepository joinRequestRepository;
    private final FlatRepository flatRepository;
    private final UserRepository userRepository;
    private final ResidentRepository residentRepository;
    private final AuthService authService;

    @Transactional
    public JoinRequestResponse submitJoinRequest(JoinRequestDto request) {
        User user = userRepository.findByEmail(authService.getCurrentUser().getEmail())
                .orElseThrow(() -> new NotFoundException("User not found"));

        Flat flat = flatRepository.findById(request.getFlatId())
                .orElseThrow(() -> new NotFoundException("Flat not found"));

        ResidentJoinRequest joinRequest = new ResidentJoinRequest();
        joinRequest.setUser(user);
        joinRequest.setFlat(flat);
        joinRequest.setResidentType(request.getResidentType());
        joinRequest.setStatus(ApprovalStatus.PENDING);
        joinRequest.setDeedDocumentUrl(request.getDeedDocumentUrl());
        joinRequest.setRequestedAt(LocalDateTime.now());

        ResidentJoinRequest savedRequest = joinRequestRepository.save(joinRequest);
        return mapToResponse(savedRequest);
    }

    public List<JoinRequestResponse> getPendingRequests(Long societyId) {
        return joinRequestRepository.findByFlat_Building_Society_SocietyIdAndStatus(societyId, ApprovalStatus.PENDING)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<JoinRequestResponse> getMyRequests() {
        User user = userRepository.findByEmail(authService.getCurrentUser().getEmail())
                .orElseThrow(() -> new NotFoundException("User not found"));
        return joinRequestRepository.findByUser(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public JoinRequestResponse updateStatus(Long requestId, ApprovalStatus status) {
        ResidentJoinRequest request = joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new NotFoundException("Request not found"));

        if (request.getStatus() != ApprovalStatus.PENDING) {
            throw new IllegalStateException("Request is already processed");
        }

        request.setStatus(status);
        request.setRespondedAt(LocalDateTime.now());

        if (status == ApprovalStatus.APPROVED) {
            createResidentProfile(request);
        }

        ResidentJoinRequest savedRequest = joinRequestRepository.save(request);
        return mapToResponse(savedRequest);
    }

    private void createResidentProfile(ResidentJoinRequest request) {
        User user = request.getUser();

        // Link user to the society
        user.setSocietyId(request.getFlat().getBuilding().getSociety().getSocietyId());
        userRepository.save(user);

        // Check if resident already exists to prevent duplicates
        if (residentRepository.findByUserId(user.getId()).isPresent()) {
            return;
        }

        Resident resident = new Resident();
        resident.setFullName(user.getFullName());
        resident.setEmail(user.getEmail());
        resident.setPhone(user.getPhoneNumber());
        resident.setResidentType(request.getResidentType());
        resident.setFlat(request.getFlat());
        resident.setUser(user);
        resident.setIsActive(true);
        resident.setMoveInDate(LocalDate.now());
        resident.setCreatedAt(LocalDateTime.now());

        residentRepository.save(resident);
    }

    private JoinRequestResponse mapToResponse(ResidentJoinRequest req) {
        return JoinRequestResponse.builder()
                .requestId(req.getRequestId())
                .userId(req.getUser().getId())
                .userName(req.getUser().getFullName())
                .userEmail(req.getUser().getEmail())
                .flatId(req.getFlat().getFlatId())
                .flatNumber(req.getFlat().getFlatNumber())
                .societyName(req.getFlat().getBuilding().getSociety().getSocietyName())
                .residentType(req.getResidentType())
                .status(req.getStatus())
                .deedDocumentUrl(req.getDeedDocumentUrl())
                .requestedAt(req.getRequestedAt())
                .build();
    }
}
