# ShieldPay AI - Technical Architecture & Risk Specification

**Challenge**: VH-S02: Detecting Digital Payment Scams Before Money Is Sent  
**Application Name**: ShieldPay AI  
**Tagline**: "Think Before You Pay."  
**Secondary Tagline**: "Detect suspicious signals before your money leaves your account."  

---

## 1. System Overview

ShieldPay AI is a privacy-conscious, client-server decision-support platform designed to protect individuals from social engineering and digital payment fraud (UPI, Bank Transfer, QR, and Card payments).

> **Core Philosophy**: ShieldPay AI is an informative decision-support system. It never claims that a transaction is definitively fraudulent; rather, it highlights verified suspicious signals, explains the risk drivers in plain language, and guides the user through practical safety actions prior to fund departure.

---

## 2. High-Level Architecture Diagram

```
+---------------------------------------------------------------------------------+
|                                 USER LAYER                                      |
|                                                                                 |
|   +-------------------+   +--------------------+   +------------------------+   |
|   | Payment Scanner   |   | Conversation Trace |   | QR & URL Deep Analyzers|   |
|   +-------------------+   +--------------------+   +------------------------+   |
|   | Scam Spotter Game |   | Safety Center      |   | Admin Analytics & Heat |   |
|   +-------------------+   +--------------------+   +------------------------+   |
+---------------------------------------------------------------------------------+
                                      |
                                      v HTTPS / JSON REST
+---------------------------------------------------------------------------------+
|                             SPRING BOOT BACKEND                                 |
|                                                                                 |
|   [Controllers] ScanController | UrlController | QrController | AdminController |
|                                      |                                          |
|   [Analysis Layer]                   |                                          |
|      * MessageAnalyzer (NLP token & regex heuristics)                           |
|      * UrlAnalyzer (Phishing heuristics, IP host, subdomain entropy, shorteners)|
|      * PaymentAnalyzer (Micro-amounts, suspicious sender classification)         |
|      * QrAnalyzerService (UPI intent parsing, reverse-charge traps)             |
|                                      |                                          |
|   [Engine] RiskEngine (Deduplication, signal weight sum, max-cap 100)          |
|                                      |                                          |
|   [Synthesis] AiService & ExplanationService (Plain English rationale generator)|
|                                      |                                          |
|   [Privacy Engine] PrivacyMasker (Auto PII Redaction for Phone/Email/Card)       |
+---------------------------------------------------------------------------------+
                                      |
                                      v JPA / Hibernate
+---------------------------------------------------------------------------------+
|                               DATABASE LAYER                                    |
|   MySQL 8.0 Primary Engine (with automated zero-downtime embedded fallback)     |
|   Tables: users, scans, risk_signals, scam_patterns, feedback, admin_events      |
+---------------------------------------------------------------------------------+
```

---

## 3. Risk Engine Scoring Model

The risk calculation follows an additive, deduplicated heuristic scoring model capped at 100:

$$\text{Risk Score} = \min\left(100, \sum_{i=1}^{n} \text{Weight}(\text{Signal}_i)\right)$$

### Calibrated Signal Weights:
| Signal Category | Weight | Description |
| :--- | :--- | :--- |
| **Credential Request** | **+25** | Requests OTP, UPI PIN, ATM PIN, CVV, or net banking passwords |
| **Account Threat** | **+20** | Threatens account block, electricity disconnection, or arrest |
| **Unexpected Payment Request** | **+20** | Demands immediate fund transfer |
| **Advance Fee** | **+20** | Requests registration, tax, or verification fees for rewards |
| **Customer Support Payment** | **+20** | Support agent asking user to send money |
| **Brand Masquerading URL** | **+20** | Mimics reputable financial institutions with deceptive hyphens |
| **Prize / Reward Claim** | **+15** | Unsolicited lottery, cashback, or reward notice |
| **Fake Refund** | **+15** | Claims money will be credited only after user sends money |
| **Reverse-Charge Deception** | **+25** | QR or UPI request claiming to 'receive' money via PIN entry |
| **Insecure Protocol (HTTP)** | **+15** | Absence of HTTPS encryption on transaction portals |
| **URL Shortener** | **+15** | Hides genuine target destination |
| **Unknown Sender** | **+10** | Unverified private phone number or non-whitelisted sender |
| **Urgent Language** | **+10** | Artificial scarcity ("today only", "within 15 minutes") |

### Design Risk Thresholds:
- **0 – 30**: **LOW RISK** (Green) — Normal billing or verified peer transaction
- **31 – 60**: **MEDIUM RISK** (Amber) — Unusual characteristics; caution advised
- **61 – 100**: **HIGH RISK** (Crimson) — Prominent coercive or deceptive indicators

---

## 4. Privacy-by-Design Features

1. **Client-side and Server-side Redaction**: Automatic masking of phone numbers (`+91 9876543210` $\rightarrow$ `+91 XXXXXXX210`), emails (`j***e@domain.com`), and 16-digit cards.
2. **Privacy Mode Toggle**: When activated, the original message text is never persisted to the database. Only anonymized signal metadata and scores are stored.
3. **Zero Secret Storage**: ShieldPay AI strictly rejects and never prompts for OTP, UPI PIN, ATM PIN, or banking passwords.
