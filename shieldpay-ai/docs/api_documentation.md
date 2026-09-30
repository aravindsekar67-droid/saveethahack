# ShieldPay AI - REST API Specification

**Base URL**: `http://localhost:8080/api`

---

## 1. POST `/api/scan`
Analyzes a single payment transaction request or message for suspicious signals.

### Request Body:
```json
{
  "message": "Your bank account will be blocked today. Call customer support immediately and pay ₹1,999 to verify your account.",
  "amount": 1999.00,
  "paymentMethod": "UPI",
  "sender": "+91 9876543210",
  "senderType": "Unknown Person",
  "url": "http://sbi-alert-verify.com/login",
  "reason": "Account verification charge to unblock account",
  "privacyMode": false
}
```

### Response:
```json
{
  "id": 1,
  "riskScore": 91,
  "riskLevel": "HIGH",
  "scamCategory": "Account Suspension / Impersonation",
  "confidence": "HIGH",
  "signals": [
    {
      "name": "Account Threat",
      "severity": "HIGH",
      "score": 20,
      "description": "The message claims that an account, service, or connection will be blocked, suspended, or face penalties."
    },
    {
      "name": "Payment Request",
      "severity": "HIGH",
      "score": 20,
      "description": "The message pushes for an immediate financial transfer or payment."
    },
    {
      "name": "Urgent Language",
      "severity": "HIGH",
      "score": 10,
      "description": "The message pressures the recipient to act immediately without giving time to think or verify."
    },
    {
      "name": "Unknown Sender",
      "severity": "MEDIUM",
      "score": 10,
      "description": "The payment request is from an unknown or unverified individual."
    },
    {
      "name": "Insecure Protocol (HTTP)",
      "severity": "HIGH",
      "score": 15,
      "description": "The link does not use encrypted HTTPS, exposing data to interception."
    },
    {
      "name": "Brand Masquerading Domain",
      "severity": "HIGH",
      "score": 20,
      "description": "The domain name appears designed to mimic legitimate financial services with hyphens."
    }
  ],
  "explanation": "This situation contains suspicious signals. The message combines manufactured urgency, an account-related threat, and an unexpected payment request. Verify the request independently through an official channel before sending any money.",
  "recommendation": "DO NOT SEND MONEY. Pause and contact the institution using the official phone number or website from your physical card or official app. Do not dial numbers provided in this message.",
  "privacyMode": false,
  "createdAt": "2026-09-30T11:00:00",
  "amount": 1999.0,
  "paymentMethod": "UPI",
  "senderType": "Unknown Person",
  "maskedSender": "+91 XXXXXXX210"
}
```

---

## 2. POST `/api/scan/conversation`
Analyzes a multi-turn chat sequence to show progressive social-engineering escalation.

### Request Body:
```json
{
  "messages": [
    "Hello, I'm customer support.",
    "Your account has an issue.",
    "Send ₹1 to verify your account.",
    "Do it immediately or your account will be blocked."
  ],
  "senderType": "Unknown Person",
  "paymentMethod": "UPI"
}
```

### Response:
```json
{
  "finalRiskScore": 91,
  "finalRiskLevel": "HIGH",
  "scamCategory": "Account Suspension / Impersonation",
  "timeline": [
    {
      "stepNumber": 1,
      "messageText": "Hello, I'm customer support.",
      "progressiveRiskScore": 25,
      "riskLevel": "LOW",
      "introducedSignals": [
        {"name": "Impersonation Language", "severity": "MEDIUM", "score": 15}
      ]
    },
    {
      "stepNumber": 2,
      "messageText": "Your account has an issue.",
      "progressiveRiskScore": 25,
      "riskLevel": "LOW",
      "introducedSignals": []
    },
    {
      "stepNumber": 3,
      "messageText": "Send ₹1 to verify your account.",
      "progressiveRiskScore": 65,
      "riskLevel": "HIGH",
      "introducedSignals": [
        {"name": "Payment Request", "severity": "HIGH", "score": 20},
        {"name": "Advance Fee", "severity": "HIGH", "score": 20}
      ]
    },
    {
      "stepNumber": 4,
      "messageText": "Do it immediately or your account will be blocked.",
      "progressiveRiskScore": 91,
      "riskLevel": "HIGH",
      "introducedSignals": [
        {"name": "Account Threat", "severity": "HIGH", "score": 20},
        {"name": "Urgent Language", "severity": "HIGH", "score": 10}
      ]
    }
  ]
}
```

---

## 3. POST `/api/scan/url`
Deep heuristics for web links, detecting typosquatting, raw IP addresses, shorteners, and protocol anomalies.

---

## 4. POST `/api/scan/qr`
Decodes and evaluates UPI QR intent strings (`upi://pay?...`) and web redirect QR codes.

---

## 5. POST `/api/feedback`
Records user confirmation on warning utility and actual outcome.

---

## 6. POST `/api/admin/login` & GET `/api/admin/statistics`
Administrative access to aggregated scam intelligence, recurring pattern distributions, and temporal trends.
