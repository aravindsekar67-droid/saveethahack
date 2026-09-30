import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, AlertTriangle, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#05070e',
      borderTop: '1px solid rgba(56, 189, 248, 0.1)',
      padding: '3rem 1.5rem 2rem',
      marginTop: '4rem',
      color: '#94a3b8',
      fontSize: '0.875rem',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem',
        }}>
          {/* Column 1 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #f43f5e, #7928ca)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Shield size={18} color="#ffffff" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: '900', letterSpacing: '0.04em', color: '#f8fafc' }}>
                DOOM<span style={{ color: '#f43f5e' }}>SDAY</span> AI
              </span>
            </div>
            <p style={{ fontWeight: '600', color: '#e2e8f0', marginBottom: '0.3rem' }}>
              "Think Before You Pay."
            </p>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
              Detect suspicious payment signals before your money leaves your account.
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              color: '#34d399',
              fontSize: '0.75rem',
            }}>
              <Lock size={12} />
              <span>Zero-Credential Storage Guarantee</span>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h4 style={{ color: '#f8fafc', fontWeight: '700', marginBottom: '1rem', fontSize: '0.95rem' }}>
              Analysis Tools
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li><Link to="/scan" style={{ color: '#94a3b8', textDecoration: 'none' }}>Single Payment Scanner</Link></li>
              <li><Link to="/url-analyzer" style={{ color: '#94a3b8', textDecoration: 'none' }}>Phishing Link Analyzer</Link></li>
              <li><Link to="/qr-analyzer" style={{ color: '#94a3b8', textDecoration: 'none' }}>UPI QR & Reverse Charge Check</Link></li>
              <li><Link to="/game" style={{ color: '#94a3b8', textDecoration: 'none' }}>Scam Spotter Training Game</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 style={{ color: '#f8fafc', fontWeight: '700', marginBottom: '1rem', fontSize: '0.95rem' }}>
              Safety & Protection
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li><Link to="/safety" style={{ color: '#94a3b8', textDecoration: 'none' }}>Payment Safety Center</Link></li>
              <li><Link to="/already-paid" style={{ color: '#f43f5e', textDecoration: 'none', fontWeight: '600' }}>Already Sent Money? (Help)</Link></li>
              <li><Link to="/history" style={{ color: '#94a3b8', textDecoration: 'none' }}>My Scan History</Link></li>
              <li><Link to="/about" style={{ color: '#94a3b8', textDecoration: 'none' }}>How ShieldPay AI Works</Link></li>
              <li><Link to="/admin/login" style={{ color: '#94a3b8', textDecoration: 'none' }}>Admin Intelligence Portal</Link></li>
            </ul>
          </div>

          {/* Column 4: Disclaimer */}
          <div>
            <h4 style={{ color: '#f8fafc', fontWeight: '700', marginBottom: '1rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={16} color="#f59e0b" />
              Decision-Support Notice
            </h4>
            <p style={{ fontSize: '0.78rem', lineHeight: '1.5', color: '#94a3b8' }}>
              ShieldPay AI is a decision-support and educational tool. The system evaluates observable behavioral and technical signals to provide transparent risk assessments. It does not definitively prove fraud or replace official bank authorization procedures.
            </p>
            <p style={{ fontSize: '0.75rem', marginTop: '0.6rem', color: '#f43f5e' }}>
              Never enter or share: OTP, UPI PIN, ATM PIN, CVV, or banking passwords anywhere on this site.
            </p>
          </div>
        </div>

        <div style={{
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.75rem',
          color: '#64748b',
        }}>
          <div>
            © 2026 DOOMSDAY AI — Digital Payment Pre-Transaction Scam Defense.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy-First Architecture</span>
            <span>Deterministic Scoring</span>
            <span>Zero Data Brokerage</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
