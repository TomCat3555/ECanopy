package com.ecanopy.service;

import com.ecanopy.entity.*;
import com.ecanopy.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class DomesticHelpService {

    private final DomesticHelpRepository domesticHelpRepository;
    private final SocietyRepository societyRepository;
    private final DailyHelpLogRepository dailyHelpLogRepository;
    private final UserRepository userRepository;
    private final FlatRepository flatRepository;

    public List<DomesticHelp> getAllStaff(Long societyId) {
        return domesticHelpRepository.findBySocietySocietyId(societyId);
    }

    @Transactional
    public Map<String, Object> recordStaffAccess(String passCode, String scannedBy) {
        DomesticHelp staff = domesticHelpRepository.findByPassCode(passCode)
                .orElseThrow(() -> new com.ecanopy.exception.NotFoundException("Invalid Pass Code"));

        if (!staff.getIsActive()) {
            throw new IllegalStateException("Staff member is inactive");
        }

        User guard = userRepository.findByEmail(scannedBy).orElse(null);
        Optional<DailyHelpLog> activeLog = dailyHelpLogRepository
                .findTopByDomesticHelp_HelpIdAndExitTimeIsNullOrderByEntryTimeDesc(staff.getHelpId());

        String type;
        if (activeLog.isPresent()) {
            // Record Exit
            DailyHelpLog log = activeLog.get();
            log.setExitTime(LocalDateTime.now());
            dailyHelpLogRepository.save(log);
            type = "EXIT";
        } else {
            // Record Entry
            DailyHelpLog log = DailyHelpLog.builder()
                    .domesticHelp(staff)
                    .guard(guard)
                    .entryTime(LocalDateTime.now())
                    .build();
            dailyHelpLogRepository.save(log);
            type = "ENTRY";
        }

        Map<String, Object> response = new HashMap<>();
        response.put("name", staff.getName());
        response.put("role", staff.getHelpType().name());
        response.put("type", type);
        response.put("timestamp", LocalDateTime.now());
        response.put("status", "SUCCESS");
        return response;
    }

    public DomesticHelp addStaff(DomesticHelp staff, Long societyId) {
        Society society = societyRepository.findById(societyId)
                .orElseThrow(() -> new com.ecanopy.exception.NotFoundException("Society not found"));

        staff.setSociety(society);
        if (staff.getPassCode() == null || staff.getPassCode().isEmpty()) {
            staff.setPassCode(generateUniquePassCode());
        }
        return domesticHelpRepository.save(staff);
    }

    public List<DomesticHelp> getStaffByFlat(Long flatId) {
        return domesticHelpRepository.findByFlats_FlatId(flatId);
    }

    public void deleteStaff(Long staffId) {
        if (!domesticHelpRepository.existsById(staffId)) {
            throw new com.ecanopy.exception.NotFoundException("Staff not found");
        }
        domesticHelpRepository.deleteById(staffId);
    }

    @Transactional
    public void linkStaffToFlat(Long staffId, Long flatId) {
        DomesticHelp staff = domesticHelpRepository.findById(staffId)
                .orElseThrow(() -> new com.ecanopy.exception.NotFoundException("Staff not found"));
        Flat flat = flatRepository.findById(flatId)
                .orElseThrow(() -> new com.ecanopy.exception.NotFoundException("Flat not found"));

        staff.getFlats().add(flat);
        domesticHelpRepository.save(staff);
    }

    @Transactional
    public void unlinkStaffFromFlat(Long staffId, Long flatId) {
        DomesticHelp staff = domesticHelpRepository.findById(staffId)
                .orElseThrow(() -> new com.ecanopy.exception.NotFoundException("Staff not found"));
        Flat flat = flatRepository.findById(flatId)
                .orElseThrow(() -> new com.ecanopy.exception.NotFoundException("Flat not found"));

        staff.getFlats().remove(flat);
        domesticHelpRepository.save(staff);
    }

    private String generateUniquePassCode() {
        Random random = new Random();
        String code;
        do {
            code = String.format("%06d", random.nextInt(1000000));
        } while (domesticHelpRepository.existsByPassCode(code));
        return code;
    }
}
