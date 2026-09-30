package com.shieldpay.dto;

import java.util.ArrayList;
import java.util.List;

public class UrlScanResponse {
    private String url;
    private int riskScore;
    private String riskLevel;
    private boolean isHttps;
    private boolean hasSuspiciousKeywords;
    private boolean isIpAddress;
    private boolean isShortened;
    private boolean hasUnusualSubdomains;
    private boolean hasSuspiciousLength;
    private List<RiskSignalResponse> checks = new ArrayList<>();
    private String summary;
    private String recommendation;

    public UrlScanResponse() {}

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
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

    public boolean isHttps() {
        return isHttps;
    }

    public void setHttps(boolean https) {
        isHttps = https;
    }

    public boolean isHasSuspiciousKeywords() {
        return hasSuspiciousKeywords;
    }

    public void setHasSuspiciousKeywords(boolean hasSuspiciousKeywords) {
        this.hasSuspiciousKeywords = hasSuspiciousKeywords;
    }

    public boolean isIpAddress() {
        return isIpAddress;
    }

    public void setIpAddress(boolean ipAddress) {
        isIpAddress = ipAddress;
    }

    public boolean isShortened() {
        return isShortened;
    }

    public void setShortened(boolean shortened) {
        isShortened = shortened;
    }

    public boolean isHasUnusualSubdomains() {
        return hasUnusualSubdomains;
    }

    public void setHasUnusualSubdomains(boolean hasUnusualSubdomains) {
        this.hasUnusualSubdomains = hasUnusualSubdomains;
    }

    public boolean isHasSuspiciousLength() {
        return hasSuspiciousLength;
    }

    public void setHasSuspiciousLength(boolean hasSuspiciousLength) {
        this.hasSuspiciousLength = hasSuspiciousLength;
    }

    public List<RiskSignalResponse> getChecks() {
        return checks;
    }

    public void setChecks(List<RiskSignalResponse> checks) {
        this.checks = checks;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }
}
