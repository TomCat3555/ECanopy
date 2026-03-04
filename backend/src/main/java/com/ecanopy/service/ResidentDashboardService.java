package com.ecanopy.service;

import com.ecanopy.dto.response.ResidentDashboardDTO;
import com.ecanopy.entity.Resident;
import com.ecanopy.entity.VisitorLog;
import com.ecanopy.entity.enums.BookingStatus;
import com.ecanopy.entity.enums.ComplaintStatus;
import com.ecanopy.exception.NotFoundException;
import com.ecanopy.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResidentDashboardService {

        private final ResidentRepository residentRepository;
        private final VisitorLogRepository visitorLogRepository;
        private final ComplaintRepository complaintRepository;
        private final AmenityBookingRepository amenityBookingRepository;
        private final MaintenanceBillRepository maintenanceBillRepository;
        private final NoticeRepository noticeRepository;

        public ResidentDashboardDTO getDashboardStats(Long userId) {
                Resident resident = residentRepository.findByUserId(userId)
                                .orElseThrow(() -> new NotFoundException(
                                                "Resident profile not found for user ID: " + userId));

                Long flatId = resident.getFlat().getFlatId();

                // 1. Pending Dues
                Double pendingDues = maintenanceBillRepository.findByFlatFlatId(flatId).stream()
                                .filter(bill -> bill.getStatus() != com.ecanopy.entity.enums.BillStatus.PAID)
                                .mapToDouble(bill -> bill.getTotalAmount().doubleValue())
                                .sum();

                // 2. Active Complaints
                long activeComplaints = complaintRepository.findByResidentResidentId(resident.getResidentId()).stream()
                                .filter(c -> c.getStatus() != ComplaintStatus.RESOLVED
                                                && c.getStatus() != ComplaintStatus.CLOSED)
                                .count();

                // 3. Upcoming Bookings
                long upcomingBookings = amenityBookingRepository
                                .findByResidentResidentIdOrderByBookingDateDesc(resident.getResidentId()).stream()
                                .filter(b -> b.getStatus() == BookingStatus.APPROVED
                                                && b.getBookingDate().isAfter(java.time.LocalDate.now().minusDays(1)))
                                .count();

                // 4. Recent Visitors
                List<VisitorLog> recentLogs = visitorLogRepository.findByFlatFlatId(flatId);
                List<ResidentDashboardDTO.VisitorLogDTO> visitorDTOs = recentLogs.stream()
                                .sorted((a, b) -> b.getInTime().compareTo(a.getInTime()))
                                .limit(5)
                                .map(log -> ResidentDashboardDTO.VisitorLogDTO.builder()
                                                .visitorName(log.getVisitor().getFullName())
                                                .visitorType(log.getCategory() != null ? log.getCategory().name()
                                                                : "Visitor")
                                                .checkInTime(log.getInTime()
                                                                .format(DateTimeFormatter.ofPattern("dd MMM, hh:mm a")))
                                                .status(log.getOutTime() == null ? "Inside" : "Left")
                                                .build())
                                .collect(Collectors.toList());

                // 5. Unread Notices (Count all active notices for simplicity now)
                long activeNotices = noticeRepository.findAll().stream()
                                .filter(n -> n.getValidUntil() == null
                                                || n.getValidUntil().isAfter(LocalDateTime.now()))
                                .count();

                return ResidentDashboardDTO.builder()
                                .pendingDues(pendingDues)
                                .activeComplaints(activeComplaints)
                                .upcomingBookings(upcomingBookings)
                                .unreadNotices(activeNotices)
                                .recentVisitors(visitorDTOs)
                                .build();
        }

        public Resident getResidentByUserId(Long userId) {
                return residentRepository.findByUserId(userId)
                                .orElseThrow(() -> new NotFoundException(
                                                "Resident profile not found for user ID: " + userId));
        }
}
