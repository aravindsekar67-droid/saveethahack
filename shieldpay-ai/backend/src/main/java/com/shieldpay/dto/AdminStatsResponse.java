package com.shieldpay.dto;

import java.util.HashMap;
import java.util.Map;

public class AdminStatsResponse {
    private long totalScans;
    private long highRiskScans;
    private long mediumRiskScans;
    private long lowRiskScans;
    private long totalFeedback;
    private long usefulFeedback;
    private long notUsefulFeedback;

    private Map<String, Long> categoryDistribution = new HashMap<>();
    private Map<String, Long> riskDistribution = new HashMap<>();
    private Map<String, Long> paymentMethodDistribution = new HashMap<>();
    private Map<String, Long> signalFrequencies = new HashMap<>();
    private Map<String, Double> recurringPatternPercentages = new HashMap<>();
    private String recurringPatternInsight;

    public AdminStatsResponse() {}

    public long getTotalScans() {
        return totalScans;
    }

    public void setTotalScans(long totalScans) {
        this.totalScans = totalScans;
    }

    public long getHighRiskScans() {
        return highRiskScans;
    }

    public void setHighRiskScans(long highRiskScans) {
        this.highRiskScans = highRiskScans;
    }

    public long getMediumRiskScans() {
        return mediumRiskScans;
    }

    public void setMediumRiskScans(long mediumRiskScans) {
        this.mediumRiskScans = mediumRiskScans;
    }

    public long getLowRiskScans() {
        return lowRiskScans;
    }

    public void setLowRiskScans(long lowRiskScans) {
        this.lowRiskScans = lowRiskScans;
    }

    public long getTotalFeedback() {
        return totalFeedback;
    }

    public void setTotalFeedback(long totalFeedback) {
        this.totalFeedback = totalFeedback;
    }

    public long getUsefulFeedback() {
        return usefulFeedback;
    }

    public void setUsefulFeedback(long usefulFeedback) {
        this.usefulFeedback = usefulFeedback;
    }

    public long getNotUsefulFeedback() {
        return notUsefulFeedback;
    }

    public void setNotUsefulFeedback(long notUsefulFeedback) {
        this.notUsefulFeedback = notUsefulFeedback;
    }

    public Map<String, Long> getCategoryDistribution() {
        return categoryDistribution;
    }

    public void setCategoryDistribution(Map<String, Long> categoryDistribution) {
        this.categoryDistribution = categoryDistribution;
    }

    public Map<String, Long> getRiskDistribution() {
        return riskDistribution;
    }

    public void setRiskDistribution(Map<String, Long> riskDistribution) {
        this.riskDistribution = riskDistribution;
    }

    public Map<String, Long> getPaymentMethodDistribution() {
        return paymentMethodDistribution;
    }

    public void setPaymentMethodDistribution(Map<String, Long> paymentMethodDistribution) {
        this.paymentMethodDistribution = paymentMethodDistribution;
    }

    public Map<String, Long> getSignalFrequencies() {
        return signalFrequencies;
    }

    public void setSignalFrequencies(Map<String, Long> signalFrequencies) {
        this.signalFrequencies = signalFrequencies;
    }

    public Map<String, Double> getRecurringPatternPercentages() {
        return recurringPatternPercentages;
    }

    public void setRecurringPatternPercentages(Map<String, Double> recurringPatternPercentages) {
        this.recurringPatternPercentages = recurringPatternPercentages;
    }

    public String getRecurringPatternInsight() {
        return recurringPatternInsight;
    }

    public void setRecurringPatternInsight(String recurringPatternInsight) {
        this.recurringPatternInsight = recurringPatternInsight;
    }
}
