package com.shieldpay.service;

import com.shieldpay.dto.RiskSignalResponse;
import com.shieldpay.dto.ScanRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PaymentAnalyzer {

    public List<RiskSignalResponse> analyzePaymentContext(ScanRequest request) {
        List<RiskSignalResponse> signals = new ArrayList<>();

        // Check Sender Type
        if (request.getSenderType() != null) {
            String type = request.getSenderType().trim();
            if (type.equalsIgnoreCase("Unknown Person") || type.equalsIgnoreCase("Unknown")) {
                signals.add(new RiskSignalResponse(
                        "Unknown Sender",
                        "MEDIUM",
                        10,
                        "The payment request is from an unknown or unverified individual."
                ));
            } else if (type.equalsIgnoreCase("Customer Support")) {
                // Legitimate customer support NEVER asks customers to pay money to personal UPI or accounts
                signals.add(new RiskSignalResponse(
                        "Customer Support Payment Demand",
                        "HIGH",
                        20,
                        "Official customer support representatives almost never instruct users to pay money to verify identity or resolve issues."
                ));
            }
        }

        // Check Payment Method Context
        if (request.getPaymentMethod() != null) {
            String method = request.getPaymentMethod().trim();
            if (method.equalsIgnoreCase("UPI") && request.getAmount() != null && request.getAmount() > 10000) {
                signals.add(new RiskSignalResponse(
                        "High-Value Instant Transfer",
                        "MEDIUM",
                        10,
                        "Instant UPI transfers above ₹10,000 are difficult or impossible to reverse once completed."
                ));
            }
        }

        // Check Amount characteristics (e.g. 1 rupee test scam)
        if (request.getAmount() != null) {
            if (request.getAmount() == 1.0 || request.getAmount() == 2.0 || request.getAmount() == 5.0) {
                signals.add(new RiskSignalResponse(
                        "Micro-Payment Verification Bait",
                        "HIGH",
                        15,
                        "Requesting a token ₹1 or ₹5 transfer is a classic trick used to bind UPI autopay mandates or trick users into entering their PIN."
                ));
            }
        }

        return signals;
    }
}
