package com.shieldpay.service;

import com.shieldpay.dto.*;
import com.shieldpay.entity.RiskSignal;
import com.shieldpay.entity.Scan;
import com.shieldpay.repository.ScanRepository;
import com.shieldpay.util.PrivacyMasker;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ScamDetectionService {

    private final MessageAnalyzer messageAnalyzer;
    private final UrlAnalyzer urlAnalyzer;
    private final PaymentAnalyzer paymentAnalyzer;
    private final RiskEngine riskEngine;
    private final AiService aiService;
    private final ExplanationService explanationService;
    private final ScanRepository scanRepository;

    private static final Pattern URL_IN_TEXT_PATTERN = Pattern.compile("https?://[\\w.-]+(?:\\.[a-zA-Z]{2,})\\S*");

    public ScamDetectionService(
            MessageAnalyzer messageAnalyzer,
            UrlAnalyzer urlAnalyzer,
            PaymentAnalyzer paymentAnalyzer,
            RiskEngine riskEngine,
            AiService aiService,
            ExplanationService explanationService,
            ScanRepository scanRepository
    ) {
        this.messageAnalyzer = messageAnalyzer;
        this.urlAnalyzer = urlAnalyzer;
        this.paymentAnalyzer = paymentAnalyzer;
        this.riskEngine = riskEngine;
        this.aiService = aiService;
        this.explanationService = explanationService;
        this.scanRepository = scanRepository;
    }

    @Transactional
    public ScanResponse analyzeScan(ScanRequest request) {
        List<RiskSignalResponse> detectedSignals = new ArrayList<>();

        // 1. Analyze Message Text
        List<RiskSignalResponse> messageSignals = messageAnalyzer.analyzeText(request.getMessage());
        detectedSignals.addAll(messageSignals);

        // 2. Check for URL either in explicit field or inside message
        String targetUrl = request.getUrl();
        if ((targetUrl == null || targetUrl.isBlank()) && request.getMessage() != null) {
            Matcher matcher = URL_IN_TEXT_PATTERN.matcher(request.getMessage());
            if (matcher.find()) {
                targetUrl = matcher.group();
            }
        }

        if (targetUrl != null && !targetUrl.isBlank()) {
            UrlScanResponse urlResponse = urlAnalyzer.analyzeUrl(targetUrl);
            if (urlResponse.getRiskScore() > 0) {
                detectedSignals.addAll(urlResponse.getChecks());
            }
        }

        // 3. Analyze Payment Context
        List<RiskSignalResponse> paymentSignals = paymentAnalyzer.analyzePaymentContext(request);
        detectedSignals.addAll(paymentSignals);

        // 4. Evaluate through RiskEngine
        RiskEngine.EvaluationResult evaluation = riskEngine.evaluateSignals(detectedSignals);

        // 5. Generate Explanation and Recommendation
        String explanation = aiService.getSafetyExplanation(
                evaluation.getScamCategory(),
                evaluation.getRiskScore(),
                evaluation.getSignals(),
                request.getMessage()
        );
        String recommendation = explanationService.generateRecommendation(
                evaluation.getScamCategory(),
                evaluation.getRiskScore(),
                evaluation.getSignals()
        );

        // 6. Privacy Handling
        boolean isPrivacy = Boolean.TRUE.equals(request.getPrivacyMode());
        String savedMessage = isPrivacy ? "[REDACTED - PRIVACY MODE ENABLED]" : request.getMessage();
        String savedSender = isPrivacy ? PrivacyMasker.maskSender(request.getSender()) : request.getSender();

        // 7. Save to Database
        Scan scan = new Scan();
        scan.setMessage(savedMessage);
        scan.setAmount(request.getAmount());
        scan.setPaymentMethod(request.getPaymentMethod());
        scan.setSender(savedSender);
        scan.setSenderType(request.getSenderType());
        scan.setUrl(request.getUrl());
        scan.setReason(request.getReason());
        scan.setRiskScore(evaluation.getRiskScore());
        scan.setRiskLevel(evaluation.getRiskLevel());
        scan.setScamCategory(evaluation.getScamCategory());
        scan.setConfidence(evaluation.getConfidence());
        scan.setExplanation(explanation);
        scan.setRecommendation(recommendation);
        scan.setPrivacyMode(isPrivacy);
        scan.setCreatedAt(LocalDateTime.now());

        for (RiskSignalResponse sigResp : evaluation.getSignals()) {
            RiskSignal signalEntity = new RiskSignal(
                    sigResp.getName(),
                    sigResp.getSeverity(),
                    sigResp.getScore(),
                    sigResp.getDescription()
            );
            scan.addSignal(signalEntity);
        }

        Scan savedScan = scanRepository.save(scan);

        // 8. Build Response
        ScanResponse response = new ScanResponse();
        response.setId(savedScan.getId());
        response.setRiskScore(evaluation.getRiskScore());
        response.setRiskLevel(evaluation.getRiskLevel());
        response.setScamCategory(evaluation.getScamCategory());
        response.setConfidence(evaluation.getConfidence());
        response.setSignals(evaluation.getSignals());
        response.setExplanation(explanation);
        response.setRecommendation(recommendation);
        response.setPrivacyMode(isPrivacy);
        response.setCreatedAt(savedScan.getCreatedAt());
        response.setAmount(savedScan.getAmount());
        response.setPaymentMethod(savedScan.getPaymentMethod());
        response.setSenderType(savedScan.getSenderType());
        response.setMaskedSender(PrivacyMasker.maskSender(request.getSender()));
        response.setOriginalMessage(isPrivacy ? PrivacyMasker.maskSensitiveData(request.getMessage()) : request.getMessage());

        return response;
    }

    public ScanResponse getScanById(Long id) {
        Scan scan = scanRepository.findById(id).orElse(null);
        if (scan == null) {
            return null;
        }

        ScanResponse response = new ScanResponse();
        response.setId(scan.getId());
        response.setRiskScore(scan.getRiskScore());
        response.setRiskLevel(scan.getRiskLevel());
        response.setScamCategory(scan.getScamCategory());
        response.setConfidence(scan.getConfidence());
        response.setExplanation(scan.getExplanation());
        response.setRecommendation(scan.getRecommendation());
        response.setPrivacyMode(scan.getPrivacyMode());
        response.setCreatedAt(scan.getCreatedAt());
        response.setAmount(scan.getAmount());
        response.setPaymentMethod(scan.getPaymentMethod());
        response.setSenderType(scan.getSenderType());
        response.setMaskedSender(PrivacyMasker.maskSender(scan.getSender()));
        response.setOriginalMessage(scan.getMessage());

        List<RiskSignalResponse> signalResponses = new ArrayList<>();
        if (scan.getSignals() != null) {
            for (RiskSignal rs : scan.getSignals()) {
                signalResponses.add(new RiskSignalResponse(
                        rs.getSignalName(),
                        rs.getSeverity(),
                        rs.getScore(),
                        rs.getDescription()
                ));
            }
        }
        response.setSignals(signalResponses);

        return response;
    }

    public List<ScanResponse> getScanHistory() {
        List<Scan> scans = scanRepository.findAllByOrderByCreatedAtDesc();
        List<ScanResponse> results = new ArrayList<>();
        for (Scan scan : scans) {
            ScanResponse r = new ScanResponse();
            r.setId(scan.getId());
            r.setRiskScore(scan.getRiskScore());
            r.setRiskLevel(scan.getRiskLevel());
            r.setScamCategory(scan.getScamCategory());
            r.setConfidence(scan.getConfidence());
            r.setExplanation(scan.getExplanation());
            r.setRecommendation(scan.getRecommendation());
            r.setPrivacyMode(scan.getPrivacyMode());
            r.setCreatedAt(scan.getCreatedAt());
            r.setAmount(scan.getAmount());
            r.setPaymentMethod(scan.getPaymentMethod());
            r.setSenderType(scan.getSenderType());
            r.setMaskedSender(PrivacyMasker.maskSender(scan.getSender()));
            r.setOriginalMessage(scan.getPrivacyMode() ? "[REDACTED - PRIVACY MODE]" : scan.getMessage());
            results.add(r);
        }
        return results;
    }

    public void clearHistory() {
        scanRepository.deleteAll();
    }
}
