package com.example.marketrix.payment.repository;

import com.example.marketrix.payment.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    Optional<Transaction> findByStripePaymentId(String stripePaymentId);
}
