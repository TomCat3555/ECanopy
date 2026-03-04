package com.ecanopy.service;

import com.ecanopy.dto.DashboardStatsDTO;
import com.ecanopy.dto.response.UserResponse;
import com.ecanopy.entity.Resident;
import com.ecanopy.entity.Role;
import com.ecanopy.entity.User;
import com.ecanopy.entity.enums.ComplaintStatus;
import com.ecanopy.entity.enums.ApprovalStatus;
import com.ecanopy.exception.NotFoundException;
import com.ecanopy.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

        private final UserRepository userRepository;
        private final RoleRepository roleRepository;
        private final ResidentRepository residentRepository;
        private final FlatRepository flatRepository;
        private final ComplaintRepository complaintRepository;
        private final VisitorLogRepository visitorLogRepository;
        private final NoticeRepository noticeRepository;
        private final BillingService billingService;
        private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
        private final AuthService authService;
        private final ResidentJoinRequestRepository residentJoinRequestRepository;

        @Transactional
        public UserResponse createSecretary(com.ecanopy.dto.request.CreateSecretaryRequest request) {
                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new com.ecanopy.exception.BadRequestException("Email already in use");
                }

                Role secretaryRole = roleRepository.findByName("ROLE_RWA_SECRETARY")
                                .orElseThrow(() -> new NotFoundException("Role ROLE_RWA_SECRETARY not found"));

                User user = User.builder()
                                .fullName(request.getFullName())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .phoneNumber(request.getPhoneNumber())
                                .societyId(request.getSocietyId())
                                .enabled(true)
                                .roles(java.util.Set.of(secretaryRole))
                                .build();

                User savedUser = userRepository.save(user);
                return mapToUserResponse(savedUser);
        }

        public List<UserResponse> getResidentsBySociety(Long societyId) {
                System.out.println("Fetching residents for Society ID: " + societyId);

                // DEBUG: Fetch ALL residents to see if any exist
                List<Resident> allResidents = residentRepository.findAll();
                System.out.println("Total Residents in DB: " + allResidents.size());

                allResidents.forEach(r -> {
                        if (r.getFlat() != null && r.getFlat().getBuilding() != null
                                        && r.getFlat().getBuilding().getSociety() != null) {
                                System.out.println("Res ID: " + r.getResidentId() + " => Soc ID: "
                                                + r.getFlat().getBuilding().getSociety().getSocietyId());
                        } else {
                                System.out.println("Res ID: " + r.getResidentId() + " => Broken Relationship Chain");
                        }
                });

                // Manual Filter
                List<Resident> filtered = allResidents.stream()
                                .filter(r -> r.getFlat() != null &&
                                                r.getFlat().getBuilding() != null &&
                                                r.getFlat().getBuilding().getSociety() != null &&
                                                r.getFlat().getBuilding().getSociety().getSocietyId().equals(societyId))
                                .collect(Collectors.toList());

                System.out.println("Filtered Residents count: " + filtered.size());

                return filtered.stream()
                                .map(Resident::getUser)
                                .map(this::mapToUserResponse)
                                .collect(Collectors.toList());
        }

        @Transactional
        public UserResponse promoteToSecretary(Long userId) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new NotFoundException("User not found"));

                Resident resident = residentRepository.findByUserId(userId)
                                .orElseThrow(() -> new NotFoundException("User is not a resident"));

                Long societyId = resident.getFlat().getBuilding().getSociety().getSocietyId();

                // Check if any resident in this society is already a Secretary
                boolean societyHasSecretary = residentRepository.findByFlat_Building_Society_SocietyId(societyId)
                                .stream()
                                .map(Resident::getUser)
                                .anyMatch(u -> u.getRoles().stream()
                                                .anyMatch(r -> r.getName().equals("ROLE_RWA_SECRETARY")));

                if (societyHasSecretary) {
                        // Check if the current user is that secretary (idempotent)
                        boolean isCurrent = user.getRoles().stream()
                                        .anyMatch(r -> r.getName().equals("ROLE_RWA_SECRETARY"));
                        if (isCurrent)
                                return mapToUserResponse(user);

                        throw new com.ecanopy.exception.BadRequestException("This society already has a Secretary.");
                }

                // Assign Role
                Role secretaryRole = roleRepository.findByName("ROLE_RWA_SECRETARY")
                                .orElseThrow(() -> new NotFoundException("Role ROLE_RWA_SECRETARY not found"));

                user.getRoles().add(secretaryRole);
                User savedUser = userRepository.save(user);
                return mapToUserResponse(savedUser);
        }

        public DashboardStatsDTO getDashboardStats() {
                LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
                LocalDateTime endOfDay = LocalDate.now().plusDays(1).atStartOfDay();

                UserResponse currentUser = authService.getCurrentUser();
                Long societyId = currentUser.getSocietyId();

                if (societyId == null) {
                        // For Super Admin or users not yet linked to a society
                        return DashboardStatsDTO.builder()
                                        .totalResidents(residentRepository.count())
                                        .totalFlats(flatRepository.count())
                                        .pendingComplaints(complaintRepository.countByStatus(ComplaintStatus.OPEN) +
                                                        complaintRepository.countByStatus(ComplaintStatus.IN_PROGRESS))
                                        .todaysVisitors(visitorLogRepository.countByInTimeBetween(startOfDay, endOfDay))
                                        .pendingDues(billingService.getTotalPendingDues())
                                        .activeNotices(noticeRepository.countByIsActiveTrue())
                                        .pendingJoinRequests(residentJoinRequestRepository.count())
                                        .build();
                }

                return DashboardStatsDTO.builder()
                                .totalResidents(residentRepository.countByFlat_Building_Society_SocietyId(societyId))
                                .totalFlats(flatRepository.countByBuildingSocietySocietyId(societyId))
                                .pendingComplaints(complaintRepository
                                                .countByResident_Flat_Building_Society_SocietyIdAndStatus(
                                                                societyId, ComplaintStatus.OPEN)
                                                +
                                                complaintRepository
                                                                .countByResident_Flat_Building_Society_SocietyIdAndStatus(
                                                                                societyId, ComplaintStatus.IN_PROGRESS))
                                .todaysVisitors(visitorLogRepository
                                                .countByFlat_Building_Society_SocietyIdAndInTimeBetween(
                                                                societyId, startOfDay, endOfDay))
                                .pendingDues(billingService.getTotalPendingDuesBySociety(societyId))
                                .activeNotices(noticeRepository.countBySocietySocietyIdAndIsActiveTrue(societyId))
                                .pendingJoinRequests(residentJoinRequestRepository
                                                .countByFlat_Building_Society_SocietyIdAndStatus(
                                                                societyId, ApprovalStatus.PENDING))
                                .build();
        }

        public List<UserResponse> getAllUsers() {
                UserResponse currentUser = authService.getCurrentUser();

                if (currentUser.getSocietyId() != null) {
                        return userRepository.findAllBySocietyIdCustom(currentUser.getSocietyId()).stream()
                                        .map(this::mapToUserResponse)
                                        .collect(Collectors.toList());
                }

                // If no societyId (e.g. Super Admin), return all
                return userRepository.findAll().stream()
                                .map(this::mapToUserResponse)
                                .collect(Collectors.toList());
        }

        @Transactional
        public UserResponse updateUserRole(Long userId, String roleName) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new NotFoundException("User not found"));

                String effectiveRoleName = roleName.startsWith("ROLE_") ? roleName : "ROLE_" + roleName;

                Role role = roleRepository.findByName(effectiveRoleName)
                                .orElseThrow(() -> new NotFoundException("Role not found: " + effectiveRoleName));

                user.getRoles().add(role);

                User savedUser = userRepository.save(user);
                return mapToUserResponse(savedUser);
        }

        @Transactional
        public UserResponse removeUserRole(Long userId, String roleName) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new NotFoundException("User not found"));

                if (!roleName.startsWith("ROLE_")) {
                        roleName = "ROLE_" + roleName;
                }

                String finalRoleName = roleName;
                Set<Role> updatedRoles = user.getRoles().stream()
                                .filter(r -> !r.getName().equals(finalRoleName))
                                .collect(Collectors.toSet());
                user.setRoles(new HashSet<>(updatedRoles));

                User savedUser = userRepository.save(user);
                return mapToUserResponse(savedUser);
        }

        @Transactional
        public UserResponse createSecurityGuard(com.ecanopy.dto.request.CreateSecurityGuardRequest request) {
                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new com.ecanopy.exception.BadRequestException("Email already in use");
                }

                Role guardRole = roleRepository.findByName("ROLE_SECURITY_GUARD")
                                .orElseThrow(() -> new NotFoundException("Role ROLE_SECURITY_GUARD not found"));

                User user = User.builder()
                                .fullName(request.getFullName())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .phoneNumber(request.getPhoneNumber())
                                .societyId(request.getSocietyId())
                                .enabled(true)
                                .roles(java.util.Set.of(guardRole))
                                .build();

                User savedUser = userRepository.save(user);
                return mapToUserResponse(savedUser);
        }

        private UserResponse mapToUserResponse(User user) {
                Set<String> roles = user.getRoles().stream()
                                .map(Role::getName)
                                .collect(Collectors.toSet());

                String buildingName = null;
                String flatNumber = null;

                if (user.getResident() != null && user.getResident().getFlat() != null) {
                        flatNumber = user.getResident().getFlat().getFlatNumber();
                        if (user.getResident().getFlat().getBuilding() != null) {
                                buildingName = user.getResident().getFlat().getBuilding().getBuildingName();
                        }
                }

                return UserResponse.builder()
                                .id(user.getId())
                                .email(user.getEmail())
                                .fullName(user.getFullName())
                                .phoneNumber(user.getPhoneNumber())
                                .societyId(user.getSocietyId())
                                .buildingName(buildingName)
                                .flatNumber(flatNumber)
                                .roles(roles)
                                .build();
        }
}
