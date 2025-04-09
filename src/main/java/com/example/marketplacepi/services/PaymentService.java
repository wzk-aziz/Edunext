package com.example.marketplacepi.services;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
@RequiredArgsConstructor
@Slf4j
@Service
public class PaymentService {
    private static final String STRIPE_SECRET_KEY = "sk_test_51QwtvpR88uyR8EQrYez00QJUHRPxjECpBQD1SQ0Tutt3x6Z30F6b53zIHdvluMlyAagRglDWqg6hqItvkXck3fg500qvefSgf1";

    static {
        Stripe.apiKey = STRIPE_SECRET_KEY;
    }

    public PaymentIntent createPaymentIntent(Long amount, String currency) throws StripeException {
        Map<String, Object> params = new HashMap<>();
        params.put("amount", amount * 100);
        params.put("currency", currency);
        return PaymentIntent.create(params);
    }
}