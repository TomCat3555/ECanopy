package com.ecanopy.service;

import com.ecanopy.dto.request.VisitorRequest;
import com.ecanopy.dto.response.VisitorResponse;
import com.ecanopy.entity.*;
import com.ecanopy.entity.enums.ApprovalStatus;
import com.ecanopy.entity.enums.VisitorCategory;
import com.ecanopy.exception.NotFoundException;
import com.ecanopy.repository.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VisitorService {

    private final VisitorRepository visitorRepository;
    private final VisitorLogRepository visitorLogRepository;
    private final FlatRepository flatRepository;
    private final PreApprovalRepository preApprovalRepository;
    private final FrequentVisitorRepository frequentVisitorRepository;
    private final VisitorApprovalRepository visitorApprovalRepository;
    private final ResidentRepository residentRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public VisitorService(VisitorRepository visitorRepository, VisitorLogRepository visitorLogRepository,
            FlatRepository flatRepository, PreApprovalRepository preApprovalRepository,
            FrequentVisitorRepository frequentVisitorRepository,
            VisitorApprovalRepository visitorApprovalRepository, ResidentRepository residentRepository,
            UserRepository userRepository, EmailService emailService) {
        this.visitorRepository = visitorRepository;
        this.visitorLogRepository = visitorLogRepository;
        this.flatRepository = flatRepository;
        this.preApprovalRepository = preApprovalRepository;
        this.frequentVisitorRepository = frequentVisitorRepository;
        this.visitorApprovalRepository = visitorApprovalRepository;
        this.residentRepository = residentRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    @Transactional
    public java.util.Map<String, Object> checkInByPreApprovalCode(String code, String scannedBy) {
        PreApproval pa = preApprovalRepository.findByCodeAndIsUsedFalse(code)
                .orElseThrow(() -> new NotFoundException("Invalid or Used Pass Code"));

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(pa.getValidFrom()) || now.isAfter(pa.getValidUntil())) {
            throw new com.ecanopy.exception.BadRequestException("Pass Code is expired or not yet active");
        }

        // Logic checkInVisitor
        Visitor visitor = visitorRepository.findByPhone(pa.getVisitorPhone())
                .map(existing -> {
                    existing.setFullName(pa.getVisitorName()); // Update name if changed
                    return visitorRepository.save(existing);
                })
                .orElseGet(() -> {
                    Visitor v = new Visitor();
                    v.setFullName(pa.getVisitorName());
                    v.setPhone(pa.getVisitorPhone());
                    v.setCreatedAt(now);
                    return visitorRepository.save(v);
                });

        User guard = userRepository.findByEmail(scannedBy).orElse(null);

        VisitorLog log = new VisitorLog();
        log.setVisitor(visitor);
        log.setFlat(pa.getFlat());
        log.setCategory(pa.getCategory());
        log.setPurpose("Digital Pre-Approved Entry");
        log.setInTime(now);
        log.setCheckedInBy(guard);
        log.setGateEntry("Main Gate");
        log.setStatus(ApprovalStatus.APPROVED);

        visitorLogRepository.save(log);

        pa.setUsed(true);
        preApprovalRepository.save(pa);

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("name", pa.getVisitorName());
        response.put("type", "VISITOR");
        response.put("accessType", com.ecanopy.entity.enums.AccessType.ENTRY);
        response.put("status", "GRANTED");
        return response;
    }

    @Transactional
    public VisitorResponse checkInVisitor(VisitorRequest request) {
        // 1. Find or Create Visitor
        Visitor visitor = visitorRepository.findByPhone(request.getPhone())
                .map(existingVisitor -> {
                    existingVisitor.setFullName(request.getName());
                    if (request.getImageUrl() != null && !request.getImageUrl().isEmpty()) {
                        existingVisitor.setPhotoUrl(request.getImageUrl());
                    }
                    // Update ID proof if provided
                    if (request.getIdProofType() != null) {
                        existingVisitor.setIdProofType(request.getIdProofType());
                        existingVisitor.setIdProofNumber(request.getIdProofNumber());
                    }
                    return visitorRepository.save(existingVisitor);
                })
                .orElseGet(() -> {
                    Visitor newVisitor = new Visitor();
                    newVisitor.setFullName(request.getName());
                    newVisitor.setPhone(request.getPhone());
                    newVisitor.setPhotoUrl(request.getImageUrl());
                    newVisitor.setIdProofType(request.getIdProofType());
                    newVisitor.setIdProofNumber(request.getIdProofNumber());
                    newVisitor.setCreatedAt(LocalDateTime.now());
                    return visitorRepository.save(newVisitor);
                });

        // 2. Validate Flat
        Flat flat = flatRepository.findById(request.getFlatId())
                .orElseThrow(() -> new NotFoundException("Flat not found"));

        // 3. Get current user (security guard)
        User checkedInBy = getCurrentUser();

        // 4. Create Log
        VisitorLog log = new VisitorLog();
        log.setVisitor(visitor);
        log.setFlat(flat);
        log.setCategory(request.getCategory());
        log.setPurpose(request.getPurpose());
        log.setVehicleNumber(request.getVehicleNumber());
        log.setInTime(LocalDateTime.now());
        log.setCheckedInBy(checkedInBy);
        log.setGateEntry("Main Gate"); // TODO: Make this configurable

        // Set expected checkout time if provided
        if (request.getExpectedDurationMinutes() != null && request.getExpectedDurationMinutes() > 0) {
            log.setExpectedOutTime(LocalDateTime.now().plusMinutes(request.getExpectedDurationMinutes()));
        }

        // 5. Check approval status priority:
        // Priority 1: Frequent Visitor (auto-approved)
        // Priority 2: Pre-Approval (auto-approved)
        // Priority 3: Pending (needs resident approval)

        boolean isAutoApproved = false;

        // Check if frequent visitor
        if (visitor.getVisitorId() != null) {
            boolean isFrequentVisitor = frequentVisitorRepository
                    .findByVisitor_VisitorIdAndFlat_FlatIdAndIsActiveTrueAndValidFromBeforeAndValidUntilAfter(
                            visitor.getVisitorId(), flat.getFlatId(),
                            LocalDate.now(), LocalDate.now())
                    .isPresent();

            if (isFrequentVisitor) {
                log.setStatus(ApprovalStatus.APPROVED);
                isAutoApproved = true;
            }
        }

        // Check for pre-approval (only if not already approved as frequent visitor)
        if (!isAutoApproved) {
            boolean isPreApproved = preApprovalRepository
                    .findByVisitorPhoneAndFlat_FlatIdAndIsUsedFalseAndValidFromBeforeAndValidUntilAfter(
                            request.getPhone(), request.getFlatId(),
                            LocalDateTime.now(), LocalDateTime.now())
                    .isPresent();

            if (isPreApproved) {
                log.setStatus(ApprovalStatus.APPROVED);
                isAutoApproved = true;

                // Mark pre-approval as used
                preApprovalRepository
                        .findByVisitorPhoneAndFlat_FlatIdAndIsUsedFalseAndValidFromBeforeAndValidUntilAfter(
                                request.getPhone(), request.getFlatId(),
                                LocalDateTime.now(), LocalDateTime.now())
                        .ifPresent(pa -> {
                            pa.setUsed(true);
                            preApprovalRepository.save(pa);
                        });
            }
        }

        // If not auto-approved, set as PENDING and create approval requests
        if (!isAutoApproved) {
            log.setStatus(ApprovalStatus.PENDING);
        }

        VisitorLog savedLog = visitorLogRepository.save(log);

        // 6. Notify Residents and Create Approvals
        List<Resident> residents = residentRepository.findByFlat_FlatIdAndIsActiveTrue(flat.getFlatId());
        System.out.println("=================================================");
        System.out.println("VISITOR SERVICE: Notifying residents");
        System.out.println("Flat ID: " + flat.getFlatId());
        System.out.println("Flat Number: " + flat.getFlatNumber());
        System.out.println("Number of residents found: " + residents.size());
        System.out.println("=================================================");

        for (Resident resident : residents) {
            System.out.println("Processing resident: "
                    + (resident.getUser() != null ? resident.getUser().getFullName() : "NO USER"));

            // Create in-app approval request if not auto-approved
            if (!isAutoApproved) {
                VisitorApproval approval = VisitorApproval.builder()
                        .visitorLog(savedLog)
                        .resident(resident)
                        .status(ApprovalStatus.PENDING)
                        .requestedAt(LocalDateTime.now())
                        .requestedByUser(checkedInBy)
                        .build();
                visitorApprovalRepository.save(approval);
                System.out.println("  ✓ Created approval request for resident");
            }

            // Send Email Alert
            if (resident.getUser() != null && resident.getUser().getEmail() != null) {
                System.out.println("  → Calling emailService.sendVisitorAlert()");
                System.out.println("     Email: " + resident.getUser().getEmail());
                emailService.sendVisitorAlert(
                        resident.getUser().getEmail(),
                        resident.getUser().getFullName(),
                        visitor.getFullName(),
                        request.getPurpose());
                System.out.println("  ✓ Email service called successfully");
            } else {
                System.out.println("  ✗ SKIPPED: Resident has no user or email");
                if (resident.getUser() == null) {
                    System.out.println("     Reason: User is null");
                } else {
                    System.out.println("     Reason: Email is null");
                }
            }
        }
        System.out.println("=================================================");

        return mapToVisitorResponse(savedLog);
    }

    @Transactional
    public VisitorResponse checkOutVisitor(Long logId) {
        VisitorLog log = visitorLogRepository.findById(logId)
                .orElseThrow(() -> new NotFoundException("Visitor log not found"));

        if (log.getOutTime() != null) {
            throw new IllegalStateException("Visitor already checked out");
        }

        log.setOutTime(LocalDateTime.now());
        VisitorLog savedLog = visitorLogRepository.save(log);
        return mapToVisitorResponse(savedLog);
    }

    public List<VisitorResponse> getActiveVisitors() {
        return visitorLogRepository.findByOutTimeIsNull().stream()
                .map(this::mapToVisitorResponse)
                .collect(Collectors.toList());
    }

    // Multi-tenancy: Get active visitors by society
    public List<VisitorResponse> getActiveVisitorsBySociety(Long societyId) {
        return visitorLogRepository.findByOutTimeIsNullAndFlat_Building_Society_SocietyId(societyId)
                .stream()
                .map(this::mapToVisitorResponse)
                .collect(Collectors.toList());
    }

    public List<VisitorResponse> getAllVisitorLogs() {
        return visitorLogRepository.findAllByOrderByInTimeDesc().stream()
                .map(this::mapToVisitorResponse)
                .collect(Collectors.toList());
    }

    // Multi-tenancy: Get all visitor logs by society
    public List<VisitorResponse> getAllVisitorLogsBySociety(Long societyId) {
        return visitorLogRepository.findByFlat_Building_Society_SocietyIdOrderByInTimeDesc(societyId)
                .stream()
                .map(this::mapToVisitorResponse)
                .collect(Collectors.toList());
    }

    public List<VisitorResponse> getVisitorsByFlat(Long flatId) {
        return visitorLogRepository.findByFlatFlatId(flatId).stream()
                .map(this::mapToVisitorResponse)
                .collect(Collectors.toList());
    }

    // Search visitors by name
    public List<VisitorResponse> searchVisitorsByName(Long societyId, String name) {
        return visitorLogRepository
                .findByFlat_Building_Society_SocietyIdAndVisitor_FullNameContainingIgnoreCaseOrderByInTimeDesc(
                        societyId, name)
                .stream()
                .map(this::mapToVisitorResponse)
                .collect(Collectors.toList());
    }

    // Search visitors by phone
    public List<VisitorResponse> searchVisitorsByPhone(Long societyId, String phone) {
        return visitorLogRepository
                .findByFlat_Building_Society_SocietyIdAndVisitor_PhoneContainingOrderByInTimeDesc(
                        societyId, phone)
                .stream()
                .map(this::mapToVisitorResponse)
                .collect(Collectors.toList());
    }

    // Filter visitors by category
    public List<VisitorResponse> filterVisitorsByCategory(Long societyId, VisitorCategory category) {
        return visitorLogRepository
                .findByFlat_Building_Society_SocietyIdAndCategoryOrderByInTimeDesc(societyId, category)
                .stream()
                .map(this::mapToVisitorResponse)
                .collect(Collectors.toList());
    }

    // Filter visitors by date range
    public List<VisitorResponse> filterVisitorsByDateRange(Long societyId, LocalDateTime startDate,
            LocalDateTime endDate) {
        return visitorLogRepository
                .findByFlat_Building_Society_SocietyIdAndInTimeBetweenOrderByInTimeDesc(
                        societyId, startDate, endDate)
                .stream()
                .map(this::mapToVisitorResponse)
                .collect(Collectors.toList());
    }

    // Get overstaying visitors
    public List<VisitorResponse> getOverstayingVisitors(Long societyId) {
        return visitorLogRepository
                .findByOutTimeIsNullAndExpectedOutTimeBeforeAndFlat_Building_Society_SocietyId(
                        LocalDateTime.now(), societyId)
                .stream()
                .map(this::mapToVisitorResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public VisitorResponse updateVisitorStatus(Long logId, boolean isApproved) {
        VisitorLog log = visitorLogRepository.findById(logId)
                .orElseThrow(() -> new NotFoundException("Visitor log not found"));

        if (log.getStatus() != ApprovalStatus.PENDING) {
            throw new IllegalStateException("Visitor request is already processed");
        }

        if (isApproved) {
            log.setStatus(ApprovalStatus.APPROVED);
        } else {
            log.setStatus(ApprovalStatus.REJECTED);
            // Auto-checkout rejected visitors
            if (log.getOutTime() == null) {
                log.setOutTime(LocalDateTime.now());
            }
        }

        // Update all approval records for this visitor log
        List<VisitorApproval> approvals = visitorApprovalRepository.findByVisitorLog_LogId(logId);
        for (VisitorApproval approval : approvals) {
            if (approval.getStatus() == ApprovalStatus.PENDING) {
                approval.setStatus(isApproved ? ApprovalStatus.APPROVED : ApprovalStatus.REJECTED);
                approval.setRespondedAt(LocalDateTime.now());
                visitorApprovalRepository.save(approval);
            }
        }

        return mapToVisitorResponse(visitorLogRepository.save(log));
    }

    public VisitorResponse getVisitorLog(Long logId) {
        VisitorLog log = visitorLogRepository.findById(logId)
                .orElseThrow(() -> new NotFoundException("Visitor log not found"));
        return mapToVisitorResponse(log);
    }

    @Transactional
    public PreApproval createPreApproval(PreApproval preApproval) {
        if (preApproval.getResident() == null || preApproval.getResident().getResidentId() == null) {
            throw new com.ecanopy.exception.BadRequestException("Resident ID is required");
        }
        if (preApproval.getFlat() == null || preApproval.getFlat().getFlatId() == null) {
            throw new com.ecanopy.exception.BadRequestException("Flat ID is required");
        }

        Resident resident = residentRepository.findById(preApproval.getResident().getResidentId())
                .orElseThrow(() -> new NotFoundException("Resident not found"));

        Flat flat = flatRepository.findById(preApproval.getFlat().getFlatId())
                .orElseThrow(() -> new NotFoundException("Flat not found"));

        preApproval.setResident(resident);
        preApproval.setFlat(flat);

        String code = generateUniqueCode();
        preApproval.setCode(code);

        return preApprovalRepository.save(preApproval);
    }

    private String generateUniqueCode() {
        java.util.Random random = new java.util.Random();
        String code;
        do {
            code = String.format("%06d", random.nextInt(1000000));
        } while (preApprovalRepository.findByCodeAndIsUsedFalse(code).isPresent());
        return code;
    }

    // Get pending approvals for a resident
    public List<VisitorResponse> getPendingApprovalsForResident(Long residentId) {
        List<VisitorApproval> pendingApprovals = visitorApprovalRepository
                .findByResident_ResidentIdAndStatus(residentId, ApprovalStatus.PENDING);

        return pendingApprovals.stream()
                .map(approval -> mapToVisitorResponse(approval.getVisitorLog()))
                .collect(Collectors.toList());
    }

    private VisitorResponse mapToVisitorResponse(VisitorLog log) {
        String statusString = log.getStatus().name();
        if (log.getOutTime() != null) {
            statusString = "CHECKED_OUT";
        } else if (log.getStatus() == ApprovalStatus.APPROVED) {
            statusString = "CHECKED_IN";
        }

        return VisitorResponse.builder()
                .visitorId(log.getVisitor().getVisitorId())
                .logId(log.getLogId())
                .name(log.getVisitor().getFullName())
                .phone(log.getVisitor().getPhone())
                .category(log.getCategory())
                .purpose(log.getPurpose())
                .imageUrl(log.getVisitor().getPhotoUrl())
                .vehicleNumber(log.getVehicleNumber())
                .inTime(log.getInTime())
                .outTime(log.getOutTime())
                .expectedOutTime(log.getExpectedOutTime())
                .flatId(log.getFlat().getFlatId())
                .flatNumber(log.getFlat().getFlatNumber())
                .gateEntry(log.getGateEntry())
                .checkedInBy(log.getCheckedInBy() != null ? log.getCheckedInBy().getEmail() : null)
                .status(statusString)
                .build();
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getName() != null) {
            return userRepository.findByEmail(authentication.getName())
                    .orElse(null);
        }
        return null;
    }
}
