package com.shieldpay.config;

import com.shieldpay.entity.*;
import com.shieldpay.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final ScanRepository scanRepository;
    private final ScamPatternRepository scamPatternRepository;
    private final FeedbackRepository feedbackRepository;
    private final AdminEventRepository adminEventRepository;

    public DataInitializer(
            UserRepository userRepository,
            ScanRepository scanRepository,
            ScamPatternRepository scamPatternRepository,
            FeedbackRepository feedbackRepository,
            AdminEventRepository adminEventRepository
    ) {
        this.userRepository = userRepository;
        this.scanRepository = scanRepository;
        this.scamPatternRepository = scamPatternRepository;
        this.feedbackRepository = feedbackRepository;
        this.adminEventRepository = adminEventRepository;
    }

    @Override
    public void run(String... args) {
        initScamPatterns();
        // Zero prefetched history: history strictly logs user's checked links, QR scans, and payments
        scanRepository.deleteAll();
        log.info("Initialized system with zero prefetched history. Scans will be populated by active user checks.");
    }

    private void initScamPatterns() {
        if (scamPatternRepository.count() == 0) {
            List<ScamPattern> patterns = List.of(
                    new ScamPattern("Account Suspension", "account blocked", 20, true),
                    new ScamPattern("Account Suspension", "kyc expired", 20, true),
                    new ScamPattern("Fake Customer Care", "customer support helpline", 15, true),
                    new ScamPattern("Fake Customer Care", "bank manager verification", 15, true),
                    new ScamPattern("Fake Refund", "refund approved", 15, true),
                    new ScamPattern("Fake Refund", "overpayment cashback", 15, true),
                    new ScamPattern("Prize / Lottery", "congratulations winner", 15, true),
                    new ScamPattern("Prize / Lottery", "claim your prize", 15, true),
                    new ScamPattern("Advance Fee", "processing fee required", 20, true),
                    new ScamPattern("Advance Fee", "registration charge", 20, true),
                    new ScamPattern("Credential Harvesting", "share otp", 25, true),
                    new ScamPattern("Credential Harvesting", "enter upi pin", 25, true),
                    new ScamPattern("QR Payment Scam", "scan qr to receive", 20, true),
                    new ScamPattern("Fake Shopping", "90% off clearance sale", 15, true),
                    new ScamPattern("Urgency / Threat", "immediate payment required", 15, true)
            );
            scamPatternRepository.saveAll(patterns);
        }
    }

    private void generateSyntheticData() {
        Random rand = new Random(42);
        String[] paymentMethods = {"UPI", "Bank Transfer", "Card", "Wallet", "Other"};
        String[] senderTypes = {"Unknown Person", "Customer Support", "Business", "Delivery Service", "Known Person"};

        // Template categories with realistic simulated messages
        record Scenario(String category, String msg, String sender, double amount, int score, String riskLevel, String explanation, List<RiskSignal> signals) {}

        List<Scenario> templates = new ArrayList<>();

        // 1. Account Suspension
        templates.add(new Scenario(
                "Account Suspension",
                "Dear Customer, your bank account will be suspended today due to unverified KYC. Call 9876543210 and pay ₹1,999 verification fee immediately to keep it active.",
                "support-alerts@sms.net",
                1999.0,
                91,
                "HIGH",
                "The message combines manufactured urgency, an account-related threat, and an unexpected fee demand.",
                List.of(
                        new RiskSignal("Account Threat", "HIGH", 20, "Claims account will be blocked today."),
                        new RiskSignal("Urgent Language", "HIGH", 10, "Pressures to act immediately."),
                        new RiskSignal("Payment Request", "HIGH", 20, "Demands an unverified fee."),
                        new RiskSignal("Advance Fee", "HIGH", 20, "Requires payment before restoring access."),
                        new RiskSignal("Unknown Sender", "MEDIUM", 10, "Sender is not a registered corporate header.")
                )
        ));

        // 2. Fake Customer Care
        templates.add(new Scenario(
                "Fake Customer Support",
                "Hello, I am Amit from Official Bank Helpdesk. We detected a suspicious charge on your card. Send ₹500 to our temporary nodal UPI to initiate cancellation.",
                "nodal-desk@upi.org",
                500.0,
                75,
                "HIGH",
                "Official customer support never asks customers to transfer money to personal VPAs to dispute transactions.",
                List.of(
                        new RiskSignal("Customer Support Payment Demand", "HIGH", 20, "Support requesting outgoing transfer."),
                        new RiskSignal("Impersonation Language", "MEDIUM", 15, "Poses as bank official."),
                        new RiskSignal("Payment Request", "HIGH", 20, "Demands financial transfer."),
                        new RiskSignal("Unknown Sender", "MEDIUM", 10, "Counterparty is unverified.")
                )
        ));

        // 3. Fake Refund
        templates.add(new Scenario(
                "Fake Refund",
                "Your excess payment of ₹3,500 has been approved for refund. Scan this QR code and approve the request in your UPI app to receive the money.",
                "paytm-refunds@fastmail.com",
                3500.0,
                80,
                "HIGH",
                "Scanning a QR code or entering a PIN can ONLY send money, never receive it.",
                List.of(
                        new RiskSignal("Fake Refund", "MEDIUM", 15, "References unverified refund."),
                        new RiskSignal("QR Payment Request", "HIGH", 25, "Uses reverse charge QR trick."),
                        new RiskSignal("Payment Request", "HIGH", 20, "Initiates outgoing payment flow.")
                )
        ));

        // 4. Prize / Lottery Scam
        templates.add(new Scenario(
                "Prize / Lottery",
                "Congratulations! Your mobile number won ₹2,50,000 in our Grand Diwali Lucky Draw! Pay ₹4,999 government tax processing fee to release your cheque today.",
                "lucky-draw-winner@gmail.com",
                4999.0,
                85,
                "HIGH",
                "Demanding an upfront fee to claim a lottery win is a classic advance-fee fraud model.",
                List.of(
                        new RiskSignal("Prize / Reward Claim", "MEDIUM", 15, "Unsolicited lottery win."),
                        new RiskSignal("Advance Fee", "HIGH", 20, "Requires advance processing charge."),
                        new RiskSignal("Urgent Language", "HIGH", 10, "Emphasizes today only."),
                        new RiskSignal("Payment Request", "HIGH", 20, "Demands immediate payment.")
                )
        ));

        // 5. Credential Harvesting
        templates.add(new Scenario(
                "Credential Harvesting",
                "URGENT: Your credit card transaction of ₹45,000 is pending. If not done by you, share the 6-digit OTP received on your mobile immediately to cancel.",
                "+91 9988776655",
                45000.0,
                95,
                "HIGH",
                "The message attempts to steal your OTP under the guise of stopping a fraud.",
                List.of(
                        new RiskSignal("Credential Request", "HIGH", 25, "Demands one-time password (OTP)."),
                        new RiskSignal("Urgent Language", "HIGH", 10, "Pressures rapid compliance."),
                        new RiskSignal("Impersonation Language", "MEDIUM", 15, "Mimics fraud division.")
                )
        ));

        // 6. Fake Shopping / Clearance
        templates.add(new Scenario(
                "Fake Shopping",
                "Mega Flash Sale: iPhone 15 Pro for only ₹12,999! Limited stock, 90% discount. Click http://apple-deals-secure.in/checkout and pay via UPI now.",
                "flash-deals@promo.biz",
                12999.0,
                78,
                "HIGH",
                "Extreme discounts combined with lookalike domains are strong indicators of fraudulent e-commerce storefronts.",
                List.of(
                        new RiskSignal("Brand Masquerading Domain", "HIGH", 20, "Lookalike domain mimicking official brand."),
                        new RiskSignal("Insecure Protocol (HTTP)", "HIGH", 15, "Missing SSL encryption."),
                        new RiskSignal("Urgent Language", "HIGH", 10, "Artificial scarcity pressure.")
                )
        ));

        // 7. Urgency / Threat Scam
        templates.add(new Scenario(
                "Urgency / Threat",
                "Electricity Department Alert: Your power will be disconnected at 9:30 PM tonight due to previous month bill non-update. Pay ₹2,150 to electricity officer immediately.",
                "+91 9123456780",
                2150.0,
                88,
                "HIGH",
                "Utility disconnection threats accompanied by personal phone numbers and instant payment requests are fraudulent.",
                List.of(
                        new RiskSignal("Account Threat", "HIGH", 20, "Threat of utility disconnection."),
                        new RiskSignal("Urgent Language", "HIGH", 10, "Fixed deadline tonight."),
                        new RiskSignal("Payment Request", "HIGH", 20, "Direct payment demand."),
                        new RiskSignal("Unknown Sender", "MEDIUM", 10, "Unregistered private mobile number.")
                )
        ));

        // 8. Legitimate Transactions (LOW RISK)
        templates.add(new Scenario(
                "Legitimate Bill Reminder",
                "Dear Customer, your electricity bill of ₹840 for consumer no. 102938 is generated and due on 15 Oct. Pay via your official electricity portal or banking app.",
                "BESCOM-OFFICIAL",
                840.0,
                15,
                "LOW",
                "Standard factual billing reminder from verified utility provider without coercive threats or personal account transfers.",
                List.of(
                        new RiskSignal("Payment Request", "LOW", 10, "Routine utility invoice.")
                )
        ));

        templates.add(new Scenario(
                "Legitimate E-Commerce Invoice",
                "Your order #402-91823 has been shipped. Total paid: ₹1,299 via Card. Track your package on your official Amazon mobile app.",
                "AMAZON-IN",
                1299.0,
                5,
                "LOW",
                "Transaction confirmation directing user to their official pre-installed mobile application.",
                List.of()
        ));

        templates.add(new Scenario(
                "Legitimate Peer Split",
                "Hey Rahul, here is my share for yesterday's dinner: ₹450. Sent to your regular UPI ID.",
                "Priya Sharma",
                450.0,
                0,
                "LOW",
                "Casual peer-to-peer expense split between known acquaintances.",
                List.of()
        ));

        // Generate 105 synthetic records across the past 7 days
        LocalDateTime now = LocalDateTime.now();
        for (int i = 0; i < 105; i++) {
            Scenario t = templates.get(i % templates.size());
            int daysAgo = rand.nextInt(7);
            int hoursAgo = rand.nextInt(24);
            int minutesAgo = rand.nextInt(60);
            LocalDateTime scanTime = now.minusDays(daysAgo).minusHours(hoursAgo).minusMinutes(minutesAgo);

            Scan scan = new Scan();
            scan.setScamCategory(t.category);
            scan.setMessage(t.msg);
            scan.setSender(t.sender);
            scan.setSenderType(senderTypes[rand.nextInt(senderTypes.length)]);
            scan.setPaymentMethod(paymentMethods[rand.nextInt(paymentMethods.length)]);
            scan.setAmount(t.amount + (rand.nextInt(50) * 10));
            scan.setRiskScore(Math.max(0, Math.min(100, t.score + (rand.nextInt(7) - 3))));
            scan.setRiskLevel(t.riskLevel);
            scan.setConfidence(scan.getRiskScore() >= 60 ? "HIGH" : (scan.getRiskScore() >= 30 ? "MEDIUM" : "LOW"));
            scan.setExplanation(t.explanation);
            scan.setRecommendation("Verify through official registered channels before taking any action.");
            scan.setPrivacyMode(rand.nextBoolean());
            scan.setCreatedAt(scanTime);

            for (RiskSignal sig : t.signals) {
                RiskSignal clone = new RiskSignal(sig.getSignalName(), sig.getSeverity(), sig.getScore(), sig.getDescription());
                scan.addSignal(clone);
            }

            Scan saved = scanRepository.save(scan);

            // Add simulated feedback for 40% of scans
            if (rand.nextDouble() < 0.4) {
                boolean useful = rand.nextDouble() < 0.88;
                String actual = scan.getRiskScore() >= 60 ? (rand.nextDouble() < 0.9 ? "YES" : "NOT_SURE") : "NO";
                feedbackRepository.save(new Feedback(saved.getId(), useful, actual, "Demonstration feedback recorded during simulation testing."));
            }
        }
    }
}
