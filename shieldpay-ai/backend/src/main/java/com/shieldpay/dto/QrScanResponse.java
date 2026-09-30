package com.shieldpay.dto;

import java.util.ArrayList;
import java.util.List;

public class QrScanResponse {
    private String qrType; // UPI_PAYMENT, STATIC_QR, DYNAMIC_QR, GENERIC_URL, UNKNOWN
    private String recipient;
    private Double amount;
    private String destination;
    private String rawUri;
    private int riskScore;
    private String riskLevel;
    private String confidence;
    private List<RiskSignalResponse> signals = new ArrayList<>();
    private List<String> errors = new ArrayList<>();
    private String explanation;
    private String recommendation;

    public QrScanResponse() {}

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }

    public String getQrType() {
        return qrType;
    }

    public void setQrType(String qrType) {
        this.qrType = qrType;
    }

    public String getRecipient() {
        return recipient;
    }

    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getRawUri() {
        return rawUri;
    }

    public void setRawUri(String rawUri) {
        this.rawUri = rawUri;
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
}
