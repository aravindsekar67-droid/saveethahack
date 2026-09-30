import React, { useState } from 'react';
import { 
  Gamepad2, 
  ShieldCheck, 
  ShieldAlert, 
  Trophy, 
  RotateCcw, 
  ArrowRight, 
  CheckCircle2, 
  XCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

const SCENARIOS = [
  {
    id: 1,
    category: 'Prize / Lottery Scam',
    message: 'Congratulations! You won ₹50,000 in our festival mega contest. Pay ₹499 processing fee immediately to claim your prize.',
    isScam: true,
    signals: ['Prize / Reward Claim (+15)', 'Advance Fee (+20)', 'Urgent Language (+10)'],
    explanation: 'Legitimate lotteries and contests NEVER require winners to transfer an upfront "processing fee" or "tax" to release prize money.',
  },
  {
    id: 2,
    category: 'Fake Customer Support',
    message: 'Hello, this is SBI Helpdesk executive Vivek. We detected an unauthorized transaction on your card. Send ₹10 to nodal UPI to reverse the charge.',
    isScam: true,
    signals: ['Customer Support Payment (+20)', 'Reverse Charge Trap (+25)', 'Impersonation (+15)'],
    explanation: 'Banks and payment companies NEVER instruct users to transfer money or send UPI tokens to reverse or dispute a charge.',
  },
  {
    id: 3,
    category: 'Legitimate Bill Reminder',
    message: 'Dear Customer, your electricity bill of ₹840 for consumer #98213 is generated. Due date is 15 Oct. Please pay via your registered electricity portal or mobile banking app.',
    isScam: false,
    signals: ['Verified Bill Notice (Low Risk)', 'Directs to official pre-installed app'],
    explanation: 'This is a routine factual utility reminder. It contains no coercive threats, no personal phone numbers, and directs payment to official channels.',
  },
  {
    id: 4,
    category: 'Account Suspension',
    message: 'Your bank account will be blocked today within 2 hours. Call 9876543210 and pay ₹1,999 to update your KYC and keep account active.',
    isScam: true,
    signals: ['Account Threat (+20)', 'Urgent Language (+10)', 'Advance Verification Fee (+20)'],
    explanation: 'Banks never threaten immediate same-day account freezes over SMS demanding payment to personal telephone numbers.',
  },
  {
    id: 5,
    category: 'Fake Refund via QR',
    message: 'Your return refund of ₹3,500 is pending. Scan this QR code and enter your UPI PIN to receive the money directly in your bank account.',
    isScam: true,
    signals: ['Reverse-Charge Deception (+25)', 'Fake Refund (+15)', 'Credential Harvest (+25)'],
    explanation: 'CRITICAL RULE: Entering your UPI PIN or scanning a QR code can ONLY DEDUCT money from your account, NEVER credit it.',
  },
  {
    id: 6,
    category: 'Suspicious Shopping',
    message: 'Flash Deal: Brand new iPhone 15 Pro for ₹12,999 (88% off)! Deal ends in 15 mins. Visit http://apple-deals-secure.in and pay via UPI.',
    isScam: true,
    signals: ['Brand Masquerading Domain (+20)', 'Insecure HTTP (+15)', 'Urgency Framing (+10)'],
    explanation: 'Absurd discounts (e.g. 88% off) coupled with countdown pressure and hyphenated lookalike domains are classic scam storefronts.',
  },
  {
    id: 7,
    category: 'Legitimate Salary Credit',
    message: 'Your account XX9821 has been credited with ₹45,000.00 on 30-Sep-2026 by NEFT-SALARY. Available Balance: ₹52,430.00. - HDFC Bank',
    isScam: false,
    signals: ['Inbound Transaction Notice', 'Masked Account Number', 'No action requested'],
    explanation: 'Genuine standard inbound credit notification. No action or payment is requested from the recipient.',
  },
  {
    id: 8,
    category: 'Credential Harvesting',
    message: 'URGENT: Transaction of ₹28,000 initiated. If you did NOT authorize this, share the 6-digit OTP sent to your phone immediately to stop payment.',
    isScam: true,
    signals: ['Credential Request (+25)', 'Manufactured Panic (+15)'],
    explanation: 'Attackers create fake debit alerts to induce panic so the victim hands over the OTP needed to actually complete the unauthorized charge.',
  },
];

export default function ScamSpotterGame() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [userSelection, setUserSelection] = useState(null); // 'SAFE' or 'SUSPICIOUS'
  const [isGameOver, setIsGameOver] = useState(false);

  const currentScenario = SCENARIOS[currentIndex];

  const handleChoice = (choice) => {
    if (answered) return;
    const isSuspicious = choice === 'SUSPICIOUS';
    const isCorrect = isSuspicious === currentScenario.isScam;
    setUserSelection(choice);
    setAnswered(true);

    if (isCorrect) {
      setScore((prev) => prev + 1);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  const nextScenario = () => {
    if (currentIndex + 1 < SCENARIOS.length) {
      setCurrentIndex((prev) => prev + 1);
      setAnswered(false);
      setUserSelection(null);
    } else {
      setIsGameOver(true);
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
      });
    }
  };

  const restartGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setAnswered(false);
    setUserSelection(null);
    setIsGameOver(false);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '9999px',
          background: 'rgba(56, 189, 248, 0.1)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          color: '#38bdf8',
          fontSize: '0.85rem',
          fontWeight: '700',
          marginBottom: '1rem',
        }}>
          <Gamepad2 size={16} />
          <span>Unique Feature 3 — Interactive Training</span>
        </div>

        <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#f8fafc', marginBottom: '0.5rem' }}>
          Can You Spot the Scam?
        </h1>
        <p style={{ color: '#cbd5e1', fontSize: '1.05rem', maxWidth: '580px', margin: '0 auto' }}>
          Sharpen your scam detection instincts. Read the real-world scenarios and decide whether each is safe or suspicious.
        </p>
      </div>

      {/* Score Tracker Bar */}
      <div className="glass-panel" style={{
        padding: '1rem 1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Trophy size={22} color="#f59e0b" />
          <span style={{ fontWeight: '700', fontSize: '1rem', color: '#f8fafc' }}>
            Detection Score: <span style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>{score}</span> / {SCENARIOS.length}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#94a3b8' }}>
          <span>Scenario</span>
          <span style={{
            padding: '2px 8px',
            borderRadius: '6px',
            background: 'rgba(255, 255, 255, 0.08)',
            color: '#ffffff',
            fontWeight: '700',
            fontFamily: 'var(--font-mono)',
          }}>
            {currentIndex + 1} of {SCENARIOS.length}
          </span>
        </div>
      </div>

      {!isGameOver ? (
        <div className="glass-panel" style={{ padding: '2rem', position: 'relative' }}>
          {/* Scenario Category Tag */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '800',
              padding: '4px 10px',
              borderRadius: '6px',
              background: 'rgba(56, 189, 248, 0.12)',
              color: '#38bdf8',
              textTransform: 'uppercase',
            }}>
              Scenario #{currentIndex + 1}
            </span>
          </div>

          {/* Simulated Message Bubble */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            borderRadius: '14px',
            padding: '1.75rem',
            marginBottom: '2rem',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
          }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>SMS / Message Received:</span>
            </div>
            <p style={{
              fontSize: '1.15rem',
              color: '#f8fafc',
              fontWeight: '500',
              lineHeight: '1.6',
            }}>
              "{currentScenario.message}"
            </p>
          </div>

          {/* Action Choice Buttons */}
          {!answered ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button
                onClick={() => handleChoice('SAFE')}
                className="btn-secondary"
                style={{
                  padding: '16px',
                  fontSize: '1.05rem',
                  fontWeight: '700',
                  color: '#10b981',
                  borderColor: 'rgba(16, 185, 129, 0.4)',
                }}
              >
                <ShieldCheck size={20} />
                SAFE
              </button>

              <button
                onClick={() => handleChoice('SUSPICIOUS')}
                className="btn-danger"
                style={{
                  padding: '16px',
                  fontSize: '1.05rem',
                  fontWeight: '700',
                }}
              >
                <ShieldAlert size={20} />
                SUSPICIOUS
              </button>
            </div>
          ) : (
            /* Result Reveal Box */
            <div>
              {userSelection === (currentScenario.isScam ? 'SUSPICIOUS' : 'SAFE') ? (
                <div style={{
                  padding: '1.25rem',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '1.5rem',
                }}>
                  <CheckCircle2 size={28} color="#10b981" />
                  <div>
                    <h4 style={{ color: '#10b981', fontSize: '1.1rem', fontWeight: '800' }}>
                      Correct! Great instincts.
                    </h4>
                    <p style={{ color: '#f8fafc', fontSize: '0.85rem' }}>
                      You correctly identified this as {currentScenario.isScam ? 'SUSPICIOUS' : 'SAFE'}.
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: '1.25rem',
                  borderRadius: '12px',
                  background: 'rgba(244, 63, 94, 0.12)',
                  border: '1px solid rgba(244, 63, 94, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '1.5rem',
                }}>
                  <XCircle size={28} color="#f43f5e" />
                  <div>
                    <h4 style={{ color: '#fb7185', fontSize: '1.1rem', fontWeight: '800' }}>
                      Incorrect.
                    </h4>
                    <p style={{ color: '#f8fafc', fontSize: '0.85rem' }}>
                      This situation was actually {currentScenario.isScam ? 'SUSPICIOUS' : 'SAFE'}.
                    </p>
                  </div>
                </div>
              )}

              {/* Signals breakdown */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '10px',
                padding: '1.25rem',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                marginBottom: '1.5rem',
              }}>
                <h5 style={{ color: '#38bdf8', fontSize: '0.9rem', fontWeight: '700', marginBottom: '8px' }}>
                  Educational Breakdown & Detected Signals:
                </h5>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  {currentScenario.signals.map((sig, idx) => (
                    <span key={idx} className="badge badge-med" style={{ fontSize: '0.75rem' }}>
                      {sig}
                    </span>
                  ))}
                </div>
                <p style={{ color: '#e2e8f0', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  {currentScenario.explanation}
                </p>
              </div>

              {/* Next Button */}
              <button
                onClick={nextScenario}
                className="btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
              >
                Next Scenario
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Game Over Screen */
        <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #00f2fe, #a855f7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}>
            <Trophy size={42} color="#060913" />
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#f8fafc', marginBottom: '0.5rem' }}>
            Training Completed!
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            Final Score: <strong style={{ color: '#38bdf8', fontSize: '1.5rem' }}>{score}</strong> / {SCENARIOS.length}
          </p>

          <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 2rem' }}>
            {score >= 7
              ? 'Outstanding performance! You have strong vigilance against urgency, advance fees, and lookalike domains.'
              : 'Good effort! Remember: PIN is only entered to send money, and legitimate organizations never threaten instant account blocking over SMS.'}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button onClick={restartGame} className="btn-secondary" style={{ padding: '12px 24px' }}>
              <RotateCcw size={16} />
              Play Again
            </button>
            <button onClick={() => window.location.href = '/scan'} className="btn-primary" style={{ padding: '12px 24px' }}>
              Inspect a Live Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
