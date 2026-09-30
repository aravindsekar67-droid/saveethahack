import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  HelpCircle, 
  Lock, 
  ArrowRight, 
  Smartphone, 
  QrCode, 
  Link2, 
  MessageSquareWarning, 
  CheckCircle2, 
  Sparkles,
  Zap,
  Layers,
  Award
} from 'lucide-react';

export default function LandingPage() {
  const scamCards = [
    { title: 'Fake Customer Care', desc: 'Impersonators posing as bank or wallet helpline executives to extract authorization fees.', tag: 'Impersonation' },
    { title: 'Fake Refund', desc: 'Reverse-charge tricks promising cashback or return funds if you approve a payment request.', tag: 'Reverse-Charge' },
    { title: 'Account Suspension', desc: 'Threatening urgent account deactivation or KYC expiry to coerce instant unverified payments.', tag: 'Threat / Urgency' },
    { title: 'QR Payment Scam', desc: 'Malicious QR codes presented as "scan to receive money" that actually initiate money debits.', tag: 'QR Trap' },
    { title: 'Fake Shopping', desc: 'Lookalike websites advertising 90% clearance discounts on electronics to harvest upfront UPI.', tag: 'Phishing Store' },
    { title: 'Prize / Lottery', desc: 'Bogus notifications claiming you won a car or cash prize demanding advance processing tax.', tag: 'Advance Fee' },
    { title: 'Impersonation', desc: 'Social engineering masquerading as acquaintances, delivery personnel, or government officials.', tag: 'Identity Fraud' },
    { title: 'Advance-Fee Scam', desc: 'Upfront loan processing or job registration fees required before non-existent services.', tag: 'Advance Fee' },
    { title: 'Urgency / Threat', desc: 'Manufactured deadlines threatening immediate electricity disconnection or legal summons.', tag: 'Social Eng' },
    { title: 'Credential Harvesting', desc: 'Deceptive pages and SMS demanding your 6-digit UPI PIN, OTP, or CVV under verification pretexts.', tag: 'Critical' },
  ];

  const steps = [
    { step: '01', title: 'Paste', desc: 'Input the suspicious message, SMS, payment request, URL, or QR payload.' },
    { step: '02', title: 'Analyze', desc: 'Our deterministic heuristic engine scans for urgency, threats, advance fees, and lookalikes.' },
    { step: '03', title: 'Understand', desc: 'Review the animated 0–100 risk score and transparent breakdown of every detected signal.' },
    { step: '04', title: 'Protect', desc: 'Follow structured safety action steps to verify through official channels before money leaves.' },
  ];

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
      {/* Hero Section */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '3rem',
        alignItems: 'center',
        padding: '3rem 0 5rem',
      }}>
        <div>
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
            marginBottom: '1.5rem',
          }}>
            <Sparkles size={16} />
            <span>Challenge VH-S02 — Digital Payment Defense</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '900',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: '1.2rem',
          }}>
            Think Before <br />
            <span className="gradient-text">You Pay.</span>
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: '#cbd5e1',
            lineHeight: '1.6',
            marginBottom: '2rem',
            maxWidth: '540px',
          }}>
            DOOMSDAY AI detects suspicious payment signals <strong>before</strong> you send money. Pre-transaction decision support to stop social engineering before it costs you.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/scan" className="btn-primary" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
              <ShieldAlert size={20} />
              Check a Payment
            </Link>
            <Link to="/scan?demo=account_suspension" className="btn-secondary" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
              <Zap size={20} color="#38bdf8" />
              Try Demo
            </Link>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            marginTop: '2.5rem',
            fontSize: '0.85rem',
            color: '#94a3b8',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#10b981" />
              <span>Zero-Credential Storage</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#10b981" />
              <span>Privacy Mode Redaction</span>
            </div>
          </div>
        </div>

        {/* Cybersecurity Shield Visual */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            position: 'relative',
            width: '320px',
            height: '340px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Background glowing rings */}
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '32px',
              background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.15), rgba(168, 85, 247, 0.15))',
              filter: 'blur(35px)',
            }} />

            <div className="glass-panel animate-float" style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(56, 189, 248, 0.2)',
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 50%, #9333ea 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 30px rgba(0, 242, 254, 0.4)',
                marginBottom: '1.5rem',
              }}>
                <ShieldCheck size={56} color="#060913" strokeWidth={2.3} />
              </div>

              <div style={{ textAlign: 'center' }}>
                <span className="badge badge-high" style={{ marginBottom: '8px' }}>
                  THREAT INTERCEPTED
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff', marginBottom: '4px' }}>
                  Decision Support
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  Pre-Transaction Behavioral Heuristics
                </p>
              </div>

              <div style={{
                marginTop: '1.5rem',
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.8rem',
              }}>
                <span style={{ color: '#94a3b8' }}>Analysis Latency:</span>
                <span style={{ color: '#10b981', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>&lt; 85 ms</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Trio: DETECT, EXPLAIN, PROTECT */}
      <section style={{ marginBottom: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#f8fafc' }}>
            Built For Instant User Empowerment
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '6px' }}>
            A triple-layer defense model built specifically for everyday payment situations
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}>
          {/* Card 1: DETECT */}
          <div className="glass-panel glass-panel-interactive" style={{ padding: '2rem', borderTop: '4px solid #38bdf8' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(56, 189, 248, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.2rem',
              color: '#38bdf8',
            }}>
              <Search size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f8fafc', marginBottom: '0.5rem' }}>
              DETECT
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: '1.6' }}>
              Identify suspicious payment signals across text urgency, threat framing, unexpected fee structures, and domain masquerading.
            </p>
          </div>

          {/* Card 2: EXPLAIN */}
          <div className="glass-panel glass-panel-interactive" style={{ padding: '2rem', borderTop: '4px solid #a855f7' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(168, 85, 247, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.2rem',
              color: '#c084fc',
            }}>
              <Sparkles size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f8fafc', marginBottom: '0.5rem' }}>
              EXPLAIN
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: '1.6' }}>
              Understand exactly why the situation looks risky. Transparent signal weights and plain-English breakdown with zero black-box confusion.
            </p>
          </div>

          {/* Card 3: PROTECT */}
          <div className="glass-panel glass-panel-interactive" style={{ padding: '2rem', borderTop: '4px solid #10b981' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.2rem',
              color: '#10b981',
            }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f8fafc', marginBottom: '0.5rem' }}>
              PROTECT
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: '1.6' }}>
              Get practical, immediate verification steps before sending money. Actionable checklists prevent hasty compliance under pressure.
            </p>
          </div>
        </div>
      </section>

      {/* Scams We Help Detect (10 Cards) */}
      <section style={{ marginBottom: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#f8fafc' }}>
            Scams We Help Detect
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '6px' }}>
            Trained against real-world social engineering and UPI deception vectors
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
        }}>
          {scamCards.map((scam, idx) => (
            <div key={idx} className="glass-panel glass-panel-interactive" style={{ padding: '1.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: 'rgba(56, 189, 248, 0.1)',
                  color: '#38bdf8',
                  textTransform: 'uppercase',
                }}>
                  {scam.tag}
                </span>
                <span style={{ color: '#64748b', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                  #{idx + 1}
                </span>
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#f8fafc', marginBottom: '0.5rem' }}>
                {scam.title}
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                {scam.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How ShieldPay Works (4 Steps) */}
      <section style={{ marginBottom: '4rem' }}>
        <div className="glass-panel" style={{ padding: '3rem 2rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#f8fafc' }}>
              How ShieldPay Works
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '6px' }}>
              Four simple, non-intrusive steps from doubt to clarity
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2rem',
          }}>
            {steps.map((st) => (
              <div key={st.step} style={{ position: 'relative' }}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '900',
                  fontFamily: 'var(--font-mono)',
                  color: 'rgba(56, 189, 248, 0.25)',
                  marginBottom: '0.5rem',
                  lineHeight: 1,
                }}>
                  {st.step}
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#f8fafc', marginBottom: '0.5rem' }}>
                  {st.title}
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                  {st.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/scan" className="btn-primary" style={{ padding: '14px 32px' }}>
              Start Your First Scan Now
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
