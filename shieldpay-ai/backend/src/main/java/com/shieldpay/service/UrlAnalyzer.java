package com.shieldpay.service;

import com.shieldpay.dto.RiskSignalResponse;
import com.shieldpay.dto.UrlScanResponse;
import com.shieldpay.entity.RiskSignal;
import com.shieldpay.entity.Scan;
import com.shieldpay.repository.ScanRepository;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Pattern;

@Service
public class UrlAnalyzer {

    private static final Pattern IP_PATTERN = Pattern.compile("^(\\d{1,3}\\.){3}\\d{1,3}(:\\d+)?$");
    
    private static final List<String> SHORTENERS = Arrays.asList(
            "bit.ly", "tinyurl.com", "t.co", "is.gd", "buff.ly", "cutt.ly", "rb.gy", "shorturl.at", "ow.ly"
    );

    private static final List<String> PHISHING_KEYWORDS = Arrays.asList(
            "login", "signin", "verify", "secure", "bank", "update", "kyc", "support", "billing", 
            "account-alert", "refund", "upi-verify", "unblock", "password", "otp", "deactivate",
            "pan-update", "aadhaar", "claim", "reversal", "bonus", "reward"
    );

    private static final List<String> BRAND_MASQUERADE_PATTERNS = Arrays.asList(
            "sbi-", "-sbi", "hdfc-", "-hdfc", "icici-", "-icici", "paytm-", "-paytm", 
            "phonepe-", "-phonepe", "gpay-", "-gpay", "bank-verify", "verify-bank", 
            "alert-verify", "kyc-update", "refund-portal", "yono-", "kotak-", "axis-", "paypal-"
    );

    private static final Set<String> HIGH_RISK_TLDS = new HashSet<>(Arrays.asList(
            "xyz", "top", "tk", "ml", "ga", "cf", "gq", "buzz", "club", "work", "click", 
            "link", "stream", "cc", "rest", "cam", "site", "online", "live", "info", "vip"
    ));

    private static final List<String> IMPERSONATED_BRANDS = Arrays.asList(
            "sbi", "hdfc", "icici", "axis", "kotak", "paytm", "phonepe", "gpay", "googlepay", 
            "yono", "amazon", "flipkart", "epfo", "bescom", "tneb", "mpeb", "bses", "cybercrime"
    );

    private static final Set<String> VERIFIED_LEGITIMATE_DOMAINS = new HashSet<>(Arrays.asList(
            "google.com", "amazon.in", "amazon.com", "onlinesbi.sbi", "hdfcbank.com", 
            "icicibank.com", "axisbank.com", "paytm.com", "phonepe.com", "npci.org.in",
            "gov.in", "nic.in", "rbi.org.in", "apple.com", "microsoft.com", "github.com"
    ));

    private final ScanRepository scanRepository;

    public UrlAnalyzer(ScanRepository scanRepository) {
        this.scanRepository = scanRepository;
    }

    public UrlScanResponse analyzeUrl(String rawUrl) {
        UrlScanResponse response = new UrlScanResponse();
        if (rawUrl == null || rawUrl.isBlank()) {
            response.setUrl("");
            response.setRiskScore(0);
            response.setRiskLevel("LOW");
            response.setSummary("No URL provided.");
            response.setRecommendation("No action needed.");
            return response;
        }

        String input = rawUrl.trim();
        response.setUrl(input);

        int score = 0;
        List<RiskSignalResponse> checks = new ArrayList<>();

        // 1. Resilient Normalization & Malformed Input Handling
        String cleanUrl = input;
        boolean hasMalformedProtocol = false;

        // Check for common typo schemes
        if (cleanUrl.startsWith("htp://") || cleanUrl.startsWith("htps://") || cleanUrl.startsWith("ttp://") || cleanUrl.startsWith("http//") || cleanUrl.startsWith("https//")) {
            hasMalformedProtocol = true;
            score += 25;
            checks.add(new RiskSignalResponse(
                    "Corrupted Protocol Scheme",
                    "MEDIUM",
                    25,
                    "The link uses a malformed or mistyped web protocol header (e.g. 'htp://'). Scammers often use typos to evade standard link scanners."
            ));
            cleanUrl = cleanUrl.replaceFirst("^(htp|htps|ttp|http|https):?//?", "http://");
        } else if (cleanUrl.contains("://") && !cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
            score += 40;
            checks.add(new RiskSignalResponse(
                    "Non-Standard Protocol Scheme",
                    "HIGH",
                    40,
                    "The destination uses a non-web or potentially malicious protocol scheme."
            ));
        } else if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
            // No scheme provided
            cleanUrl = "http://" + cleanUrl;
        }

        boolean isHttps = cleanUrl.toLowerCase().startsWith("https://");
        response.setHttps(isHttps);

        try {
            URI uri = URI.create(cleanUrl);
            String host = uri.getHost();

            // Check if host is missing or invalid
            if (host == null || host.isBlank() || host.contains(" ") || !host.contains(".")) {
                score += 45;
                checks.add(new RiskSignalResponse(
                        "Malformed / Invalid Domain Structure",
                        "HIGH",
                        45,
                        "The input ('" + input + "') is not a valid internet domain or web address. Invalid or syntactically broken addresses cannot be verified and present severe security risks."
                ));
            } else {
                host = host.toLowerCase();

                // Check if legitimate verified domain
                boolean isVerifiedDomain = false;
                for (String legit : VERIFIED_LEGITIMATE_DOMAINS) {
                    if (host.equals(legit) || host.endsWith("." + legit)) {
                        isVerifiedDomain = true;
                        break;
                    }
                }

                if (isVerifiedDomain && isHttps) {
                    // Safe recognized corporate domain
                    response.setRiskScore(5);
                    response.setRiskLevel("LOW");
                    response.setChecks(List.of(new RiskSignalResponse(
                            "Verified Financial / Enterprise Domain",
                            "LOW",
                            5,
                            "The destination matches an established, officially authenticated domain registry (" + host + ") with valid TLS encryption."
                    )));
                    response.setSummary("LOW RISK: This link resolves to an officially verified, encrypted domain (" + host + ").");
                    response.setRecommendation("Standard safety practices apply. Ensure you entered this address intentionally.");
                    
                    saveToAuditHistory(input, 5, "LOW", response.getSummary(), response.getChecks());
                    return response;
                }

                // Insecure HTTP check
                if (!isHttps) {
                    score += 20;
                    checks.add(new RiskSignalResponse(
                            "Insecure Protocol (HTTP)",
                            "HIGH",
                            20,
                            "The connection lacks SSL/TLS encryption. Sensitive payment credentials submitted on this page can be intercepted in transit."
                    ));
                }

                // Check IP address in host
                if (IP_PATTERN.matcher(host).matches() || host.matches(".*\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}.*")) {
                    response.setIpAddress(true);
                    score += 45;
                    checks.add(new RiskSignalResponse(
                            "Raw IP-Based Destination",
                            "HIGH",
                            45,
                            "The destination uses a numeric IP address (" + host + ") rather than an authenticated domain name. This is a common evasion technique for temporary rogue servers."
                    ));
                }

                // Check High-Risk TLDs
                String tld = host.substring(host.lastIndexOf('.') + 1);
                if (HIGH_RISK_TLDS.contains(tld)) {
                    score += 30;
                    checks.add(new RiskSignalResponse(
                            "High-Risk / Disposable Top-Level Domain (." + tld + ")",
                            "HIGH",
                            30,
                            "The link uses the '." + tld + "' domain extension, which is disproportionately associated with temporary phishing and throwaway scam websites."
                    ));
                }

                // Check Brand Masquerading & Impersonation
                boolean brandFlagged = false;
                for (String pat : BRAND_MASQUERADE_PATTERNS) {
                    if (host.contains(pat)) {
                        brandFlagged = true;
                        score += 40;
                        checks.add(new RiskSignalResponse(
                                "Brand Masquerading Domain",
                                "HIGH",
                                40,
                                "The domain name ('" + host + "') appears artificially constructed with brand names and hyphens to deceive users into mistaking it for an official portal."
                        ));
                        break;
                    }
                }

                if (!brandFlagged) {
                    for (String brand : IMPERSONATED_BRANDS) {
                        if (host.contains(brand)) {
                            score += 40;
                            checks.add(new RiskSignalResponse(
                                    "Unauthorized Brand Spoofing Defect",
                                    "HIGH",
                                    40,
                                    "The domain ('" + host + "') incorporates the trademarked institution name '" + brand.toUpperCase() + "' on an unverified host. Genuine banking & utility portals operate exclusively on authenticated enterprise domains."
                            ));
                            break;
                        }
                    }
                }

                // Check URL Shorteners
                for (String shortener : SHORTENERS) {
                    if (host.equals(shortener) || host.endsWith("." + shortener)) {
                        response.setShortened(true);
                        score += 40;
                        checks.add(new RiskSignalResponse(
                                "URL Shortener Masking",
                                "MEDIUM",
                                40,
                                "The link utilizes a URL shortening redirection service (" + shortener + "), which hides the actual landing destination until clicked."
                        ));
                        break;
                    }
                }

                // Check Phishing Keywords in Path or Host
                String fullPathAndQuery = (uri.getPath() != null ? uri.getPath() : "") +
                                          (uri.getQuery() != null ? "?" + uri.getQuery() : "");
                List<String> matchedKeywords = new ArrayList<>();
                for (String kw : PHISHING_KEYWORDS) {
                    if (fullPathAndQuery.toLowerCase().contains(kw) || host.contains(kw)) {
                        matchedKeywords.add(kw);
                    }
                }

                if (!matchedKeywords.isEmpty()) {
                    response.setHasSuspiciousKeywords(true);
                    int kwScore = Math.min(35, matchedKeywords.size() * 15);
                    score += kwScore;
                    checks.add(new RiskSignalResponse(
                            "Phishing & Credential Harvest Keywords",
                            "HIGH",
                            kwScore,
                            "Security-sensitive keywords found in the web address: " + String.join(", ", matchedKeywords) + ". Fraudulent sites use these to create false authority."
                    ));
                }

                // Check for Dangerous Executable / APK file downloads
                String pathLower = fullPathAndQuery.toLowerCase();
                if (pathLower.contains(".apk") || pathLower.contains(".exe") || pathLower.contains(".scr") || pathLower.contains(".zip")) {
                    score += 50;
                    checks.add(new RiskSignalResponse(
                            "Direct Executable / Malware Download Target",
                            "HIGH",
                            50,
                            "The link points directly to a downloadable executable or Android APK package. Scammers distribute rogue banking apps to take over devices."
                    ));
                }

                // Subdomain nesting check
                String[] parts = host.split("\\.");
                if (parts.length > 3) {
                    response.setHasUnusualSubdomains(true);
                    score += 20;
                    checks.add(new RiskSignalResponse(
                            "Excessive Subdomain Nesting",
                            "MEDIUM",
                            20,
                            "The domain contains " + parts.length + " nested subdomain tiers, frequently used to disguise the root registrar."
                    ));
                }
            }
        } catch (Exception e) {
            score += 40;
            checks.add(new RiskSignalResponse(
                    "Malformed Link Formatting Syntax",
                    "HIGH",
                    40,
                    "The provided link could not be parsed as a standard web URI. Malformed URLs are frequently used in evasion attacks."
            ));
        }

        // Length check
        if (cleanUrl.length() > 75) {
            response.setHasSuspiciousLength(true);
            score += 15;
            checks.add(new RiskSignalResponse(
                    "Excessive URL Length",
                    "MEDIUM",
                    15,
                    "The link is abnormally long (" + cleanUrl.length() + " characters), often crafted to hide malicious parameters."
            ));
        }

        // If no signals were flagged at all, assign minimal baseline
        if (checks.isEmpty()) {
            score = 10;
            checks.add(new RiskSignalResponse(
                    "Unflagged Domain Structure",
                    "LOW",
                    10,
                    "No known deceptive brand tokens, raw IPs, or phishing keywords were detected in the web address."
            ));
        }

        int finalScore = Math.min(score, 100);
        response.setRiskScore(finalScore);
        response.setChecks(checks);

        if (finalScore >= 60) {
            response.setRiskLevel("HIGH");
            response.setSummary("HIGH RISK (" + finalScore + "%): This link exhibits strong indicators of a credential harvesting or brand masquerading phishing website.");
            response.setRecommendation("DO NOT open this link or input passwords/OTP on this site. Access your service directly via the verified mobile app.");
        } else if (finalScore >= 30) {
            response.setRiskLevel("MEDIUM");
            response.setSummary("MEDIUM RISK (" + finalScore + "%): This link shows intermediate anomalies (such as URL shortener masking, non-standard domain, or missing SSL encryption).");
            response.setRecommendation("Exercise caution. Verify the destination domain in your address bar before continuing.");
        } else {
            response.setRiskLevel("LOW");
            response.setSummary("LOW RISK (" + finalScore + "%): No deceptive brand masquerading, raw IP, or phishing tokens were detected.");
            response.setRecommendation("Standard browsing precaution: ensure you recognize the intended counterparty before sending money.");
        }

        // Save checked link to audit history
        saveToAuditHistory(input, finalScore, response.getRiskLevel(), response.getSummary(), checks);

        return response;
    }

    private void saveToAuditHistory(String targetUrl, int score, String level, String summary, List<RiskSignalResponse> checks) {
        try {
            Scan scan = new Scan();
            scan.setMessage("Checked Web Link: " + targetUrl);
            scan.setUrl(targetUrl);
            scan.setPaymentMethod("Website Link");
            scan.setSender("Web Destination");
            scan.setSenderType("Link Check");
            scan.setAmount(0.0);
            scan.setRiskScore(score);
            scan.setRiskLevel(level);
            scan.setScamCategory("Link / Phishing Inspection");
            scan.setConfidence("HIGH");
            scan.setExplanation(summary);
            scan.setRecommendation(level.equals("HIGH") ? "DO NOT open this link. Verify via official apps." : "Verify recipient before sending funds.");
            scan.setPrivacyMode(false);
            scan.setCreatedAt(LocalDateTime.now());

            if (checks != null) {
                for (RiskSignalResponse c : checks) {
                    scan.addSignal(new RiskSignal(c.getName(), c.getSeverity(), c.getScore(), c.getDescription()));
                }
            }
            scanRepository.save(scan);
        } catch (Exception e) {
            // Silently continue if audit log save fails
        }
    }
}
