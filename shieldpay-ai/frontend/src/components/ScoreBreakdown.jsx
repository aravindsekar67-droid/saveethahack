import React from 'react';
import { Calculator, Info, ShieldCheck } from 'lucide-react';

export default function ScoreBreakdown({ signals = [], totalScore = 0 }) {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.2rem' }}>
        <Calculator size={20} color="#38bdf8" />
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc' }}>
          Risk Score Breakdown
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {signals.length === 0 ? (
          <div style={{ padding: '1rem', color: '#94a3b8', textAlign: 'center' }}>
            No prominent risk signals identified.
          </div>
        ) : (
          signals.map((sig, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: sig.severity === 'HIGH' ? '#f43f5e' : sig.severity === 'LOW' ? '#10b981' : '#f59e0b',
                }} />
                <span style={{ fontSize: '0.9rem', color: '#e2e8f0', fontWeight: '500' }}>
                  {sig.name}
                </span>
              </div>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: '700',
                color: sig.severity === 'HIGH' ? '#fb7185' : '#38bdf8',
                fontSize: '0.9rem',
              }}>
                +{sig.score}
              </span>
            </div>
          ))
        )}

        {/* Total Summary Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '8px',
          padding: '12px 14px',
          borderRadius: '10px',
          background: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
        }}>
          <span style={{ fontWeight: '700', fontSize: '1rem', color: '#f8fafc' }}>
            Calculated Total Score (Capped at 100)
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: '900',
            fontSize: '1.25rem',
            color: totalScore >= 61 ? '#f43f5e' : totalScore >= 31 ? '#f59e0b' : '#10b981',
          }}>
            {totalScore} / 100
          </span>
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <div style={{
        marginTop: '1.2rem',
        padding: '10px 14px',
        borderRadius: '8px',
        background: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(245, 158, 11, 0.2)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        fontSize: '0.8rem',
        color: '#fbbf24',
      }}>
        <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
        <span>
          <strong>Important Design Notice:</strong> This is a prototype risk score based on detected behavioral and technical signals. It is not an official banking fraud score.
        </span>
      </div>
    </div>
  );
}
