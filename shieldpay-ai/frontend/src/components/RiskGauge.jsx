import React, { useEffect, useState } from 'react';
import { ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function RiskGauge({ score = 0, level = 'LOW', size = 240 }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let current = 0;
    const duration = 1200; // ms
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const increment = score / totalSteps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Color mappings
  let primaryColor = '#10b981'; // Green
  let glowColor = 'rgba(16, 185, 129, 0.4)';
  let bgArcColor = 'rgba(16, 185, 129, 0.15)';
  let LevelIcon = ShieldCheck;
  let statusText = 'LOW RISK';

  if (level === 'HIGH' || score >= 61) {
    primaryColor = '#f43f5e'; // Crimson / Pink
    glowColor = 'rgba(244, 63, 94, 0.5)';
    bgArcColor = 'rgba(244, 63, 94, 0.15)';
    LevelIcon = ShieldAlert;
    statusText = 'HIGH RISK';
  } else if (level === 'MEDIUM' || score >= 31) {
    primaryColor = '#f59e0b'; // Amber
    glowColor = 'rgba(245, 158, 11, 0.45)';
    bgArcColor = 'rgba(245, 158, 11, 0.15)';
    LevelIcon = AlertTriangle;
    statusText = 'MEDIUM RISK';
  }

  // SVG circular arc calculations
  const strokeWidth = 14;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  // Use a 270-degree arc for speedometer gauge look
  const strokeDashoffset = circumference - (circumference * (animatedScore / 100));

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative',
    }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        {/* Glow halo */}
        <div style={{
          position: 'absolute',
          inset: '20px',
          borderRadius: '50%',
          boxShadow: `0 0 45px ${glowColor}`,
          pointerEvents: 'none',
          opacity: 0.65,
        }} />

        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={bgArcColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated risk score stroke */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={primaryColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.8s ease-out, stroke 0.4s ease',
            }}
          />
        </svg>

        {/* Center score & label */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <LevelIcon size={34} color={primaryColor} strokeWidth={2.2} style={{ marginBottom: '4px' }} />
          <div style={{
            fontSize: '3rem',
            fontWeight: '900',
            fontFamily: 'var(--font-mono)',
            color: '#ffffff',
            lineHeight: 1,
            textShadow: `0 0 20px ${glowColor}`,
          }}>
            {animatedScore}
            <span style={{ fontSize: '1.25rem', color: '#94a3b8', fontWeight: '500' }}>/100</span>
          </div>
          <div style={{
            marginTop: '8px',
            padding: '3px 12px',
            borderRadius: '9999px',
            backgroundColor: bgArcColor,
            border: `1px solid ${primaryColor}`,
            color: primaryColor,
            fontSize: '0.8rem',
            fontWeight: '800',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            {statusText}
          </div>
        </div>
      </div>
      
      <p style={{
        marginTop: '0.75rem',
        fontSize: '0.8rem',
        color: '#94a3b8',
        textAlign: 'center',
        maxWidth: '280px',
      }}>
        Transparent decision-support metric based on accumulated risk signals.
      </p>
    </div>
  );
}
