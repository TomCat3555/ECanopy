package com.ecanopy.dto.request;

import lombok.Data;

/**
 * Request DTO for creating a Razorpay payment order
 */
@Data
public class PaymentOrderRequest {
    private Long billId;
    private Long userId;
}
