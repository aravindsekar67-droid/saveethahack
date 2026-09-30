# ShieldPay AI - 3–5 Minute Hackathon Demonstration Script

**Pitch Scenario**: A student receives an alarming SMS:  
> *"Your bank account will be blocked today. Call customer support immediately and pay ₹1,999 to verify your account."*

---

## Step-by-Step Presentation Walkthrough

### 1. Introduction (30 seconds)
- **Presenter**: "Good morning judges! Today over 80% of digital payment fraud happens through social engineering—not technical system hacks. Victims are manipulated into typing their own UPI PIN or transferring money themselves. Once the money leaves the bank account, it is gone. That's why we built **ShieldPay AI: Think Before You Pay**—a pre-transaction decision-support system that catches the subtle psychological and technical scam signals *before* money is sent."

### 2. Live Payment Scanner Demo (60 seconds)
- Navigate to `http://localhost:5173/scan` (or click **[Check a Payment]** on the home page).
- Click **[TRY DEMO SCAM]** or select the **Account Suspension** demo card.
- Show the auto-populated details:
  - Message: *"Your bank account will be blocked today..."*
  - Amount: `₹1,999`
  - Method: `UPI`
  - Sender: `Unknown Person`
  - URL: `http://sbi-alert-verify.com/login`
- Show the **Privacy Mode** toggle and the prominent security advisory:
  > *"Never enter OTP, UPI PIN, card PIN, CVV, passwords, or banking credentials."*
- Click **[ANALYZE PAYMENT]**.

### 3. Animated Analysis Loading & Risk Result (60 seconds)
- The application executes animated multi-stage verification:
  - ✓ Reading message
  - ✓ Detecting urgency
  - ✓ Checking payment context
  - ✓ Analyzing URL
  - ✓ Matching scam patterns
  - ✓ Calculating risk
  - ✓ Generating explanation
- **Risk Result Screen Display**:
  - Point to the animated **91 / 100 HIGH RISK** circular gauge with vibrant crimson glow.
  - Highlight the transparent **Why are we warning you?** signal cards:
    - Urgency (+10)
    - Account Threat (+20)
    - Payment Request (+20)
    - Unknown Sender (+10)
    - Suspicious URL (+15)
    - Advance Fee (+15)
  - Point out the **AI Safety Explanation**:
    > *"This message combines urgency, an account-related threat, and an unexpected payment request..."*
  - Review the **Before You Pay** Safety Action Checklist.
  - Test the interactive feedback prompt: *"Was this warning useful?"* $\rightarrow$ Click **[YES]**.

### 4. Interactive Conversation Timeline (45 seconds)
- Click **[Conversation Analyzer]** in the navigation bar.
- Demonstrate how scams unfold over time:
  - Message 1: "Hello, I'm customer support." $\rightarrow$ Risk: **15**
  - Message 2: "Your account has an issue." $\rightarrow$ Risk: **25**
  - Message 3: "Send ₹1 to verify your account." $\rightarrow$ Risk: **65**
  - Message 4: "Do it immediately or your account will be blocked." $\rightarrow$ Risk: **91**
- Show the interactive risk evolution curve and point out the specific message that tipped the transaction into the danger zone!

### 5. Interactive QR & URL Deep Analyzers (30 seconds)
- Quick toggle to **QR Analyzer**: Demonstrate scanning a simulated UPI Collect request (`upi://pay?...`) with embedded reverse-charge deception.
- Quick toggle to **URL Analyzer**: Show how an unencrypted HTTP link or brand-masquerading URL gets flagged before clicking.

### 6. Scam Spotter Game (30 seconds)
- Click **[Scam Spotter Game]**:
  - Show interactive scenario: *"Congratulations! You won ₹50,000. Pay ₹499 processing fee immediately..."*
  - Click **[SUSPICIOUS]** $\rightarrow$ Instant feedback with signal breakdown and celebratory progress counter!

### 7. Admin Intelligence Dashboard (30 seconds)
- Login to `/admin/login` (`admin@shieldpay.ai` / `ShieldAdmin@2026`).
- Present:
  - Real-time KPI counters (Total Scans: 1,245+, High: 215, Medium: 340, Low: 690)
  - Recharts visual charts: Risk Distribution, Scam Category Breakdown, 7-Day Trend Curve
  - **Recurring Causes of Risk Warnings**:
    - Urgency (48%)
    - Payment Request (42%)
    - Unknown Sender (37%)
    - Threat Language (31%)
    - Suspicious URL (26%)
  - Emphasize the clear transparency disclaimer: *"Demonstration data — not live crime statistics."*

### 8. Closing Pitch (15 seconds)
- "ShieldPay AI puts the power back into users' hands with privacy-first AI, deterministic transparency, and zero credential collection. Thank you!"
