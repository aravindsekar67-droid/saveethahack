import React, { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

const ANALYSIS_STEPS = [
  'Reading message',
  'Detecting urgency',
  'Checking payment context',
  'Analyzing URL',
  'Matching scam patterns',
  'Calculating risk',
  'Generating explanation',
];

export default function AnalysisLoadingScreen({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const stepDuration = 240; // fast & responsive demo experience (total ~1.7s)
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < ANALYSIS_STEPS.length) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentStep >= ANALYSIS_STEPS.length) {
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [currentStep, onComplete]);

  const progressPct = Math.min(100, Math.round((currentStep / ANALYSIS_STEPS.length) * 100));

  return (
    <div style={{
      maxWidth: '640px',
      margin: '4rem auto',
      padding: '2rem 1.5rem',
      textAlign: 'center',
    }}>
      <div className="glass-panel" style={{ padding: '3rem 2rem', position: 'relative' }}>
        {/* Animated Radar Shield Visual */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.2), rgba(168, 85, 247, 0.2))',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          boxShadow: '0 0 25px rgba(0, 242, 254, 0.25)',
        }} className="animate-pulse-slow">
          <Sparkles size={36} color="#38bdf8" />
        </div>

        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f8fafc', marginBottom: '0.5rem' }}>
          Analyzing Payment Situation...
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem' }}>
          ShieldPay AI engine is parsing behavioral signals and fraud patterns
        </p>

        {/* Progress Bar */}
        <div style={{
          width: '100%',
          height: '8px',
          background: 'rgba(30, 41, 59, 0.6)',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '2rem',
        }}>
          <div style={{
            width: `${progressPct}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #00f2fe, #4facfe, #a855f7)',
            borderRadius: '4px',
            transition: 'width 0.25s ease-out',
            boxShadow: '0 0 12px rgba(0, 242, 254, 0.5)',
          }} />
        </div>

        {/* Step-by-Step Verification Checklist */}
        <div style={{
          textAlign: 'left',
          background: 'rgba(6, 9, 19, 0.6)',
          borderRadius: '12px',
          padding: '1.25rem 1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          {ANALYSIS_STEPS.map((step, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={step}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.9rem',
                  color: isDone ? '#f8fafc' : isCurrent ? '#38bdf8' : '#475569',
                  fontWeight: isCurrent ? '700' : '500',
                  transition: 'color 0.2s',
                }}
              >
                {isDone ? (
                  <CheckCircle2 size={18} color="#10b981" />
                ) : isCurrent ? (
                  <Loader2 size={18} color="#38bdf8" className="animate-spin" />
                ) : (
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: '1px solid #334155',
                  }} />
                )}
                <span>{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
