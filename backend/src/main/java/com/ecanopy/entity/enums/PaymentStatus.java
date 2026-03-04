package com.ecanopy.entity.enums;

/**
 * Payment Status Enum
 * Tracks the status of a payment transaction
 */
public enum PaymentStatus {
    CREATED, // Order created, payment not yet initiated
    PENDING, // Payment initiated, awaiting confirmation
    SUCCESS, // Payment successful and verified
    COMPLETED, // Legacy status, same as SUCCESS
    FAILED // Payment failed
}
