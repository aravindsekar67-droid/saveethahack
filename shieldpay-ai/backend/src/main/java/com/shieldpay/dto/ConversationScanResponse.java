package com.shieldpay.dto;

import java.util.ArrayList;
import java.util.List;

public class ConversationScanResponse {

    public static class MessageStep {
        private int stepNumber;
        private String messageText;
        private int progressiveRiskScore;
        private String riskLevel;
        private List<RiskSignalResponse> introducedSignals = new ArrayList<>();
        private String explanation;

        public MessageStep() {}

        public MessageStep(int stepNumber, String messageText, int progressiveRiskScore, String riskLevel, List<RiskSignalResponse> introducedSignals, String explanation) {
            this.stepNumber = stepNumber;
            this.messageText = messageText;
            this.progressiveRiskScore = progressiveRiskScore;
            this.riskLevel = riskLevel;
            this.introducedSignals = introducedSignals;
            this.explanation = explanation;
        }

        public int getStepNumber() {
            return stepNumber;
        }

        public void setStepNumber(int stepNumber) {
            this.stepNumber = stepNumber;
        }

        public String getMessageText() {
            return messageText;
        }

        public void setMessageText(String messageText) {
            this.messageText = messageText;
        }

        public int getProgressiveRiskScore() {
            return progressiveRiskScore;
        }

        public void setProgressiveRiskScore(int progressiveRiskScore) {
            this.progressiveRiskScore = progressiveRiskScore;
        }

        public String getRiskLevel() {
            return riskLevel;
        }

        public void setRiskLevel(String riskLevel) {
            this.riskLevel = riskLevel;
        }

        public List<RiskSignalResponse> getIntroducedSignals() {
            return introducedSignals;
        }

        public void setIntroducedSignals(List<RiskSignalResponse> introducedSignals) {
            this.introducedSignals = introducedSignals;
        }

        public String getExplanation() {
            return explanation;
        }

        public void setExplanation(String explanation) {
            this.explanation = explanation;
        }
    }

    private int finalRiskScore;
    private String finalRiskLevel;
    private String scamCategory;
    private String overallExplanation;
    private String recommendation;
    private List<MessageStep> timeline = new ArrayList<>();

    public ConversationScanResponse() {}

    public int getFinalRiskScore() {
        return finalRiskScore;
    }

    public void setFinalRiskScore(int finalRiskScore) {
        this.finalRiskScore = finalRiskScore;
    }

    public String getFinalRiskLevel() {
        return finalRiskLevel;
    }

    public void setFinalRiskLevel(String finalRiskLevel) {
        this.finalRiskLevel = finalRiskLevel;
    }

    public String getScamCategory() {
        return scamCategory;
    }

    public void setScamCategory(String scamCategory) {
        this.scamCategory = scamCategory;
    }

    public String getOverallExplanation() {
        return overallExplanation;
    }

    public void setOverallExplanation(String overallExplanation) {
        this.overallExplanation = overallExplanation;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }

    public List<MessageStep> getTimeline() {
        return timeline;
    }

    public void setTimeline(List<MessageStep> timeline) {
        this.timeline = timeline;
    }
}
