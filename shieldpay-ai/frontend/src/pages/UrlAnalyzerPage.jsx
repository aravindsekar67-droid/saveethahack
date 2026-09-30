import React, { useState } from 'react';
import { 
  Link2, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Info, 
  ExternalLink,
  Lock,
  Unlock,
  Globe,
  ShieldCheck,
  AlertOctagon,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export default function UrlAnalyzerPage() {
  const [url, setUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const sampleScenarios = [
    {
      level: 'LOW',
      badgeClass: 'badge-low',
      label: 'Verified Official Banking Portal',
      url: 'https://www.onlinesbi.sbi',
      desc: 'Authentic banking domain with certified TLS encryption.'
    },
    {
      level: 'MEDIUM',
      badgeClass: 'badge-med',
      label: 'Shortened Link / Masked Redirection',
      url: 'https://bit.ly/community-update-notice',
      desc: 'Obfuscated link hiding landing server destination.'
    },
    {
      level: 'HIGH',
      badgeClass: 'badge-high',
      label: 'Brand Masquerading Phishing Link',
      url: 'http://sbi-alert-verify.com/login',
      desc: 'Insecure HTTP + fake brand hyphenation + credential trap.'
    },
    {
      level: 'HIGH',
      badgeClass: 'badge-high',
      label: 'Corrupted / Wrong Scheme Link',
      url: 'htt://fake-paytm-kyc.xyz/unblock.apk',
      desc: 'Typo scheme + suspicious .xyz TLD + dangerous .apk download.'
    }
  ];

  const handleScan = async (target) => {
    const rawToScan = target !== undefined ? target : url;
    if (!rawToScan || !rawToScan.trim()) return;
    setAnalyzing(true);
    try {
      const res = await api.scanUrl(rawToScan.trim());
      setResult(res);
    } catch (err) {
      console.error('URL scan error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const getRiskColor = (level, score) => {
    if (level === 'HIGH' || score >= 60) return '#f43f5e';
    if (level === 'MEDIUM' || score >= 30) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
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
          <Link2 size={16} />
          <span>DOOMSDAY Real-Time Link Defense</span>
        </div>

        <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#f8fafc', marginBottom: '0.5rem' }}>
          Check a Link Before You Pay
        </h1>
        <p style={{ color: '#cbd5e1', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto' }}>
          Resilient heuristic engine evaluates ANY web link—including malformed addresses, typo schemes, suspicious TLDs, and disguised portals.
        </p>
      </div>

      {/* Input Box */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <label className="form-label" style={{ marginBottom: '8px' }}>
          Paste Website Link (Evaluates Real-Time Risk Percentage):
        </label>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Globe size={18} color="#64748b" style={{ position: 'absolute', top: '14px', left: '14px' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '40px' }}
              placeholder="e.g. sbi-alert-verify.com, http://bad.xyz, or wrong link format"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleScan(); }}
            />
          </div>

          <button
            onClick={() => handleScan()}
            disabled={analyzing || !url.trim()}
            className="btn-primary"
            style={{ padding: '12px 24px', flexShrink: 0 }}
          >
            <Search size={18} />
            {analyzing ? 'Evaluating...' : 'Analyze Link'}
          </button>
        </div>

        {/* Quick Samples */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Realistic Test Links:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px', marginTop: '10px' }}>
            {sampleScenarios.map((s, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setUrl(s.url);
                  handleScan(s.url);
                }}
                className="glass-panel-interactive"
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`badge ${s.badgeClass}`} style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                    {s.level} RISK
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: '600' }}>Click to Test</span>
                </div>
                <strong style={{ color: '#f8fafc', fontSize: '0.85rem' }}>{s.label}</strong>
                <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: 0 }}>{s.desc}</p>
                <code style={{ fontSize: '0.72rem', color: '#cbd5e1', wordBreak: 'break-all' }}>{s.url}</code>
              </div>
            ))}
          </div>
        </div>

        {/* Real vs Scam Link Anatomy Educational Guide */}
        <div style={{
          background: 'rgba(6, 9, 19, 0.75)',
          borderRadius: '14px',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          padding: '1.25rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Sparkles size={18} color="#38bdf8" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
              How DOOMSDAY AI Senses Real Links vs Scam Links
            </h4>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            {/* Real Link Card */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.06)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '10px',
              padding: '12px 14px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <CheckCircle2 size={16} color="#10b981" />
                <strong style={{ color: '#34d399', fontSize: '0.85rem' }}>Authentic / Real Link Traits:</strong>
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.78rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                <li><strong>Certified Protocol:</strong> Starts with <code style={{ color: '#34d399' }}>https://</code> with a registered root certificate.</li>
                <li><strong>Verified Domain:</strong> Matches the true root (e.g. <code style={{ color: '#34d399' }}>onlinesbi.sbi</code>, <code style={{ color: '#34d399' }}>hdfcbank.com</code>).</li>
                <li><strong>Standard Hierarchy:</strong> Clean subdomains (<code style={{ color: '#34d399' }}>retail.onlinesbi.sbi</code>) owned by the bank.</li>
                <li><strong>Score:</strong> Evaluates to <strong>0% - 5% LOW RISK</strong>.</li>
              </ul>
            </div>

            {/* Scam Link Card */}
            <div style={{
              background: 'rgba(244, 63, 94, 0.06)',
              border: '1px solid rgba(244, 63, 94, 0.25)',
              borderRadius: '10px',
              padding: '12px 14px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <ShieldAlert size={16} color="#f43f5e" />
                <strong style={{ color: '#fb7185', fontSize: '0.85rem' }}>Scam / Phishing Link Defects:</strong>
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.78rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                <li><strong>Brand Masquerading:</strong> Adds hyphens/tokens (<code style={{ color: '#fb7185' }}>sbi-alert-verify.com</code>, <code style={{ color: '#fb7185' }}>paytm-kyc.xyz</code>).</li>
                <li><strong>Insecure Scheme:</strong> Cleartext <code style={{ color: '#fb7185' }}>http://</code> or corrupted typo schemes (<code style={{ color: '#fb7185' }}>htp://</code>).</li>
                <li><strong>Throwaway Infrastructure:</strong> Disposable TLDs (<code style={{ color: '#fb7185' }}>.xyz</code>, <code style={{ color: '#fb7185' }}>.top</code>), raw IPs, or shorteners.</li>
                <li><strong>Dangerous Payloads:</strong> Direct APK downloads (<code style={{ color: '#fb7185' }}>.apk</code>) to steal OTPs.</li>
                <li><strong>Score:</strong> Evaluates to <strong>80% - 100% HIGH RISK</strong>.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Report with Dynamic Risk Percentage */}
      {result && (
        <div className="glass-panel" style={{
          padding: '2rem',
          marginBottom: '2rem',
          borderTop: `4px solid ${getRiskColor(result.riskLevel, result.riskScore)}`
        }}>
          {/* Top Header & Percentage Gauge */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <span className={`badge ${result.riskLevel === 'HIGH' ? 'badge-high' : result.riskLevel === 'MEDIUM' ? 'badge-med' : 'badge-low'}`} style={{ fontSize: '0.85rem', padding: '4px 12px' }}>
                {result.riskLevel} RISK DESTINATION
              </span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#f8fafc', marginTop: '8px', wordBreak: 'break-all' }}>
                {result.url}
              </h3>
            </div>

            {/* Circular Risk Percentage Display */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '12px 20px',
              borderRadius: '16px',
              background: 'rgba(0, 0, 0, 0.45)',
              border: `1px solid ${getRiskColor(result.riskLevel, result.riskScore)}50`,
            }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', display: 'block', fontWeight: '700' }}>
                  Risk Percentage
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: '900',
                  fontSize: '1.8rem',
                  lineHeight: '1',
                  color: getRiskColor(result.riskLevel, result.riskScore),
                }}>
                  {result.riskScore}%
                </span>
              </div>

              {/* Mini visual risk meter */}
              <div style={{
                width: '60px',
                height: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '9999px',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${result.riskScore}%`,
                  height: '100%',
                  background: getRiskColor(result.riskLevel, result.riskScore),
                  borderRadius: '9999px',
                  transition: 'width 0.4s ease',
                }} />
              </div>
            </div>
          </div>

          {/* DOOMSDAY AI Sensed Defects Diagnostic Banner */}
          {result.riskLevel === 'HIGH' ? (
            <div style={{
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.4)',
              borderRadius: '12px',
              padding: '1.1rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fb7185', fontWeight: '800', marginBottom: '6px' }}>
                <ShieldAlert size={20} />
                <span>CRITICAL LINK DEFECTS SENSED BY AI</span>
              </div>
              <p style={{ color: '#f8fafc', fontSize: '0.85rem', margin: 0, lineHeight: '1.5' }}>
                This destination fails multiple security criteria of authentic corporate infrastructure. It displays characteristics of deceptive phishing, brand spoofing, or credential traps.
              </p>
            </div>
          ) : result.riskLevel === 'LOW' ? (
            <div style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '12px',
              padding: '1.1rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: '800', marginBottom: '6px' }}>
                <CheckCircle2 size={20} />
                <span>AUTHENTIC & CERTIFIED DESTINATION VERIFIED</span>
              </div>
              <p style={{ color: '#f8fafc', fontSize: '0.85rem', margin: 0, lineHeight: '1.5' }}>
                This destination resolves to an officially accredited domain registry with verified TLS encryption. No masquerading or phishing tokens were detected.
              </p>
            </div>
          ) : null}

          {/* Structural Checklist */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            padding: '1.25rem',
            marginBottom: '1.5rem',
          }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f8fafc', marginBottom: '1rem' }}>
              Structural Security Checklist
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                {result.isHttps ? <CheckCircle2 size={18} color="#10b981" /> : <AlertTriangle size={18} color="#f43f5e" />}
                <span style={{ color: result.isHttps ? '#cbd5e1' : '#fb7185' }}>
                  Encryption: {result.isHttps ? 'Valid TLS/SSL' : 'INSECURE (HTTP)'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                {!result.isIpAddress ? <CheckCircle2 size={18} color="#10b981" /> : <AlertTriangle size={18} color="#f43f5e" />}
                <span style={{ color: !result.isIpAddress ? '#cbd5e1' : '#fb7185' }}>
                  Domain Identity: {result.isIpAddress ? 'RAW NUMERIC IP' : 'Domain Name'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                {!result.isShortened ? <CheckCircle2 size={18} color="#10b981" /> : <AlertTriangle size={18} color="#f59e0b" />}
                <span style={{ color: !result.isShortened ? '#cbd5e1' : '#fbbf24' }}>
                  URL Shortener: {result.isShortened ? 'Shortener Mask Detected' : 'Direct Link'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                {!result.hasSuspiciousKeywords ? <CheckCircle2 size={18} color="#10b981" /> : <AlertTriangle size={18} color="#f43f5e" />}
                <span style={{ color: !result.hasSuspiciousKeywords ? '#cbd5e1' : '#fb7185' }}>
                  Phishing Keywords: {result.hasSuspiciousKeywords ? 'Deceptive Tokens Found' : 'Clean'}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed checks */}
          {result.checks && result.checks.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f8fafc', marginBottom: '0.75rem' }}>
                Identified Security Signals & Threat Indicators
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {result.checks.map((chk, idx) => {
                  const checkColor = chk.severity === 'HIGH' ? '#f43f5e' : chk.severity === 'MEDIUM' ? '#f59e0b' : '#10b981';
                  return (
                    <div key={idx} style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderLeft: `3px solid ${checkColor}`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.85rem',
                      gap: '12px'
                    }}>
                      <div>
                        <strong style={{ color: '#f8fafc' }}>{chk.name}</strong>
                        <p style={{ color: '#cbd5e1', fontSize: '0.8rem', margin: '2px 0 0' }}>{chk.description}</p>
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: checkColor, flexShrink: 0 }}>
                        +{chk.score}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recommendation */}
          <div style={{
            background: result.riskLevel === 'HIGH' ? 'rgba(244, 63, 94, 0.1)' : result.riskLevel === 'MEDIUM' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            border: `1px solid ${getRiskColor(result.riskLevel, result.riskScore)}40`,
            borderRadius: '10px',
            padding: '1.1rem',
            marginBottom: '1.25rem',
          }}>
            <h5 style={{ color: getRiskColor(result.riskLevel, result.riskScore), fontSize: '0.9rem', fontWeight: '800', marginBottom: '4px' }}>
              Safety Recommendation:
            </h5>
            <p style={{ color: '#f8fafc', fontSize: '0.85rem', lineHeight: '1.5' }}>
              {result.recommendation}
            </p>
          </div>

          {/* Automatic Audit Notice */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: '#94a3b8',
            fontStyle: 'italic',
            flexWrap: 'wrap',
            gap: '8px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Info size={16} />
              <span>Result saved automatically to your DOOMSDAY Audit History.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
