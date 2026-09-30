package com.shieldpay.service;

import com.shieldpay.dto.QrScanRequest;
import com.shieldpay.dto.QrScanResponse;
import com.shieldpay.dto.RiskSignalResponse;
import com.shieldpay.entity.RiskSignal;
import com.shieldpay.entity.Scan;
import com.shieldpay.repository.ScanRepository;
import org.springframework.stereotype.Service;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class QrAnalyzerService {

    private static final Set<String> VERIFIED_MERCHANT_HANDLES = new HashSet<>(Arrays.asList(
            "starbucks", "swiggy", "zomato", "amazonpay", "tatasky", "airtel", "jio", "uber", "ola", "flipkart", "irctc"
    ));

    private final ScanRepository scanRepository;

    public QrAnalyzerService(ScanRepository scanRepository) {
        this.scanRepository = scanRepository;
    }

    public QrScanResponse analyzeQr(QrScanRequest request) {
        QrScanResponse response = new QrScanResponse();
        String raw = request.getQrData() != null ? request.getQrData().trim() : "";
        response.setRawUri(raw);

        int score = 0;
        List<RiskSignalResponse> signals = new ArrayList<>();
        List<String> errors = new ArrayList<>();

        String recipient = request.getRecipient();
        Double amount = request.getAmount();
        String note = request.getNote();

        if (raw.toLowerCase().startsWith("upi://pay")) {
            response.setQrType("UPI_COLLECT_OR_PAY");
            Map<String, String> params = parseQueryParams(raw);
            
            if (params.containsKey("pa")) recipient = params.get("pa");
            if (params.containsKey("pn") && (recipient == null || recipient.isEmpty())) recipient = params.get("pn");
            if (params.containsKey("am")) {
                try {
                    amount = Double.parseDouble(params.get("am"));
                } catch (Exception ex) {
                    errors.add("SYNTAX ERROR: Amount parameter ('" + params.get("am") + "') is invalid or malformed.");
                    score += 25;
                }
            }
            if (params.containsKey("tn")) note = params.get("tn");

            // 1. Check Mandatory Payee Address (pa)
            if (recipient == null || recipient.isBlank()) {
                errors.add("SYNTAX ERROR: Missing mandatory Payee UPI Address ('pa='). The QR code is structurally invalid and cannot be authenticated.");
                score += 45;
                signals.add(new RiskSignalResponse(
                        "Missing Payee Address Parameter",
                        "HIGH",
                        45,
                        "UPI specification requires the 'pa=' parameter for every valid payment payload. Missing payee data indicates a tampered or invalid QR code."
                ));
            } else if (!recipient.contains("@")) {
                errors.add("FORMAT ERROR: Payee Address ('" + recipient + "') does not conform to valid Virtual Payment Address (VPA) syntax (missing '@' PSP handle).");
                score += 35;
                signals.add(new RiskSignalResponse(
                        "Malformed VPA Handle Syntax",
                        "HIGH",
                        35,
                        "A valid UPI ID must include a username and PSP handle (e.g. name@bank)."
                ));
            }

            String recLower = (recipient != null) ? recipient.toLowerCase() : "";
            String noteLower = (note != null) ? note.toLowerCase() : "";
            String rawLower = raw.toLowerCase();

            // 2. Check for Reverse-Charge Deception ("Refund / Cashback Trap")
            boolean hasRefundDeception = noteLower.contains("refund") || noteLower.contains("receive") || 
                                         noteLower.contains("cashback") || noteLower.contains("claim") ||
                                         noteLower.contains("bonus") || noteLower.contains("reward") ||
                                         noteLower.contains("reversal") || noteLower.contains("credit") ||
                                         rawLower.contains("refund") || rawLower.contains("cashback");

            if (hasRefundDeception) {
                errors.add("CRITICAL FRAUD ERROR: Reverse-Charge Deception Trap detected. Scammer claims scanning this code will credit money or refund funds. IN UPI ARCHITECTURE, SCANNING A QR OR ENTERING YOUR PIN CAN ONLY WITHDRAW/DEBIT MONEY.");
                score += 50;
                signals.add(new RiskSignalResponse(
                        "Reverse-Charge Deception Trap",
                        "HIGH",
                        50,
                        "The QR payload references receiving a refund, cashback, or claim. Scanning a QR code or entering your UPI PIN will IMMEDIATELY DEDUCT funds from your bank account."
                ));
            }

            // 3. Check for Disguised Support / Nodal VPA Handle
            boolean isDisguisedSupport = recLower.contains("support") || recLower.contains("refund") || 
                                         recLower.contains("helpdesk") || recLower.contains("nodal") || 
                                         recLower.contains("customer") || recLower.contains("care") ||
                                         recLower.contains("service") || recLower.contains("security");

            if (isDisguisedSupport) {
                errors.add("IMPERSONATION ERROR: Payee VPA ('" + recipient + "') is masquerading as an official banking or corporate support helpline.");
                score += 40;
                signals.add(new RiskSignalResponse(
                        "Disguised Corporate Helpdesk VPA",
                        "HIGH",
                        40,
                        "The UPI ID ('" + recipient + "') uses support-related terms to appear as an official institutional desk. Genuine banks never conduct support or fee collections via peer VPAs."
                ));
            }

            // 4. Check Amount Locking
            if (amount != null && amount >= 2000.0) {
                score += 20;
                signals.add(new RiskSignalResponse(
                        "Fixed High-Value Pre-filled Debit (₹" + amount + ")",
                        "HIGH",
                        20,
                        "The QR code locks in a payment amount of ₹" + amount + ", causing immediate fund transfer upon PIN authorization."
                ));
            }

            // 5. Check if known verified retail merchant
            boolean isKnownMerchant = false;
            for (String m : VERIFIED_MERCHANT_HANDLES) {
                if (recLower.contains(m)) {
                    isKnownMerchant = true;
                    break;
                }
            }

            if (isKnownMerchant && !hasRefundDeception && !isDisguisedSupport) {
                // Low risk verified retail merchant
                score = 15;
                signals.add(new RiskSignalResponse(
                        "Verified Commercial Merchant Handle",
                        "LOW",
                        15,
                        "The payment destination matches a recognized commercial merchant handle with standard retail authorization."
                ));
            } else if (!hasRefundDeception && !isDisguisedSupport && errors.isEmpty()) {
                // Medium risk unverified individual peer transfer
                score += 35;
                signals.add(new RiskSignalResponse(
                        "Unverified Individual Peer Payee",
                        "MEDIUM",
                        35,
                        "The recipient ('" + (recipient != null ? recipient : "Unknown") + "') is an individual peer account rather than a verified enterprise merchant."
                ));
                if (amount != null && amount >= 3000.0) {
                    score += 15;
                }
            }

        } else if (raw.toLowerCase().startsWith("http://") || raw.toLowerCase().startsWith("https://")) {
            response.setQrType("WEB_REDIRECT_QR");
            String rawLower = raw.toLowerCase();

            if (rawLower.contains(".apk") || rawLower.contains(".exe")) {
                errors.add("CRITICAL MALWARE ERROR: This QR code initiates an automatic download of an Android APK package or executable binary.");
                score = 95;
                signals.add(new RiskSignalResponse(
                        "Malicious Application Package (.apk) Download",
                        "HIGH",
                        65,
                        "Scanning this QR triggers an APK file download. Fraudulent banking APKs take over SMS and intercept one-time passwords."
                ));
            } else if (rawLower.startsWith("http://") || rawLower.contains("login") || rawLower.contains("verify") || rawLower.contains("-")) {
                errors.add("PHISHING WARNING: This QR directs you to an unencrypted or lookalike web page.");
                score = 80;
                signals.add(new RiskSignalResponse(
                        "Phishing Web Redirect QR",
                        "HIGH",
                        45,
                        "This QR directs you to an unauthenticated web destination rather than an official banking channel."
                ));
            } else {
                score = 45;
                signals.add(new RiskSignalResponse(
                        "External Web Redirect QR",
                        "MEDIUM",
                        45,
                        "This QR leads to an external website. Ensure you trust the destination before interacting."
                ));
            }
        } else {
            response.setQrType("CUSTOM_PAYLOAD");
            errors.add("FORMAT ERROR: The QR code payload does not match standard UPI payment URI syntax.");
            score = 50;
            signals.add(new RiskSignalResponse(
                    "Unrecognized QR Payload Format",
                    "MEDIUM",
                    50,
                    "The QR code contains non-standard data that could not be parsed as an authenticated payment request."
            ));
        }

        int finalScore = Math.min(score, 100);
        response.setRecipient(recipient != null ? recipient : "Unknown VPA");
        response.setAmount(amount != null ? amount : 0.0);
        response.setDestination(recipient != null ? recipient : "Payment Gateway");
        response.setRiskScore(finalScore);
        response.setSignals(signals);
        response.setErrors(errors);

        if (finalScore >= 60) {
            response.setRiskLevel("HIGH");
            response.setConfidence("HIGH");
            response.setExplanation("CRITICAL FRAUD WARNING (" + finalScore + "% Risk): This QR code exhibits deceptive reverse-charge or impersonation characteristics. Scanning it will DEBIT ₹" + (amount != null && amount > 0 ? amount : "") + " from your bank account. You NEVER scan a QR code to receive money.");
            response.setRecommendation("DO NOT scan or approve this QR in your UPI app. Cancel the transaction immediately.");
        } else if (finalScore >= 30) {
            response.setRiskLevel("MEDIUM");
            response.setConfidence("MEDIUM");
            response.setExplanation("MEDIUM RISK (" + finalScore + "% Risk): This QR requests an unverified transfer to an individual payee. Verify the identity of the person requesting payment before entering your UPI PIN.");
            response.setRecommendation("Confirm the payee legal name on your UPI confirmation screen before authorizing payment.");
        } else {
            response.setRiskLevel("LOW");
            response.setConfidence("LOW");
            response.setExplanation("LOW RISK (" + finalScore + "% Risk): Standard commercial or retail payment QR detected with verified payee indicators.");
            response.setRecommendation("Standard precaution: check amount and merchant name on your app before entering your UPI PIN.");
        }

        // Save checked QR to audit history
        saveToAuditHistory(response.getRecipient(), raw, response.getAmount(), finalScore, response.getRiskLevel(), response.getExplanation(), signals);

        return response;
    }

    private void saveToAuditHistory(String recipient, String rawUri, Double amount, int score, String level, String explanation, List<RiskSignalResponse> signals) {
        try {
            Scan scan = new Scan();
            scan.setMessage("Scanned QR Payment Request: " + recipient + (amount != null && amount > 0 ? " (₹" + amount + ")" : ""));
            scan.setUrl(rawUri);
            scan.setPaymentMethod("UPI QR Code");
            scan.setSender(recipient != null ? recipient : "Unknown VPA");
            scan.setSenderType("QR Payee");
            scan.setAmount(amount != null ? amount : 0.0);
            scan.setRiskScore(score);
            scan.setRiskLevel(level);
            scan.setScamCategory("QR Payment Check");
            scan.setConfidence("HIGH");
            scan.setExplanation(explanation);
            scan.setRecommendation(level.equals("HIGH") ? "DO NOT scan or approve this QR in your UPI app." : "Verify payee before authorizing PIN.");
            scan.setPrivacyMode(false);
            scan.setCreatedAt(LocalDateTime.now());

            if (signals != null) {
                for (RiskSignalResponse s : signals) {
                    scan.addSignal(new RiskSignal(s.getName(), s.getSeverity(), s.getScore(), s.getDescription()));
                }
            }
            scanRepository.save(scan);
        } catch (Exception e) {
            // Silently continue if audit log save fails
        }
    }

    private Map<String, String> parseQueryParams(String uri) {
        Map<String, String> params = new HashMap<>();
        try {
            int qIdx = uri.indexOf('?');
            if (qIdx != -1 && qIdx < uri.length() - 1) {
                String query = uri.substring(qIdx + 1);
                String[] pairs = query.split("&");
                for (String pair : pairs) {
                    String[] kv = pair.split("=", 2);
                    if (kv.length == 2) {
                        String key = URLDecoder.decode(kv[0], StandardCharsets.UTF_8);
                        String val = URLDecoder.decode(kv[1], StandardCharsets.UTF_8);
                        params.put(key, val);
                    }
                }
            }
        } catch (Exception ignored) {}
        return params;
    }
}
