package com.ecanopy.dto.response;

import com.ecanopy.entity.enums.BillStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class MaintenanceBillResponse {
    private Long billId;
    private LocalDate billMonth;
    private BigDecimal totalAmount;
    private LocalDate dueDate;
    private BillStatus status;
    private String flatNumber; // Add more flat details if needed
    private String residentName; // Optional, useful for Admin

    // Receipt details
    private String societyName;
    private String societyAddress;
    private LocalDate paidDate;
    private BigDecimal waterCharges;
    private BigDecimal parkingCharges;
    private BigDecimal sinkingFund;
    private BigDecimal electricityCharges;
    private BigDecimal penalties;
}
