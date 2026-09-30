import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export default function SignalCard({ signal }) {
  const { name, severity = 'MEDIUM', score = 10, description } = signal;

  let badgeClass = 'badge-med';
  let borderColor = 'rgba(245, 158, 11, 0.3)';
  let icon = <AlertTriangle size={18} color="#f59e0b" />;

  if (severity === 'HIGH') {
    badgeClass = 'badge-high';
    borderColor = 'rgba(244, 63, 94, 0.35)';
    icon = <AlertCircle size={18} color="#f43f5e" />;
  } else if (severity === 'LOW') {
    badgeClass = 'badge-low';
    borderColor = 'rgba(16, 185, 129, 0.35)';
    icon = <Info size={18} color="#10b981" />;
  }

  return (
    <div
      className="glass-panel glass-panel-interactive"
      style={{
        padding: '1.25rem',
        borderLeft: `4px solid ${severity === 'HIGH' ? '#f43f5e' : severity === 'LOW' ? '#10b981' : '#f59e0b'}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon}
          <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#f8fafc', letterSpacing: '-0.01em' }}>
            {name}
          </h4>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={`badge ${badgeClass}`}>
            {severity} SEVERITY
          </span>
          <span style={{
            fontSize: '0.85rem',
            fontWeight: '800',
            fontFamily: 'var(--font-mono)',
            padding: '2px 8px',
            borderRadius: '6px',
            background: 'rgba(255, 255, 255, 0.08)',
            color: '#f8fafc',
          }}>
            +{score}
          </span>
        </div>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: '1.5' }}>
        {description}
      </p>
    </div>
  );
}
