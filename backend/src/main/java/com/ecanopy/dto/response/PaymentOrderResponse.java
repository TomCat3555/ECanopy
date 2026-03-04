package com.ecanopy.dto.response;

import lombok.Builder;
import lombok.Data;

/**
 * Response DTO for Razorpay payment order creation
 * Contains order details needed by frontend to initiate payment
 */
@Data
@Builder
public class PaymentOrderResponse {
    private String orderId; // Razorpay order ID
    private Long amount; // Amount in paise (₹100 = 10000 paise)
    private String currency; // Currency code (INR)
    private String key; // Razorpay Key ID for frontend
    private String companyName; // Company name for checkout display
}
