import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckSquare, 
  Square, 
  HelpCircle, 
  Sparkles, 
  ArrowLeft, 
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import RiskGauge from '../components/RiskGauge';
import SignalCard from '../components/SignalCard';
import ScoreBreakdown from '../components/ScoreBreakdown';
import FeedbackPrompt from '../components/FeedbackPrompt';

export default function RiskResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const scan = location.state?.scanResult;

  const [checklist, setChecklist] = useState({
    c1: false,
    c2: false,
    c3: false,
    c4: false,
    c5: false,
    c6: false,
    c7: false,
  });

  const toggleCheck = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!scan) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', padding: '2rem' }} className="glass-panel">
        <AlertTriangle size={48} color="#f59e0b" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ color: '#f8fafc', marginBottom: '0.5rem' }}>No Active Scan Selected</h2>
        <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
          Please analyze a transaction or select a scenario from the scanner to view its risk breakdown.
        </p>
        <Link to="/scan" className="btn-primary">
          Open Payment Scanner
        </Link>
      </div>
    );
  }

  const {
    id,
    riskScore = 0,
    riskLevel = 'LOW',
    scamCategory = 'General Communication',
    confidence = 'HIGH',
    signals = [],
    explanation = '',
    recommendation = '',
    amount,
    paymentMethod,
    maskedSender,
    originalMessage,
    privacyMode,
  } = scan;

  const allChecked = Object.values(checklist).every(Boolean);

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
      {/* Back button & scan header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <button
          onClick={() => navigate('/scan')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: '#38bdf8',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600',
          }}
        >
          <ArrowLeft size={16} />
          Back to Scanner
        </button>

        {privacyMode && (
          <span className="badge badge-low">
            Privacy Redaction Active
          </span>
        )}
      </div>

      {/* Primary UX Alert Banner */}
      <div style={{
        background: riskLevel === 'HIGH' ? 'rgba(244, 63, 94, 0.16)' : riskLevel === 'MEDIUM' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
        border: `1px solid ${riskLevel === 'HIGH' ? 'rgba(244, 63, 94, 0.5)' : riskLevel === 'MEDIUM' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: riskLevel === 'HIGH' ? '0 0 25px rgba(244, 63, 94, 0.15)' : '0 0 20px rgba(16, 185, 129, 0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {riskLevel === 'HIGH' ? (
            <ShieldAlert size={32} color="#f43f5e" style={{ flexShrink: 0 }} />
          ) : riskLevel === 'MEDIUM' ? (
            <AlertTriangle size={32} color="#f59e0b" style={{ flexShrink: 0 }} />
          ) : (
            <ShieldCheck size={32} color="#10b981" style={{ flexShrink: 0 }} />
          )}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className={`badge ${riskLevel === 'HIGH' ? 'badge-high' : riskLevel === 'MEDIUM' ? 'badge-med' : 'badge-low'}`} style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                {riskLevel === 'HIGH' ? 'CRITICAL SCAM WARNING' : riskLevel === 'MEDIUM' ? 'SUSPICIOUS CAUTION' : 'AUTHENTIC & REAL MESSAGE'}
              </span>
            </div>
            <h2 style={{
              fontSize: '1.3rem',
              fontWeight: '900',
              color: '#ffffff',
              letterSpacing: '0.01em',
              margin: '4px 0 2px',
            }}>
              {riskLevel === 'HIGH'
                ? 'HIGH-PROBABILITY SCAM DEFECTS DETECTED — DO NOT PAY.'
                : riskLevel === 'MEDIUM'
                ? 'SUSPICIOUS INDICATORS DETECTED — EXERCISE CAUTION.'
                : 'AUTHENTIC COMMUNICATION VERIFIED — NO COERCIVE THREATS.'}
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.85rem', margin: 0 }}>
              {recommendation}
            </p>
          </div>
        </div>

        <Link
          to="/history"
          className="btn-secondary"
          style={{ padding: '8px 14px', fontSize: '0.85rem' }}
        >
          View Audit History <ChevronRight size={14} />
        </Link>
      </div>

      {/* Main Grid: Left Circular Gauge & Category, Right AI Explanation */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
      }}>
        {/* Left: Gauge Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <RiskGauge score={riskScore} level={riskLevel} size={220} />

          {/* Scam Category Box */}
          <div style={{
            marginTop: '1.5rem',
            width: '100%',
            padding: '1rem',
            borderRadius: '12px',
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>
                Possible Scam Pattern
              </span>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: '800',
                color: confidence === 'HIGH' ? '#f43f5e' : '#f59e0b',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '2px 8px',
                borderRadius: '4px',
              }}>
                {confidence} CONFIDENCE
              </span>
            </div>
            <h4 style={{ color: '#f8fafc', fontSize: '1.1rem', fontWeight: '800' }}>
              {scamCategory}
            </h4>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px', fontStyle: 'italic' }}>
              Classification is based on available observable signals and may be incomplete.
            </p>
          </div>
        </div>

        {/* Right: AI Safety Explanation */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <Sparkles size={20} color="#a855f7" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#f8fafc' }}>
                AI Safety Explanation
              </h3>
            </div>

            <div style={{
              background: 'rgba(168, 85, 247, 0.08)',
              borderLeft: '4px solid #a855f7',
              borderRadius: '0 10px 10px 0',
              padding: '1.2rem',
              color: '#e2e8f0',
              fontSize: '0.95rem',
              lineHeight: '1.6',
              marginBottom: '1.5rem',
            }}>
              "{explanation}"
            </div>

            {/* Context Summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#94a3b8' }}>
              {amount && (
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '6px' }}>
                  <span>Requested Amount:</span>
                  <strong style={{ color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>₹{amount.toLocaleString('en-IN')}</strong>
                </div>
              )}
              {paymentMethod && (
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '6px' }}>
                  <span>Payment Channel:</span>
                  <strong style={{ color: '#f8fafc' }}>{paymentMethod}</strong>
                </div>
              )}
              {maskedSender && (
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '6px' }}>
                  <span>Sender Identifier:</span>
                  <strong style={{ color: '#f8fafc' }}>{maskedSender}</strong>
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '8px' }}>
            <Link to="/url-analyzer" className="btn-secondary" style={{ flex: 1, padding: '10px', fontSize: '0.8rem', textAlign: 'center' }}>
              Check Related Links
            </Link>
            <Link to="/qr-analyzer" className="btn-secondary" style={{ flex: 1, padding: '10px', fontSize: '0.8rem', textAlign: 'center' }}>
              Check QR Codes
            </Link>
          </div>
        </div>
      </div>

      {/* Real vs Scam Defect Diagnosis Breakdown */}
      <div className="glass-panel" style={{
        padding: '1.5rem',
        marginBottom: '2rem',
        borderLeft: `4px solid ${riskLevel === 'HIGH' ? '#f43f5e' : riskLevel === 'MEDIUM' ? '#f59e0b' : '#10b981'}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <ShieldAlert size={20} color={riskLevel === 'HIGH' ? '#f43f5e' : riskLevel === 'MEDIUM' ? '#f59e0b' : '#10b981'} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
            DOOMSDAY AI Defect Sensing Breakdown: Real vs Scam Traits
          </h3>
        </div>

        {riskLevel === 'HIGH' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            <div style={{ background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.25)', borderRadius: '10px', padding: '12px 14px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#fb7185', textTransform: 'uppercase' }}>
                Detected Scam Defects in this Input:
              </span>
              <ul style={{ margin: '8px 0 0', paddingLeft: '18px', fontSize: '0.82rem', color: '#f8fafc', lineHeight: '1.6' }}>
                <li><strong>Psychological Manipulation:</strong> Coercive urgency or panic-inducing threats (e.g. power cutoff, digital arrest, or bank suspension).</li>
                <li><strong>Unofficial Redirection:</strong> Prompts to call an unverified personal phone number or open an unauthenticated link.</li>
                <li><strong>Reverse-Direction Demand:</strong> Requests you to pay money or share credentials under the pretense of "verification" or "stopping an action".</li>
              </ul>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '10px', padding: '12px 14px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#34d399', textTransform: 'uppercase' }}>
                How a Legitimate / Real Institution Acts:
              </span>
              <ul style={{ margin: '8px 0 0', paddingLeft: '18px', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                <li><strong>Formal Invoicing:</strong> Official utility boards and banks send physical bills or display dues on their authenticated web portals.</li>
                <li><strong>No Digital Arrests:</strong> Law enforcement agencies NEVER conduct arrests or demand bail security over WhatsApp, Skype, or phone calls.</li>
                <li><strong>No Personal UPI:</strong> Government or corporate bills are NEVER paid to personal 10-digit mobile UPI numbers.</li>
              </ul>
            </div>
          </div>
        ) : (
          <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '10px', padding: '14px 16px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#34d399', textTransform: 'uppercase' }}>
              ✓ Authentic & Real Communication Characteristics:
            </span>
            <ul style={{ margin: '8px 0 0', paddingLeft: '18px', fontSize: '0.85rem', color: '#f8fafc', lineHeight: '1.6' }}>
              <li><strong>Zero Coercive Deadlines:</strong> No artificial "within 15 minutes" or "tonight at 9:30 PM" extortion traps.</li>
              <li><strong>Informational Content:</strong> Contains standard automated transaction syntax (e.g. debit confirmation with reference number) or routine peer message.</li>
              <li><strong>Zero Credential Traps:</strong> No requests for your secret UPI PIN, OTP, ATM PIN, or card CVV.</li>
            </ul>
          </div>
        )}
      </div>

      {/* "Why are we warning you?" Signal Cards Section */}
      <section style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1.2rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#f8fafc', letterSpacing: '-0.01em' }}>
            Why are we warning you?
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Individual suspicious indicators detected in this payment context
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {signals.length === 0 ? (
            <div className="glass-panel" style={{ padding: '1.5rem', gridColumn: '1 / -1', textAlign: 'center', color: '#94a3b8' }}>
              No prominent suspicious signals detected. Standard caution is still recommended.
            </div>
          ) : (
            signals.map((sig, idx) => <SignalCard key={idx} signal={sig} />)
          )}
        </div>
      </section>

      {/* Visual Risk Score Breakdown */}
      <ScoreBreakdown signals={signals} totalScore={riskScore} />

      {/* "Before You Pay" Safety Action Center */}
      <section className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', borderTop: '4px solid #38bdf8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
          <ShieldCheck size={26} color="#38bdf8" />
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#f8fafc' }}>
              Before You Pay — Safety Verification Checklist
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              Verify these 7 safeguards before entering your UPI PIN or authorizing transfer
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '12px',
          marginBottom: '1.5rem',
        }}>
          {[
            { id: 'c1', text: 'Verify the person/company independently through official channels' },
            { id: 'c2', text: 'Open the official bank/company application directly (not via link)' },
            { id: 'c3', text: 'Do not use phone numbers or links provided in the suspicious message' },
            { id: 'c4', text: 'Never enter or share your OTP, UPI PIN, or bank password' },
            { id: 'c5', text: 'Verify recipient legal name on payment confirmation screen' },
            { id: 'c6', text: 'Check the exact payment amount requested' },
            { id: 'c7', text: 'Confirm the genuine factual reason for this payment' },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '8px',
                background: checklist[item.id] ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                border: checklist[item.id] ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {checklist[item.id] ? (
                <CheckSquare size={20} color="#10b981" />
              ) : (
                <Square size={20} color="#64748b" />
              )}
              <span style={{
                fontSize: '0.85rem',
                color: checklist[item.id] ? '#f8fafc' : '#cbd5e1',
                textDecoration: checklist[item.id] ? 'line-through' : 'none',
              }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link
            to="/safety"
            className="btn-primary"
            style={{ padding: '12px 24px', fontSize: '0.9rem' }}
          >
            VERIFY REQUEST
          </Link>

          <Link
            to="/already-paid"
            className="btn-danger"
            style={{ padding: '12px 24px', fontSize: '0.9rem' }}
          >
            I STILL SUSPECT A SCAM
          </Link>
        </div>
      </section>

      {/* User Feedback Prompt */}
      <FeedbackPrompt scanId={id} />
    </div>
  );
}
