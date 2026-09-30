# DOOMSDAY AI — Pre-Transaction Digital Payment Defense

> **Challenge VH-S02**: Detecting Digital Payment Scams Before Money Is Sent  
> **Tagline**: *"Detect suspicious signals and critical defects BEFORE your money leaves your account."*

DOOMSDAY AI is a privacy-conscious, client-server decision-support platform engineered to detect social engineering, psychological urgency, fake customer care, reverse-charge QR traps, deceptive links, and fraudulent payment demands **before** a user authorizes money to leave their account.

---

## 1. Problem Statement
In modern digital payment ecosystems (UPI, IMPS, Net Banking, Cards), over 80% of consumer fraud occurs not through network hacks, but via **social engineering**. Victims are coerced into entering their UPI PIN, scanning reverse-charge QR codes, or transferring "clearance/verification fees" under manufactured panic. 

Once a digital transaction is authorized, money leaves the account instantly and is virtually impossible to recall. Traditional anti-fraud systems evaluate risks post-authorization; consumers need **pre-transaction behavioral decision support**.

---

## 2. Solution Overview
DOOMSDAY AI acts as an intelligent safety checkpoint prior to transaction dispatch. It analyzes:
- Unsolicited SMS, WhatsApp, and email messages
- Payment amounts (including micro-payment ₹1 verification traps)
- Destination URLs, lookalike domains, unencrypted HTTP portals, and APK payload downloads
- UPI QR intents (`upi://pay?...`) with reverse-charge deception checks
- Sender novelty, impersonation of authority (police, CBI, electricity officers)

DOOMSDAY AI calculates an additive, transparent **0–100 Risk Score**, groups indicators into **LOW / MEDIUM / HIGH** risk levels, identifies the specific scam vector, generates plain-language AI safety explanations, and equips users with structured verification checklists.

---

## 3. Key Capabilities & Innovations

### 🛡️ Core Defense Engines
1. **Pre-Transaction Payment Scanner**: Analyzes text messages, requested amounts, sender identifiers, and payment context. Evaluates realistic threat patterns (Utility Disconnections, Digital Arrests, KYC Traps) vs. Authentic Transaction Receipts.
2. **Real vs. Scam Defect Sensor**:
   - **Real Messages**: Recognizes standard debit notifications (`debited from a/c`, `ref no`) and casual peer splits with 0%–15% Low Risk.
   - **Scam Messages**: Senses manufactured deadlines ("tonight at 9:30 PM"), threats of arrest/cut-off, and unofficial redirections with 80%–95% High Risk.
3. **Link Defect Sensor & Anatomy Guide**: Evaluates web destinations with heuristic inspection of protocols, brand masquerading, high-risk TLDs (`.xyz`, `.top`), raw IPs, and direct APK malware payloads.
4. **Deep UPI QR Fraud Inspector**: In-browser client-side QR decoding via `jsQR` with parameter extraction and reverse-charge "scan to receive" deception detection.
5. **Interactive Spotter Training Game**: Gamified training module with realistic scenarios, score tracking, signal breakdowns, and instant feedback.
6. **Real-Time Audit History**: User-driven audit trail containing only actual checked links, QR codes, and payments (zero pre-seeded or dummy records).
7. **Admin Threat Intelligence Portal**:
   - **Active Operator Name Display**: Shows the authenticated admin's registered name, email, and live status.
   - **Real-Time Metrics**: Total scans, risk distributions, vector frequencies, and geographic community telemetry charts via Recharts.
8. **Privacy-First Architecture**: Automatic client-side and server-side PII redaction (phone numbers, emails, card numbers). Zero-credential policy: never stores or asks for UPI PIN, OTP, or CVV.

---

## 4. Architecture & Technology Stack

```
   [React 18 Frontend (Vite)]       [Spring Boot 3.3.4 (Java 21)]         [MySQL 8.0 / H2 Memory Fallback]
  - Lucide React Icons             - Spring Web REST API                 - Auto-fallback data persistence
  - Recharts Visualizations        - Deterministic Heuristic RiskEngine  - Tables: users, scans,
  - Axios HTTP Client              - PrivacyMasker PII Redaction           risk_signals, scam_patterns,
  - Glassmorphism Design Tokens    - Spring Data JPA & Hibernate           admin_events
```

- **Frontend**: React 18, Vite, React Router DOM, Recharts, Lucide React, Axios, Canvas Confetti, jsQR
- **Backend**: Java 21, Spring Boot 3.3.4, Spring Data JPA, Hibernate, Maven
- **Database**: MySQL 8.0 with automatic zero-configuration H2 in-memory fallback

---

## 5. Getting Started & Local Setup

### Prerequisites
- **Node.js** (v18+) & **npm**
- **Java JDK 21**
- **Maven 3.8+** (or included wrapper)

### 1. Start the Backend API
```bash
cd backend
mvn spring-boot:run
```
The Spring Boot backend will start on `http://localhost:8080`.

### 2. Start the Frontend Application
```bash
cd frontend
npm install
npm run dev
```
The Vite development server will open on `http://localhost:5173`.

---

## 6. API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/scan` | Analyze payment message, sender, amount, and context |
| `POST` | `/api/scan/url` | Inspect URL for brand masquerading and defects |
| `POST` | `/api/scan/qr` | Decode and analyze UPI QR payload |
| `GET` | `/api/history` | Retrieve verified user scan audit logs |
| `DELETE` | `/api/history` | Clear user scan history |
| `POST` | `/api/admin/register` | Register an administrator account |
| `POST` | `/api/admin/login` | Authenticate administrator session |
| `GET` | `/api/admin/status` | Check if administrator accounts exist |
| `GET` | `/api/admin/statistics` | Aggregate threat intelligence metrics |
| `GET` | `/api/admin/trends` | Historical threat pattern telemetry |

---

## 7. Security & Ethical Safeguards
- **Zero-Credential Policy**: DOOMSDAY AI will never ask for or store passwords, OTPs, or UPI PINs.
- **Privacy Mode**: PII is masked before persistence.
- **Defensive Focus**: Designed strictly for consumer protection and defense education.
