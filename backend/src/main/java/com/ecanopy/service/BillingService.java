package com.ecanopy.service;

import com.ecanopy.entity.Flat;
import com.ecanopy.entity.MaintenanceBill;
import com.ecanopy.entity.enums.BillStatus;
import com.ecanopy.repository.FlatRepository;
import com.ecanopy.repository.MaintenanceBillRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import com.ecanopy.dto.response.MaintenanceBillResponse;

@Service
@RequiredArgsConstructor
@Slf4j
public class BillingService {

    private final MaintenanceBillRepository maintenanceBillRepository;
    private final FlatRepository flatRepository;
    private final com.ecanopy.repository.UserRepository userRepository;
    private final AuthService authService;
    private final com.ecanopy.repository.ResidentRepository residentRepository;

    public BigDecimal getTotalPendingDues() {
        BigDecimal total = maintenanceBillRepository.sumTotalAmountByStatus(BillStatus.PENDING);
        return total != null ? total : BigDecimal.ZERO;
    }

    public BigDecimal getTotalPendingDuesBySociety(Long societyId) {
        BigDecimal total = maintenanceBillRepository.sumTotalAmountBySocietyAndStatus(societyId, BillStatus.PENDING);
        return total != null ? total : BigDecimal.ZERO;
    }

    public List<MaintenanceBillResponse> getAllBills() {
        com.ecanopy.entity.User currentUser = userRepository.findByEmail(authService.getCurrentUser().getEmail())
                .orElseThrow(() -> new com.ecanopy.exception.NotFoundException("User not found"));

        if (currentUser.getRoles().stream().anyMatch(r -> r.getName().equals("ROLE_SUPER_ADMIN"))) {
            return maintenanceBillRepository.findAll().stream()
                    .map(this::mapToResponse)
                    .toList();
        }

        Long societyId = null;
        if (currentUser.getSocietyId() != null) {
            societyId = currentUser.getSocietyId();
        } else {
            com.ecanopy.entity.Resident resident = residentRepository.findByUserId(currentUser.getId())
                    .orElseThrow(() -> new com.ecanopy.exception.NotFoundException(
                            "User is not associated with any society"));
            societyId = resident.getFlat().getBuilding().getSociety().getSocietyId();
        }

        return maintenanceBillRepository.findByFlatBuildingSocietySocietyId(societyId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<MaintenanceBillResponse> getBillsByFlat(Long flatId) {
        return maintenanceBillRepository.findByFlatFlatId(flatId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    private MaintenanceBillResponse mapToResponse(MaintenanceBill bill) {
        String residentName = "Unoccupied";

        // Fetch residents for the flat
        List<com.ecanopy.entity.Resident> residents = residentRepository.findByFlatFlatId(bill.getFlat().getFlatId());

        // Prefer active residents, else take the first one
        if (!residents.isEmpty()) {
            com.ecanopy.entity.Resident resident = residents.stream()
                    .filter(r -> Boolean.TRUE.equals(r.getIsActive()))
                    .findFirst()
                    .orElse(residents.get(0));
            residentName = resident.getUser().getFullName();
        }

        return MaintenanceBillResponse.builder()
                .billId(bill.getBillId())
                .billMonth(bill.getBillMonth())
                .totalAmount(bill.getTotalAmount())
                .dueDate(bill.getDueDate())
                .status(bill.getStatus())
                .flatNumber(bill.getFlat().getFlatNumber())
                .residentName(residentName)
                .societyName(bill.getFlat().getBuilding().getSociety().getSocietyName())
                .societyAddress(bill.getFlat().getBuilding().getSociety().getAddress())
                .paidDate(bill.getPaidDate())
                .waterCharges(bill.getWaterCharges())
                .parkingCharges(bill.getParkingCharges())
                .sinkingFund(bill.getSinkingFund())
                .electricityCharges(bill.getElectricityCharges())
                .penalties(bill.getPenalties())
                .build();
    }

    @Transactional
    public void generateMonthlyBills(Long societyId, BigDecimal ratePerSqFt) {
        List<Flat> flats = flatRepository.findByBuildingSocietySocietyId(societyId);

        if (flats.isEmpty()) {
            throw new com.ecanopy.exception.NotFoundException("No flats found for this society");
        }

        LocalDate today = LocalDate.now();
        LocalDate dueDate = today.plusDays(15);

        for (Flat flat : flats) {
            BigDecimal area = flat.getArea() != null ? flat.getArea() : BigDecimal.valueOf(1000); // Default 1000 sqft
            BigDecimal amount = area.multiply(ratePerSqFt);

            MaintenanceBill bill = MaintenanceBill.builder()
                    .billMonth(today.withDayOfMonth(1))
                    .flat(flat)
                    .totalAmount(amount)
                    .dueDate(dueDate)
                    .status(BillStatus.PENDING)
                    .build();

            maintenanceBillRepository.save(bill);
        }
        log.info("Generated bills for {} flats in society {}", flats.size(), societyId);
    }

    @Transactional
    public void markBillAsPaid(Long billId) {
        MaintenanceBill bill = maintenanceBillRepository.findById(billId)
                .orElseThrow(() -> new com.ecanopy.exception.NotFoundException("Bill not found"));

        bill.setStatus(BillStatus.PAID);
        bill.setPaidDate(LocalDate.now());
        maintenanceBillRepository.save(bill);
    }
}
