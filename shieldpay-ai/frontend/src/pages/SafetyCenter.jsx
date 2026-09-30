import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  AlertTriangle, 
  HelpCircle, 
  Lock, 
  PhoneOff, 
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function SafetyCenter() {
  const rules = [
    { rule: 'Never share OTP', desc: 'One-Time Passwords authenticate withdrawals and transfers from your account. No legitimate bank representative will ever ask for your OTP.' },
    { rule: 'Never share UPI PIN', desc: 'Your 4 or 6 digit UPI PIN is only entered to DEBIT money from your bank account. You NEVER need to enter your PIN to receive funds or cashback.' },
    { rule: 'Never share CVV or Card Expiry', desc: 'The 3-digit CVV on the back of your card completes online card transactions. Never speak or photograph it for any caller.' },
    { rule: 'Verify Recipients Independently', desc: 'Confirm who you are paying. Match the payee legal name shown on the UPI confirmation screen with the intended person.' },
    { rule: 'Do Not Trust Urgent Messages Automatically', desc: 'Scammers manufacture artificial panic ("within 1 hour", "today only") so you act before thinking. Take a breath and pause.' },
    { rule: 'Use Official Websites and Apps', desc: 'Never click links sent via SMS to verify KYC or electricity bills. Open your pre-installed banking application directly.' },
    { rule: 'Do Not Pay Unexpected Fees', desc: 'Never pay registration fees for lottery prizes, refunds, customs clearance, or job offers. These are advance-fee traps.' },
    { rule: 'Verify Customer Support Independently', desc: 'Search official toll-free numbers from your physical debit/credit card or the verified corporate website, never from search engine ad banners.' },
  ];

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '9999px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          color: '#10b981',
          fontSize: '0.85rem',
          fontWeight: '700',
          marginBottom: '1rem',
        }}>
          <ShieldCheck size={16} />
          <span>Security Knowledge Base</span>
        </div>

        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#f8fafc', marginBottom: '0.5rem' }}>
          Payment Safety Center
        </h1>
        <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '640px', margin: '0 auto' }}>
          Essential defense principles to protect yourself and your family from social engineering attacks.
        </p>
      </div>

      {/* Emergency Callout */}
      <div className="glass-panel" style={{
        padding: '1.5rem 2rem',
        marginBottom: '3rem',
        borderLeft: '5px solid #f43f5e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <AlertCircle size={32} color="#f43f5e" />
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff' }}>
              Did you already authorize an unverified transfer?
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
              Follow our immediate incident containment protocol before the fraudster drains further funds.
            </p>
          </div>
        </div>

        <Link to="/already-paid" className="btn-danger" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
          Already Sent the Money?
        </Link>
      </div>

      {/* Golden Rules Grid */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#f8fafc', marginBottom: '1.5rem' }}>
          8 Core Rules of Digital Payment Defense
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {rules.map((item, idx) => (
            <div key={idx} className="glass-panel glass-panel-interactive" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: '800',
                  fontFamily: 'var(--font-mono)',
                }}>
                  {idx + 1}
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#f8fafc' }}>
                  {item.rule}
                </h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Three Phased Protection Checklist */}
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#f8fafc', marginBottom: '1.5rem' }}>
          Lifecycle Safeguards
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {/* Phase 1: Before Paying */}
          <div className="glass-panel" style={{ padding: '1.75rem', borderTop: '4px solid #38bdf8' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#38bdf8', marginBottom: '1rem' }}>
              1. Before Paying
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#cbd5e1' }}>
              <li style={{ display: 'flex', gap: '8px' }}><CheckCircle2 size={16} color="#38bdf8" /> Scan message text and link in ShieldPay AI</li>
              <li style={{ display: 'flex', gap: '8px' }}><CheckCircle2 size={16} color="#38bdf8" /> Look for artificial urgency or coercive threats</li>
              <li style={{ display: 'flex', gap: '8px' }}><CheckCircle2 size={16} color="#38bdf8" /> Call the contact on their known personal number to verify</li>
            </ul>
          </div>

          {/* Phase 2: During Payment */}
          <div className="glass-panel" style={{ padding: '1.75rem', borderTop: '4px solid #f59e0b' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#f59e0b', marginBottom: '1rem' }}>
              2. During Payment
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#cbd5e1' }}>
              <li style={{ display: 'flex', gap: '8px' }}><CheckCircle2 size={16} color="#f59e0b" /> Inspect recipient legal account name on screen</li>
              <li style={{ display: 'flex', gap: '8px' }}><CheckCircle2 size={16} color="#f59e0b" /> Verify transaction amount before entering PIN</li>
              <li style={{ display: 'flex', gap: '8px' }}><CheckCircle2 size={16} color="#f59e0b" /> If told you are "receiving" money, NEVER enter PIN</li>
            </ul>
          </div>

          {/* Phase 3: After a Suspicious Payment */}
          <div className="glass-panel" style={{ padding: '1.75rem', borderTop: '4px solid #f43f5e' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#f43f5e', marginBottom: '1rem' }}>
              3. After a Suspicious Payment
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#cbd5e1' }}>
              <li style={{ display: 'flex', gap: '8px' }}><CheckCircle2 size={16} color="#f43f5e" /> Call your bank to request immediate recall</li>
              <li style={{ display: 'flex', gap: '8px' }}><CheckCircle2 size={16} color="#f43f5e" /> Preserve transaction ID (UTR) and full screenshots</li>
              <li style={{ display: 'flex', gap: '8px' }}><CheckCircle2 size={16} color="#f43f5e" /> Report through your national cyber fraud portal</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
