package com.ecanopy.dto.request;

import lombok.Data;

/**
 * Request DTO for verifying Razorpay payment
 */
@Data
public class PaymentVerificationRequest {
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
    private Long billId;
}
