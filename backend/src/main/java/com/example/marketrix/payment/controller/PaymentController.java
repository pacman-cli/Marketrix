package com.example.marketrix.payment.controller;

import com.example.marketrix.payment.enums.TransactionType;
import com.example.marketrix.payment.service.StripeService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequiredArgsConstructor
public class PaymentController {

    private final StripeService stripeService;

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    @PostMapping("/api/payments/create-intent")
    public ResponseEntity<Map<String, String>> createPaymentIntent(Authentication auth, @RequestBody Map<String, Object> body) throws StripeException {
        UUID userId = (UUID) auth.getPrincipal();
        BigDecimal amount = new BigDecimal(body.get("amount").toString());
        TransactionType type = TransactionType.valueOf((String) body.get("type"));
        return ResponseEntity.ok(stripeService.createPaymentIntent(userId, amount, type));
    }

    @PostMapping("/api/webhooks/stripe")
    public ResponseEntity<String> handleWebhook(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
            switch (event.getType()) {
                case "payment_intent.succeeded" -> {
                    PaymentIntent pi = (PaymentIntent) event.getDataObjectDeserializer().getObject().orElse(null);
                    if (pi != null) stripeService.handlePaymentSuccess(pi.getId());
                }
                case "payment_intent.payment_failed" -> {
                    PaymentIntent pi = (PaymentIntent) event.getDataObjectDeserializer().getObject().orElse(null);
                    if (pi != null) stripeService.handlePaymentFailure(pi.getId());
                }
                default -> log.debug("Unhandled event type: {}", event.getType());
            }
            return ResponseEntity.ok("ok");
        } catch (SignatureVerificationException e) {
            log.error("Webhook signature verification failed", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        }
    }
}
