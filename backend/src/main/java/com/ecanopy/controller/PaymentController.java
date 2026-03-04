package com.ecanopy.controller;

import com.ecanopy.dto.request.PaymentOrderRequest;
import com.ecanopy.dto.request.PaymentVerificationRequest;
import com.ecanopy.dto.response.PaymentOrderResponse;
import com.ecanopy.entity.Payment;
import com.ecanopy.service.PaymentService;
import com.razorpay.RazorpayException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Payment Controller
 * Handles Razorpay payment gateway integration endpoints
 */
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Razorpay Payment Gateway Integration")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    @PreAuthorize("hasRole('RESIDENT')")
    @Operation(summary = "Create Payment Order", description = "Create Razorpay order for bill payment")
    public ResponseEntity<PaymentOrderResponse> createOrder(@RequestBody PaymentOrderRequest request)
            throws RazorpayException {
        return ResponseEntity.ok(paymentService.createPaymentOrder(request));
    }

    @PostMapping("/verify")
    @PreAuthorize("hasRole('RESIDENT')")
    @Operation(summary = "Verify Payment", description = "Verify Razorpay payment signature and update bill status")
    public ResponseEntity<Payment> verifyPayment(@RequestBody PaymentVerificationRequest request) {
        return ResponseEntity.ok(paymentService.verifyAndUpdatePayment(request));
    }
}
