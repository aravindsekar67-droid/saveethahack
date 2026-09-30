package com.shieldpay.dto;

public class RiskSignalResponse {
    private String name;
    private String severity;
    private int score;
    private String description;

    public RiskSignalResponse() {}

    public RiskSignalResponse(String name, String severity, int score, String description) {
        this.name = name;
        this.severity = severity;
        this.score = score;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
