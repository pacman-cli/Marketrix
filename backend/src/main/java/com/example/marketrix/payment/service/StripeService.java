package com.example.marketrix.payment.service;

import com.example.marketrix.payment.enums.TransactionType;
import com.stripe.exception.StripeException;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

public interface StripeService {

    Map<String, String> createPaymentIntent(UUID userId, BigDecimal amount, TransactionType type) throws StripeException;

    void handlePaymentSuccess(String paymentIntentId);

    void handlePaymentFailure(String paymentIntentId);
}
