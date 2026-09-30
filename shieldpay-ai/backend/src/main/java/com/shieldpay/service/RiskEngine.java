package com.shieldpay.service;

import com.shieldpay.dto.RiskSignalResponse;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RiskEngine {

    public static class EvaluationResult {
        private int riskScore;
        private String riskLevel;
        private String scamCategory;
        private String confidence;
        private List<RiskSignalResponse> signals;

        public EvaluationResult(int riskScore, String riskLevel, String scamCategory, String confidence, List<RiskSignalResponse> signals) {
            this.riskScore = riskScore;
            this.riskLevel = riskLevel;
            this.scamCategory = scamCategory;
            this.confidence = confidence;
            this.signals = signals;
        }

        public int getRiskScore() {
            return riskScore;
        }

        public String getRiskLevel() {
            return riskLevel;
        }

        public String getScamCategory() {
            return scamCategory;
        }

        public String getConfidence() {
            return confidence;
        }

        public List<RiskSignalResponse> getSignals() {
            return signals;
        }
    }

    public EvaluationResult evaluateSignals(List<RiskSignalResponse> rawSignals) {
        // Deduplicate signals by signal name, keeping highest score if duplicates exist
        Map<String, RiskSignalResponse> uniqueSignals = new LinkedHashMap<>();
        for (RiskSignalResponse sig : rawSignals) {
            if (!uniqueSignals.containsKey(sig.getName()) || uniqueSignals.get(sig.getName()).getScore() < sig.getScore()) {
                uniqueSignals.put(sig.getName(), sig);
            }
        }

        int totalScore = 0;
        for (RiskSignalResponse sig : uniqueSignals.values()) {
            totalScore += sig.getScore();
        }

        // Cap at 100
        int finalScore = Math.min(totalScore, 100);

        // Determine Risk Level
        String riskLevel;
        if (finalScore <= 30) {
            riskLevel = "LOW";
        } else if (finalScore <= 60) {
            riskLevel = "MEDIUM";
        } else {
            riskLevel = "HIGH";
        }

        // Determine Scam Category based on highest weighted signals
        String category = determineScamCategory(uniqueSignals.keySet());
        String confidence = calculateConfidence(finalScore, uniqueSignals.size());

        return new EvaluationResult(
                finalScore,
                riskLevel,
                category,
                confidence,
                new ArrayList<>(uniqueSignals.values())
        );
    }

    private String determineScamCategory(Set<String> signalNames) {
        if (signalNames.contains("Credential Request Trap") || signalNames.contains("Credential Request")) {
            return "Credential Harvesting Phishing";
        }
        if (signalNames.contains("Coercive Threat & Intimidation")) {
            if (signalNames.contains("Upfront Advance Fee Demand")) {
                return "Digital Arrest / Law Enforcement Extortion";
            }
            if (signalNames.contains("Manufactured Time Urgency") || signalNames.contains("Unsolicited Payment Demand")) {
                return "Utility Disconnection / Account Threat Extortion";
            }
            return "Coercive Intimidation / Extortion";
        }
        if (signalNames.contains("Task / Part-Time Job Social Engineering")) {
            return "Work-From-Home / Task Scam";
        }
        if (signalNames.contains("Reverse-Charge Deception Bait") || signalNames.contains("Fake Refund")) {
            return "Fake Refund / Reverse-Charge Fraud";
        }
        if (signalNames.contains("Upfront Advance Fee Demand") || signalNames.contains("Advance Fee")) {
            return "Advance-Fee Fraud";
        }
        if (signalNames.contains("Unsolicited Prize / Reward Bait") || signalNames.contains("Prize / Reward Claim")) {
            return "Lottery / Prize Bait Scam";
        }
        if (signalNames.contains("Institutional Impersonation") || signalNames.contains("Customer Support Payment Demand")) {
            return "Executive / Support Impersonation";
        }
        if (signalNames.contains("QR Payment Request") || signalNames.contains("Reverse Charge QR")) {
            return "QR Reverse-Charge Scam";
        }
        if (signalNames.contains("Brand Masquerading Domain") || signalNames.contains("Direct Executable / Malware Download Target")) {
            return "Brand Masquerading / Phishing Portal";
        }
        if (signalNames.contains("Manufactured Time Urgency") && signalNames.contains("Unsolicited Payment Demand")) {
            return "Urgent Payment Coercion";
        }
        if (signalNames.contains("Standard Informational Transaction Receipt")) {
            return "Authentic Bank Notification / Receipt (VERIFIED REAL)";
        }
        return "General Financial Communication";
    }

    private String calculateConfidence(int score, int signalCount) {
        if (score >= 60 && signalCount >= 2) {
            return "HIGH";
        }
        if (score >= 30) {
            return "MEDIUM";
        }
        return "HIGH";
    }
}
