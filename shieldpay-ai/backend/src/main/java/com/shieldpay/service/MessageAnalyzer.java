package com.shieldpay.service;

import com.shieldpay.dto.RiskSignalResponse;
import com.shieldpay.util.TextNormalizer;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Service
public class MessageAnalyzer {

    // 1. Coercive Urgency & Manufactured Deadlines
    private static final Pattern URGENCY_PATTERN = Pattern.compile(
            "\\b(urgent|urgently|immediately|right now|act now|today only|within \\d+ (hours|mins|minutes)|tonight|at \\d{1,2}(:\\d{2})?\\s*(am|pm)?|before midnight|hurry|expires soon|final warning|last chance|asap|time is running out)\\b",
            Pattern.CASE_INSENSITIVE
    );

    // 2. Coercive Threat Language (Account, Utilities, Legal, Digital Arrest)
    private static final Pattern THREAT_PATTERN = Pattern.compile(
            "\\b(account block(ed)?|account suspend(ed)?|will be block(ed)?|will be suspend(ed)?|service disconnect(ed)?|will be disconnect(ed)?|electricity disconnect(ed)?|power disconnect(ed)?|water disconnect(ed)?|sim block(ed)?|card deactivat(ed)?|digital arrest|arrest warrant|police summons|cbi|customs detention|legal notice|court action|kyc expir(ed)?|pan card block(ed)?|penalty|fir( #| registered| lodged)?|money laundering)\\b",
            Pattern.CASE_INSENSITIVE
    );

    // 3. Direct or Indirect Payment Requests
    private static final Pattern PAYMENT_REQUEST_PATTERN = Pattern.compile(
            "\\b(send money|pay now|transfer now|transfer ₹|transfer rs|send ₹|pay ₹|pay rs|send rs|remit|deposit money|clear dues|unpaid bill|make payment|send payment|pay to avoid|deposit advance|bail security|security deposit|clearing account|call .* to stop)\\b",
            Pattern.CASE_INSENSITIVE
    );

    // 4. Credential Harvesting Traps (Critical Red Line)
    private static final Pattern CREDENTIAL_PATTERN = Pattern.compile(
            "\\b(otp|one time password|upi pin|atm pin|cvv|card number|netbanking password|login credentials|share your code|enter pin to receive|verify pin|secret pin)\\b",
            Pattern.CASE_INSENSITIVE
    );

    // 5. Advance Fee / Registration / Clearance Fees
    private static final Pattern ADVANCE_FEE_PATTERN = Pattern.compile(
            "\\b(processing fee|registration fee|verification fee|clearance fee|advance fee|refundable deposit|security deposit|bail security|activation fee|handling fee|courier charges|customs clearance|vip deposit)\\b",
            Pattern.CASE_INSENSITIVE
    );

    // 6. Greed / Lottery / Prize Baits
    private static final Pattern PRIZE_PATTERN = Pattern.compile(
            "\\b(congratulations|winner|you won|won ₹|won rs|lottery|kbc|lucky draw|cash prize|claim your prize|selected for reward|bonus reward|gift card claim)\\b",
            Pattern.CASE_INSENSITIVE
    );

    // 7. Reverse-Charge / Fake Refund Bait
    private static final Pattern FAKE_REFUND_PATTERN = Pattern.compile(
            "\\b(refund approved|claim refund|pending refund|excess amount refund|overpayment refund|tax refund|cashback pending|money will be credited after sending|scan qr to receive|approve collect request)\\b",
            Pattern.CASE_INSENSITIVE
    );

    // 8. Impersonation of Authorities or Corporate Helpdesks
    private static final Pattern IMPERSONATION_PATTERN = Pattern.compile(
            "\\b(customer support|customer care|bank manager|executive|official helpline|tech support|fraud department|nodal officer|electricity (officer|department)|customs officer|cbi officer|cyber crime (branch|cell)|police inspector|officer .* immediately)\\b",
            Pattern.CASE_INSENSITIVE
    );

    // 9. Work-from-Home / Part-Time Job / Task Scams
    private static final Pattern TASK_SCAM_PATTERN = Pattern.compile(
            "\\b(part time job|earn \\d+ daily|like youtube videos|rate hotels|daily payout|work from home|telegram task|deposit to unlock vip|prepaid task)\\b",
            Pattern.CASE_INSENSITIVE
    );

    // 10. Legitimate Informational / Bank Receipt Markers (Counter-Signals)
    private static final Pattern BENIGN_RECEIPT_PATTERN = Pattern.compile(
            "\\b(debited from a/c|credited to a/c|available bal|avail bal|txn id|ref no|pos txn|atm wdl|upi/[0-9]+|received from|dinner split|lunch split|room rent|here is my share)\\b",
            Pattern.CASE_INSENSITIVE
    );

    public List<RiskSignalResponse> analyzeText(String rawText) {
        List<RiskSignalResponse> signals = new ArrayList<>();
        if (rawText == null || rawText.isBlank()) {
            return signals;
        }

        String normalized = TextNormalizer.normalize(rawText);

        // 1. Check Credential Harvesting (Highest Defect Severity)
        if (CREDENTIAL_PATTERN.matcher(normalized).find()) {
            signals.add(new RiskSignalResponse(
                    "Credential Request Trap",
                    "HIGH",
                    35,
                    "CRITICAL DEFECT: The message asks for secret credentials (OTP, UPI PIN, ATM PIN, or CVV). Legitimate banks and financial institutions NEVER ask for your PIN or OTP to credit money."
            ));
        }

        // 2. Check Threat Language (Account, Disconnection, Legal, Digital Arrest)
        if (THREAT_PATTERN.matcher(normalized).find()) {
            signals.add(new RiskSignalResponse(
                    "Coercive Threat & Intimidation",
                    "HIGH",
                    25,
                    "The message manufactures an urgent threat (e.g. account suspension, electricity disconnection, or digital arrest) designed to induce panic."
            ));
        }

        // 3. Check Advance Fee Traps
        if (ADVANCE_FEE_PATTERN.matcher(normalized).find()) {
            signals.add(new RiskSignalResponse(
                    "Upfront Advance Fee Demand",
                    "HIGH",
                    25,
                    "The message requests an advance fee (registration, processing, customs, or refundable deposit) before releasing promised funds or services."
            ));
        }

        // 4. Check Work From Home / Part-Time Job Task Traps
        if (TASK_SCAM_PATTERN.matcher(normalized).find()) {
            signals.add(new RiskSignalResponse(
                    "Task / Part-Time Job Social Engineering",
                    "HIGH",
                    25,
                    "Promised high daily earnings for trivial online tasks (e.g. liking videos) followed by upfront deposits to unlock withdrawals."
            ));
        }

        // 5. Check Unexpected Payment Requests
        if (PAYMENT_REQUEST_PATTERN.matcher(normalized).find()) {
            signals.add(new RiskSignalResponse(
                    "Unsolicited Payment Demand",
                    "HIGH",
                    20,
                    "The message pushes for an immediate financial transfer or payment."
            ));
        }

        // 6. Check Fake Refund / Cashback Reverse-Charge Bait
        if (FAKE_REFUND_PATTERN.matcher(normalized).find()) {
            signals.add(new RiskSignalResponse(
                    "Reverse-Charge Deception Bait",
                    "HIGH",
                    25,
                    "Promises a refund or cashback, tricking users into scanning QR codes or approving collect requests that actually withdraw money."
            ));
        }

        // 7. Check Prize / Lottery Scams
        if (PRIZE_PATTERN.matcher(normalized).find()) {
            signals.add(new RiskSignalResponse(
                    "Unsolicited Prize / Reward Bait",
                    "MEDIUM",
                    20,
                    "Claims an unexpected lottery win, reward, or bonus to lure the user into paying advance charges."
            ));
        }

        // 8. Check Impersonation Language
        if (IMPERSONATION_PATTERN.matcher(normalized).find()) {
            signals.add(new RiskSignalResponse(
                    "Institutional Impersonation",
                    "MEDIUM",
                    15,
                    "Sender claims to be a bank manager, police officer, or customer care executive to construct false authority."
            ));
        }

        // 9. Check Manufactured Urgency
        if (URGENCY_PATTERN.matcher(normalized).find()) {
            signals.add(new RiskSignalResponse(
                    "Manufactured Time Urgency",
                    "HIGH",
                    15,
                    "Imposes extreme artificial time pressure ('immediately', 'tonight', 'within 15 minutes') to prevent calm verification."
            ));
        }

        // 10. Check Legitimate Informational Receipt (Counter-Signal)
        boolean hasThreatOrDemands = signals.stream().anyMatch(s -> s.getSeverity().equals("HIGH"));
        if (!hasThreatOrDemands && BENIGN_RECEIPT_PATTERN.matcher(normalized).find()) {
            signals.add(new RiskSignalResponse(
                    "Standard Informational Transaction Receipt",
                    "LOW",
                    5,
                    "The message matches the format of an automated post-transaction debit/credit confirmation SMS. It contains no payment demands or coercive calls to action."
            ));
        }

        return signals;
    }
}
