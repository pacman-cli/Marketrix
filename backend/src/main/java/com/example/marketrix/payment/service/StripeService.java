package com.example.marketrix.payment.service;

import com.example.marketrix.payment.entity.Transaction;
import com.example.marketrix.payment.enums.TransactionStatus;
import com.example.marketrix.payment.enums.TransactionType;
import com.example.marketrix.payment.repository.TransactionRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class StripeService {

    private final TransactionRepository transactionRepo;

    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    @PostConstruct
    public void init() {
        if (stripeSecretKey != null && !stripeSecretKey.isBlank()) {
            Stripe.apiKey = stripeSecretKey;
        }
    }

    public Map<String, String> createPaymentIntent(UUID userId, BigDecimal amount, TransactionType type) throws StripeException {
        long amountInCents = amount.multiply(BigDecimal.valueOf(100)).longValue();

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency("usd")
                .putMetadata("userId", userId.toString())
                .putMetadata("type", type.name())
                .build();

        PaymentIntent intent = PaymentIntent.create(params);

        Transaction transaction = Transaction.builder()
                .userId(userId)
                .type(type)
                .amount(amount)
                .stripePaymentId(intent.getId())
                .build();
        transactionRepo.save(transaction);

        return Map.of("clientSecret", intent.getClientSecret(), "paymentIntentId", intent.getId());
    }

    public void handlePaymentSuccess(String paymentIntentId) {
        transactionRepo.findByStripePaymentId(paymentIntentId).ifPresent(tx -> {
            tx.setStatus(TransactionStatus.COMPLETED);
            transactionRepo.save(tx);
            log.info("Payment completed: {}", paymentIntentId);
        });
    }

    public void handlePaymentFailure(String paymentIntentId) {
        transactionRepo.findByStripePaymentId(paymentIntentId).ifPresent(tx -> {
            tx.setStatus(TransactionStatus.FAILED);
            transactionRepo.save(tx);
            log.warn("Payment failed: {}", paymentIntentId);
        });
    }
}
