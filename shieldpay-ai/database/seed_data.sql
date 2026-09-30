-- ==========================================================
-- ShieldPay AI - Seed Data (Realistic Synthetic Demonstration Records)
-- Challenge VH-S02: Detecting Digital Payment Scams Before Money Is Sent
-- NOTE: All data is synthetic demonstration telemetry.
-- ==========================================================

USE shieldpay;

-- Default Administrative User
INSERT INTO users (name, email, role, created_at)
VALUES ('ShieldPay Administrator', 'admin@shieldpay.ai', 'ADMIN', NOW())
ON DUPLICATE KEY UPDATE name=name;

-- Standard Scam Patterns for Heuristic Matching
INSERT INTO scam_patterns (category, keyword, weight, enabled) VALUES
('Account Suspension', 'account blocked', 20, TRUE),
('Account Suspension', 'account suspended', 20, TRUE),
('Account Suspension', 'kyc expired', 20, TRUE),
('Fake Customer Care', 'customer support helpline', 15, TRUE),
('Fake Customer Care', 'bank manager verification', 15, TRUE),
('Fake Refund', 'refund approved', 15, TRUE),
('Fake Refund', 'overpayment cashback', 15, TRUE),
('Prize / Lottery', 'congratulations winner', 15, TRUE),
('Prize / Lottery', 'claim your prize', 15, TRUE),
('Advance Fee', 'processing fee required', 20, TRUE),
('Advance Fee', 'registration charge', 20, TRUE),
('Credential Harvesting', 'share otp', 25, TRUE),
('Credential Harvesting', 'enter upi pin', 25, TRUE),
('QR Payment Scam', 'scan qr to receive', 20, TRUE),
('Fake Shopping', '90% off clearance sale', 15, TRUE),
('Urgency / Threat', 'immediate payment required', 15, TRUE);

-- Sample Scans & Signals
INSERT INTO scans (id, user_id, message, amount, payment_method, sender, sender_type, url, reason, risk_score, risk_level, scam_category, confidence, explanation, recommendation, privacy_mode, created_at)
VALUES
(1, 1, 'Your bank account will be blocked today. Call customer support immediately and pay ₹1,999 to verify your account.', 1999.00, 'UPI', '+91 9876543210', 'Unknown Person', 'http://sbi-alert-verify.com/login', 'Account verification fee to prevent permanent suspension', 91, 'HIGH', 'Account Suspension / Impersonation', 'HIGH', 'This situation contains suspicious signals. The message combines manufactured urgency, an account-related threat, and an unexpected payment request.', 'DO NOT SEND MONEY. Pause and contact the institution using the official phone number from your physical card or official app.', FALSE, NOW()),
(2, 1, 'Congratulations! You won ₹50,000 in lucky draw. Pay ₹499 registration fee immediately to claim prize.', 499.00, 'UPI', 'diwali-rewards@gmail.com', 'Unknown Person', 'http://prize-winner-portal.net', 'Government tax processing fee', 80, 'HIGH', 'Prize / Lottery', 'HIGH', 'The scenario promises a large reward but demands an upfront processing fee.', 'Verify whether you entered any genuine contest. Genuine rewards never demand upfront advance money.', FALSE, NOW()),
(3, 1, 'Dear Customer, your electricity bill of ₹840 for account #102938 is generated and due on 15 Oct. Pay via official portal.', 840.00, 'Bank Transfer', 'BESCOM-OFFICIAL', 'Business', 'https://bescom.karnataka.gov.in', 'Routine utility invoice', 10, 'LOW', 'Legitimate Payment', 'LOW', 'No prominent suspicious signals detected. Standard precautions apply.', 'Verify payee details on the official utility portal.', FALSE, NOW());

-- Associated Signals
INSERT INTO risk_signals (scan_id, signal_name, severity, score, description) VALUES
(1, 'Account Threat', 'HIGH', 20, 'Claims account will be blocked today.'),
(1, 'Urgent Language', 'HIGH', 10, 'Pressures to act immediately without verifying.'),
(1, 'Payment Request', 'HIGH', 20, 'Demands an unverified fee.'),
(1, 'Advance Fee', 'HIGH', 20, 'Requires payment before restoring access.'),
(1, 'Unknown Sender', 'MEDIUM', 10, 'Sender is not a registered corporate header.'),
(1, 'Suspicious URL', 'HIGH', 15, 'Lookalike unencrypted HTTP link.'),
(2, 'Prize / Reward Claim', 'MEDIUM', 15, 'Claims unexpected lottery prize.'),
(2, 'Advance Fee', 'HIGH', 20, 'Demands upfront registration fee.'),
(2, 'Urgent Language', 'HIGH', 10, 'Forces immediate action.'),
(3, 'Payment Request', 'LOW', 10, 'Routine utility bill request.');

-- Associated Feedback
INSERT INTO feedback (scan_id, useful, actual_status, comments, created_at) VALUES
(1, TRUE, 'YES', 'Helped identify a fake banking scam SMS.', NOW()),
(2, TRUE, 'YES', 'Recognized the lottery scam before paying fee.', NOW()),
(3, TRUE, 'NO', 'Confirmed genuine bill.', NOW());
