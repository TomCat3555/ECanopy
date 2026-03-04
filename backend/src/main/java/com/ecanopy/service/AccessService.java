package com.ecanopy.service;

import com.ecanopy.entity.AccessLog;
import com.ecanopy.entity.DomesticHelp;
import com.ecanopy.entity.User;
import com.ecanopy.entity.enums.AccessType;
import com.ecanopy.exception.NotFoundException;
import com.ecanopy.repository.AccessRepository;
import com.ecanopy.repository.DomesticHelpRepository;
import com.ecanopy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AccessService {

    private final AccessRepository accessRepository;
    private final UserRepository userRepository;
    private final DomesticHelpRepository domesticHelpRepository;
    private final VisitorService visitorService;

    @Transactional
    public Map<String, Object> validateQr(String token, String scannedBy) {
        // Check for Pre-Approval Code (6 digits)
        if (token.matches("\\d{6}")) {
            return visitorService.checkInByPreApprovalCode(token, scannedBy);
        }

        // Token Format: TYPE:ID:NAME (Simple for now)
        // e.g., RESIDENT:101:JohnDoe or HELP:5:MaidName

        String[] parts = token.split(":");
        if (parts.length < 3) {
            throw new IllegalArgumentException("Invalid QR Code");
        }

        String type = parts[0];
        Long id = Long.parseLong(parts[1]);
        String name = parts[2];

        Map<String, Object> response = new HashMap<>();
        response.put("name", name);
        response.put("type", type);
        response.put("status", "GRANTED");

        if ("RESIDENT".equals(type)) {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new NotFoundException("Resident not found"));

            response.put("name", user.getFullName()); // Ensure name comes from DB

            // Logic to toggle Entry/Exit
            Optional<AccessLog> lastLog = accessRepository.findTopByUserOrderByTimestampDesc(user);
            AccessType nextAction = (lastLog.isPresent() && lastLog.get().getAccessType() == AccessType.ENTRY)
                    ? AccessType.EXIT
                    : AccessType.ENTRY;

            AccessLog log = new AccessLog();
            log.setUser(user);
            log.setAccessType(nextAction);
            log.setTimestamp(LocalDateTime.now());
            log.setScannedBy(scannedBy);
            accessRepository.save(log);

            response.put("accessType", nextAction);

        } else if ("HELP".equals(type)) {
            DomesticHelp help = domesticHelpRepository.findById(id)
                    .orElseThrow(() -> new NotFoundException("Staff not found"));

            Optional<AccessLog> lastLog = accessRepository.findTopByDomesticHelpOrderByTimestampDesc(help);
            AccessType nextAction = (lastLog.isPresent() && lastLog.get().getAccessType() == AccessType.ENTRY)
                    ? AccessType.EXIT
                    : AccessType.ENTRY;

            AccessLog log = new AccessLog();
            log.setDomesticHelp(help);
            log.setAccessType(nextAction);
            log.setTimestamp(LocalDateTime.now());
            log.setScannedBy(scannedBy);
            accessRepository.save(log);

            response.put("accessType", nextAction);
        } else {
            throw new IllegalArgumentException("Unknown User Type");
        }

        return response;
    }
}
