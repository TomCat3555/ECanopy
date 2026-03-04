package com.ecanopy.service;

import com.ecanopy.dto.request.PaymentOrderRequest;
import com.ecanopy.dto.request.PaymentVerificationRequest;
import com.ecanopy.dto.response.PaymentOrderResponse;
import com.ecanopy.entity.MaintenanceBill;
import com.ecanopy.entity.Payment;
import com.ecanopy.entity.User;
import com.ecanopy.entity.enums.BillStatus;
import com.ecanopy.entity.enums.PaymentStatus;
import com.ecanopy.exception.NotFoundException;
import com.ecanopy.repository.MaintenanceBillRepository;
import com.ecanopy.repository.PaymentRepository;
import com.ecanopy.repository.UserRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Payment Service
 * Handles Razorpay payment gateway integration
 */
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final RazorpayClient razorpayClient;
    private final PaymentRepository paymentRepository;
    private final MaintenanceBillRepository billRepository;
    private final UserRepository userRepository;

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Value("${razorpay.currency}")
    private String currency;

    @Value("${razorpay.company.name}")
    private String companyName;

    /**
     * Create Razorpay payment order
     * 
     * @param request Payment order request with billId and userId
     * @return Payment order response with orderId, amount, key for frontend
     */
    @Transactional
    public PaymentOrderResponse createPaymentOrder(PaymentOrderRequest request) throws RazorpayException {
        // 1. Fetch bill
        MaintenanceBill bill = billRepository.findById(request.getBillId())
                .orElseThrow(() -> new NotFoundException("Bill not found"));

        if (bill.getStatus() == BillStatus.PAID) {
            throw new RuntimeException("Bill already paid");
        }

        // 2. Fetch user
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new NotFoundException("User not found"));

        // 3. Create Razorpay Order
        JSONObject orderRequest = new JSONObject();
        // Convert amount to paise (₹100 = 10000 paise)
        orderRequest.put("amount", bill.getTotalAmount().multiply(new BigDecimal(100)).intValue());
        orderRequest.put("currency", currency);
        orderRequest.put("receipt", "bill_" + bill.getBillId());

        Order razorpayOrder = razorpayClient.orders.create(orderRequest);

        // 4. Save Payment record with CREATED status
        Payment payment = Payment.builder()
                .amount(bill.getTotalAmount())
                .status(PaymentStatus.CREATED)
                .razorpayOrderId(razorpayOrder.get("id"))
                .maintenanceBill(bill)
                .paidByUser(user)
                .build();

        paymentRepository.save(payment);

        // 5. Return order details for frontend
        return PaymentOrderResponse.builder()
                .orderId(razorpayOrder.get("id"))
                .amount(razorpayOrder.get("amount"))
                .currency(razorpayOrder.get("currency"))
                .key(keyId)
                .companyName(companyName)
                .build();
    }

    /**
     * Verify payment signature and update payment status
     * 
     * @param request Verification request with orderId, paymentId, signature
     * @return Updated payment entity
     */
    @Transactional
    public Payment verifyAndUpdatePayment(PaymentVerificationRequest request) {
        // 1. Verify signature
        String generatedSignature = generateSignature(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId());

        if (!generatedSignature.equals(request.getRazorpaySignature())) {
            // Mark payment as failed
            Payment payment = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                    .orElseThrow(() -> new NotFoundException("Payment not found"));
            payment.setStatus(PaymentStatus.FAILED);
            payment.setRemarks("Signature verification failed");
            paymentRepository.save(payment);
            throw new RuntimeException("Invalid payment signature");
        }

        // 2. Find payment by order ID
        Payment payment = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new NotFoundException("Payment not found"));

        // 3. Update payment
        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setRazorpaySignature(request.getRazorpaySignature());
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setPaidAt(LocalDateTime.now());
        payment.setTransactionId(request.getRazorpayPaymentId()); // Store payment ID as transaction ID

        // 4. Update bill status
        MaintenanceBill bill = payment.getMaintenanceBill();
        bill.setStatus(BillStatus.PAID);
        bill.setPaidDate(LocalDate.now());

        billRepository.save(bill);
        return paymentRepository.save(payment);
    }

    /**
     * Generate HMAC SHA256 signature for verification
     * 
     * @param orderId   Razorpay order ID
     * @param paymentId Razorpay payment ID
     * @return Generated signature
     */
    private String generateSignature(String orderId, String paymentId) {
        try {
            String payload = orderId + "|" + paymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(keySecret.getBytes(), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hash = mac.doFinal(payload.getBytes());

            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1)
                    hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error generating signature", e);
        }
    }
}
