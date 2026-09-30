import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  HelpCircle, 
  Lock, 
  EyeOff, 
  Layers, 
  Cpu, 
  FileCode2, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
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
          <HelpCircle size={16} />
          <span>About ShieldPay AI</span>
        </div>

        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#f8fafc', marginBottom: '0.5rem' }}>
          How ShieldPay AI Works
        </h1>
        <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '640px', margin: '0 auto' }}>
          Solving Hackathon Challenge VH-S02: "Detecting Digital Payment Scams Before Money Is Sent"
        </p>
      </div>

      {/* Problem & Solution Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid #f43f5e' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fb7185', marginBottom: '0.8rem' }}>
            The Core Problem
          </h3>
          <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: '1.6' }}>
            Traditional fraud detection acts after a transaction is authorized or within backend banking rules that often cannot observe the social engineering dialogue. Victims are psychologically manipulated into authorizing payments themselves, rendering standard PIN protection ineffective.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid #10b981' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#34d399', marginBottom: '0.8rem' }}>
            The ShieldPay AI Solution
          </h3>
          <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: '1.6' }}>
            ShieldPay AI provides client-side pre-transaction decision support. By analyzing incoming text pressure, sender novelty, disguised QR payloads, and lookalike domains, we empower the user to pause, recognize deception patterns, and verify through official channels before fund departure.
          </p>
        </div>
      </div>

      {/* Principles */}
      <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f8fafc', marginBottom: '1.5rem' }}>
          Four Architectural Pillars
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Lock size={18} color="#38bdf8" />
              <h4 style={{ color: '#f8fafc', fontWeight: '700' }}>Zero Credential Storage</h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              We never collect or persist OTP, UPI PIN, ATM PIN, CVV, or banking passwords under any circumstances.
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <EyeOff size={18} color="#10b981" />
              <h4 style={{ color: '#f8fafc', fontWeight: '700' }}>Privacy By Design</h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              With Privacy Mode enabled, original messages are wiped immediately after analysis. Phone numbers and emails are automatically masked.
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Cpu size={18} color="#a855f7" />
              <h4 style={{ color: '#f8fafc', fontWeight: '700' }}>Deterministic Transparency</h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Transparent mathematical score contributions. Every point in the 0–100 risk score corresponds to an observable, documented signal.
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <ShieldCheck size={18} color="#f59e0b" />
              <h4 style={{ color: '#f8fafc', fontWeight: '700' }}>Decision Support</h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              We educate and guide rather than dictate. The system warns of suspicious signals and provides structured verification steps.
            </p>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <Link to="/scan" className="btn-primary" style={{ padding: '14px 32px' }}>
          Try the Payment Scanner
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
