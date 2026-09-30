package com.shieldpay.service;

import com.shieldpay.dto.RiskSignalResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExplanationService {

    public String generateExplanation(String category, int score, List<RiskSignalResponse> signals) {
        if (signals.isEmpty() || score <= 20) {
            return "AUTHENTIC / REAL COMMUNICATION: No deceptive social engineering or threat indicators were detected in this message. It exhibits characteristics of a legitimate informational notification, automated transaction receipt, or benign peer conversation. Standard routine caution applies.";
        }

        List<String> names = signals.stream().map(RiskSignalResponse::getName).collect(Collectors.toList());
        StringBuilder sb = new StringBuilder();
        sb.append("SCAM WARNING: This situation contains prominent social engineering defects. ");

        if (names.contains("Credential Request Trap") || names.contains("Credential Request")) {
            sb.append("CRITICAL SECURITY DEFECT: The message asks for secret authorization factors (such as OTP, UPI PIN, or CVV). In digital banking architecture, your PIN is entered ONLY to authorize outgoing payments, NEVER to receive funds, verify KYC, or cancel debits. ");
        } else if (names.contains("Coercive Threat & Intimidation") && names.contains("Manufactured Time Urgency")) {
            sb.append("The message leverages psychological coercion by manufacturing severe consequences (such as immediate electricity disconnection, bank account blocking, or digital arrest) within an artificial deadline. Scammers use panic to bypass your rational verification checks. ");
        } else if (names.contains("Upfront Advance Fee Demand") || names.contains("Unsolicited Prize / Reward Bait")) {
            sb.append("The scenario baits you with a prize, loan, or reward but demands an upfront registration, clearance, or courier fee. Legitimate organizations NEVER require advance payments to release winnings or loans. ");
        } else if (names.contains("Reverse-Charge Deception Bait") || names.contains("Fake Refund")) {
            sb.append("The sender promises a refund or cashback but tricks you into taking action. In UPI protocols, genuine refunds are credited directly to your bank account without requiring you to scan QR codes or approve collect requests. ");
        } else if (names.contains("Task / Part-Time Job Social Engineering")) {
            sb.append("This matches classic online task fraud: promising high daily earnings for trivial online work, then demanding advance deposits to 'unlock' earned balances. ");
        } else {
            sb.append("Detected manipulative signals include: ").append(String.join(", ", names)).append(". ");
            sb.append("When unexpected payment demands coincide with unverified senders, probability of fraud is extremely high. ");
        }

        sb.append("Do NOT send money or click provided links. Verify independently via official customer support.");
        return sb.toString();
    }

    public String generateRecommendation(String category, int score, List<RiskSignalResponse> signals) {
        if (score >= 61) {
            return "DO NOT SEND MONEY. Pause and contact the institution using the official phone number or website from your physical card or official app. Do not dial numbers provided in this message.";
        } else if (score >= 31) {
            return "Exercise caution. Confirm the recipient's identity through a separate, trusted communication method. Verify if this fee or request is officially documented before authorizing payment.";
        } else {
            return "Standard precaution: verify the recipient name on your payment app before entering your PIN.";
        }
    }
}
