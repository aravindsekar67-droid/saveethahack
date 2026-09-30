package com.shieldpay.service;

import com.shieldpay.dto.ConversationScanRequest;
import com.shieldpay.dto.ConversationScanResponse;
import com.shieldpay.dto.RiskSignalResponse;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ConversationAnalyzerService {

    private final MessageAnalyzer messageAnalyzer;
    private final RiskEngine riskEngine;
    private final ExplanationService explanationService;

    public ConversationAnalyzerService(MessageAnalyzer messageAnalyzer, RiskEngine riskEngine, ExplanationService explanationService) {
        this.messageAnalyzer = messageAnalyzer;
        this.riskEngine = riskEngine;
        this.explanationService = explanationService;
    }

    public ConversationScanResponse analyzeConversation(ConversationScanRequest request) {
        ConversationScanResponse response = new ConversationScanResponse();
        List<String> messages = request.getMessages();
        if (messages == null || messages.isEmpty()) {
            response.setFinalRiskScore(0);
            response.setFinalRiskLevel("LOW");
            response.setScamCategory("Normal Communication");
            response.setOverallExplanation("No conversation messages provided.");
            response.setRecommendation("No action needed.");
            return response;
        }

        List<ConversationScanResponse.MessageStep> timeline = new ArrayList<>();
        Set<String> alreadyDetectedSignalNames = new HashSet<>();
        List<RiskSignalResponse> accumulatedSignals = new ArrayList<>();

        // Baseline sender risk if unknown person
        if ("Unknown Person".equalsIgnoreCase(request.getSenderType()) || "Unknown".equalsIgnoreCase(request.getSenderType())) {
            RiskSignalResponse senderSignal = new RiskSignalResponse(
                    "Unknown Sender",
                    "MEDIUM",
                    10,
                    "The counterparty in the conversation is an unverified individual."
            );
            accumulatedSignals.add(senderSignal);
            alreadyDetectedSignalNames.add(senderSignal.getName());
        }

        for (int i = 0; i < messages.size(); i++) {
            String msg = messages.get(i);
            List<RiskSignalResponse> signalsInMsg = messageAnalyzer.analyzeText(msg);

            // Find signals newly introduced in THIS message
            List<RiskSignalResponse> newlyIntroduced = new ArrayList<>();
            for (RiskSignalResponse sig : signalsInMsg) {
                if (!alreadyDetectedSignalNames.contains(sig.getName())) {
                    newlyIntroduced.add(sig);
                    alreadyDetectedSignalNames.add(sig.getName());
                    accumulatedSignals.add(sig);
                }
            }

            RiskEngine.EvaluationResult stepEval = riskEngine.evaluateSignals(accumulatedSignals);

            String stepExplanation;
            if (!newlyIntroduced.isEmpty()) {
                stepExplanation = "Message " + (i + 1) + " escalated risk by introducing: " +
                        newlyIntroduced.stream().map(RiskSignalResponse::getName).reduce((a, b) -> a + ", " + b).orElse("") + ".";
            } else if (i == 0 && accumulatedSignals.size() > 0) {
                stepExplanation = "Initial message established contact with an unknown party.";
            } else {
                stepExplanation = "Message maintains conversational continuity without introducing new overt danger signals.";
            }

            timeline.add(new ConversationScanResponse.MessageStep(
                    i + 1,
                    msg,
                    stepEval.getRiskScore(),
                    stepEval.getRiskLevel(),
                    newlyIntroduced,
                    stepExplanation
            ));
        }

        RiskEngine.EvaluationResult finalEval = riskEngine.evaluateSignals(accumulatedSignals);
        response.setFinalRiskScore(finalEval.getRiskScore());
        response.setFinalRiskLevel(finalEval.getRiskLevel());
        response.setScamCategory(finalEval.getScamCategory());
        response.setTimeline(timeline);

        response.setOverallExplanation(explanationService.generateExplanation(
                finalEval.getScamCategory(),
                finalEval.getRiskScore(),
                finalEval.getSignals()
        ));
        response.setRecommendation(explanationService.generateRecommendation(
                finalEval.getScamCategory(),
                finalEval.getRiskScore(),
                finalEval.getSignals()
        ));

        return response;
    }
}
