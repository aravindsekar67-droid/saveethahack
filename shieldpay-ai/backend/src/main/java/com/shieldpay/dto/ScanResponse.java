package com.shieldpay.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ScanResponse {
    private Long id;
    private int riskScore;
    private String riskLevel;       // LOW, MEDIUM, HIGH
    private String scamCategory;
    private String confidence;      // LOW, MEDIUM, HIGH
    private List<RiskSignalResponse> signals = new ArrayList<>();
    private String explanation;
    private String recommendation;
    private Boolean privacyMode;
    private LocalDateTime createdAt;
    private Double amount;
    private String paymentMethod;
    private String senderType;
    private String maskedSender;
    private String originalMessage;

    public ScanResponse() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(int riskScore) {
        this.riskScore = riskScore;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public String getScamCategory() {
        return scamCategory;
    }

    public void setScamCategory(String scamCategory) {
        this.scamCategory = scamCategory;
    }

    public String getConfidence() {
        return confidence;
    }

    public void setConfidence(String confidence) {
        this.confidence = confidence;
    }

    public List<RiskSignalResponse> getSignals() {
        return signals;
    }

    public void setSignals(List<RiskSignalResponse> signals) {
        this.signals = signals;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }

    public Boolean getPrivacyMode() {
        return privacyMode;
    }

    public void setPrivacyMode(Boolean privacyMode) {
        this.privacyMode = privacyMode;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getSenderType() {
        return senderType;
    }

    public void setSenderType(String senderType) {
        this.senderType = senderType;
    }

    public String getMaskedSender() {
        return maskedSender;
    }

    public void setMaskedSender(String maskedSender) {
        this.maskedSender = maskedSender;
    }

    public String getOriginalMessage() {
        return originalMessage;
    }

    public void setOriginalMessage(String originalMessage) {
        this.originalMessage = originalMessage;
    }
}
