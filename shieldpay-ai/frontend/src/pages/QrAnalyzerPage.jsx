import React, { useState, useRef } from 'react';
import { 
  QrCode, 
  Upload, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  Camera, 
  Info, 
  ArrowRight, 
  AlertOctagon,
  ShieldCheck,
  XCircle
} from 'lucide-react';
import jsQR from 'jsqr';
import { api } from '../services/api';

export default function QrAnalyzerPage() {
  const [qrString, setQrString] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [decodeMessage, setDecodeMessage] = useState('');
  const fileInputRef = useRef(null);

  const demoScenarios = [
    {
      level: 'HIGH',
      badgeClass: 'badge-high',
      label: 'Fake Refund QR (Reverse-Charge Trap)',
      payload: 'upi://pay?pa=refund-support@okicici&pn=Paytm%20Nodal%20Refund&am=4999&cu=INR&tn=Refund%20Cashback%20Approval',
      desc: 'Scammer instructs victim to "Scan this QR to receive ₹4,999 refund". Deep inspection detects reverse-charge deception.'
    },
    {
      level: 'HIGH',
      badgeClass: 'badge-high',
      label: 'Corrupted Syntax / Missing Payee QR',
      payload: 'upi://pay?pn=Unknown&am=1500&cu=INR',
      desc: 'Malformed QR payload missing the mandatory payee address (pa) parameter.'
    },
    {
      level: 'MEDIUM',
      badgeClass: 'badge-med',
      label: 'Unverified Individual Peer Payee',
      payload: 'upi://pay?pa=rahul.kumar92@okhdfcbank&pn=Rahul%20Kumar&am=3500&cu=INR&tn=Shared%20Expense%20Split',
      desc: 'Unregistered personal VPA with moderate pre-filled debit amount.'
    },
    {
      level: 'LOW',
      badgeClass: 'badge-low',
      label: 'Verified Retail Merchant Purchase',
      payload: 'upi://pay?pa=starbucks.coffee@hdfcbank&pn=Starbucks%20India&am=380&cu=INR&tn=Coffee%20Order',
      desc: 'Authentic commercial merchant VPA with standard consumer purchase amount.'
    }
  ];

  const handleScanPayload = async (payload) => {
    const textToScan = payload !== undefined ? payload : qrString;
    if (!textToScan || !textToScan.trim()) return;
    setAnalyzing(true);
    setDecodeMessage('');
    try {
      const res = await api.scanQr({
        qrData: textToScan.trim(),
        recipient: '',
        amount: null,
      });
      setResult(res);
    } catch (err) {
      console.error('QR scan error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleImageUpload = (file) => {
    if (!file) return;
    setDecodeMessage('Processing uploaded QR image...');

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data) {
          setDecodeMessage(`✓ Decoded QR Data: "${code.data}"`);
          setQrString(code.data);
          handleScanPayload(code.data);
        } else {
          setDecodeMessage('Could not extract QR matrix from image. Loaded realistic demonstration payload instead.');
          const fallback = demoScenarios[0].payload;
          setQrString(fallback);
          handleScanPayload(fallback);
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
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
          <QrCode size={16} />
          <span>DOOMSDAY Deep QR Inspector</span>
        </div>

        <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#f8fafc', marginBottom: '0.5rem' }}>
          UPI QR Code Fraud Inspector
        </h1>
        <p style={{ color: '#cbd5e1', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto' }}>
          Deeply inspects payment QR payloads before scanning with Google Pay, PhonePe, or Paytm. Exposes syntax errors, missing payee parameters, and reverse-charge fraud traps.
        </p>
      </div>

      {/* Critical Payment Rule Notice */}
      <div style={{
        background: 'rgba(244, 63, 94, 0.1)',
        border: '1px solid rgba(244, 63, 94, 0.35)',
        borderRadius: '12px',
        padding: '1.2rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <AlertTriangle size={24} color="#f43f5e" style={{ flexShrink: 0 }} />
        <div>
          <h4 style={{ color: '#fb7185', fontSize: '0.95rem', fontWeight: '800' }}>
            UNIVERSAL PAYMENT ARCHITECTURE RULE: You NEVER scan a QR code to RECEIVE money.
          </h4>
          <p style={{ color: '#f8fafc', fontSize: '0.85rem', marginTop: '2px' }}>
            In UPI protocols, scanning a QR code or entering your UPI PIN will <strong>ALWAYS DEDUCT</strong> money from your bank account. Scammers frequently use fake "Cashback/Refund QR" codes to drain balances.
          </p>
        </div>
      </div>

      {/* Upload & Input Card */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleImageUpload(e.dataTransfer.files[0]);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragActive ? '#38bdf8' : 'rgba(56, 189, 248, 0.25)'}`,
            borderRadius: '14px',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: dragActive ? 'rgba(56, 189, 248, 0.08)' : 'rgba(0, 0, 0, 0.2)',
            transition: 'all 0.2s',
            marginBottom: '1.5rem',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleImageUpload(e.target.files[0]);
              }
            }}
          />
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'rgba(56, 189, 248, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            color: '#38bdf8',
          }}>
            <Upload size={28} />
          </div>
          <h4 style={{ color: '#f8fafc', fontWeight: '700', fontSize: '1.05rem', marginBottom: '4px' }}>
            Upload or Drag QR Code Image
          </h4>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Automatic client-side QR barcode decoding and validation.
          </p>
        </div>

        {decodeMessage && (
          <div style={{
            padding: '8px 12px',
            borderRadius: '8px',
            background: 'rgba(56, 189, 248, 0.1)',
            color: '#38bdf8',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
          }}>
            {decodeMessage}
          </div>
        )}

        {/* Manual Payload Text Input */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="form-label" style={{ marginBottom: '8px' }}>
            Or Paste Any Raw QR / UPI Intent URI:
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. upi://pay?pa=starbucks@hdfcbank&am=380 or upi://pay?pa=refund@..."
              value={qrString}
              onChange={(e) => setQrString(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleScanPayload(); }}
            />
            <button
              onClick={() => handleScanPayload()}
              disabled={analyzing || !qrString.trim()}
              className="btn-primary"
              style={{ flexShrink: 0, padding: '0 22px' }}
            >
              Inspect QR
            </button>
          </div>
        </div>

        {/* Demo Scenarios */}
        <div>
          <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Test Specific Payment QR Scenarios:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px', marginTop: '10px' }}>
            {demoScenarios.map((sc, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setQrString(sc.payload);
                  handleScanPayload(sc.payload);
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
                  <span className={`badge ${sc.badgeClass}`} style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                    {sc.level} RISK
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: '600' }}>Click to Test</span>
                </div>
                <strong style={{ color: '#f8fafc', fontSize: '0.85rem' }}>{sc.label}</strong>
                <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: 0 }}>{sc.desc}</p>
                <code style={{ fontSize: '0.72rem', color: '#cbd5e1', wordBreak: 'break-all' }}>{sc.payload}</code>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QR Analysis Results with Deep Error and Risk Display */}
      {result && (
        <div className="glass-panel" style={{
          padding: '2rem',
          borderTop: `4px solid ${getRiskColor(result.riskLevel, result.riskScore)}`,
          marginBottom: '2rem'
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
                {result.qrType} — {result.riskLevel} RISK
              </span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#f8fafc', marginTop: '8px' }}>
                QR Payment Request Analysis
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

              {/* Mini visual meter */}
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

          {/* CRITICAL ERRORS ALERT BOX (Deep Inspection) */}
          {result.errors && result.errors.length > 0 && (
            <div style={{
              background: 'rgba(244, 63, 94, 0.15)',
              border: '2px solid rgba(244, 63, 94, 0.5)',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <AlertOctagon size={20} color="#f43f5e" />
                <h4 style={{ color: '#fb7185', fontSize: '1rem', fontWeight: '800' }}>
                  Critical Errors & Traps Detected in QR:
                </h4>
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#f8fafc', fontSize: '0.88rem', lineHeight: '1.5' }}>
                {result.errors.map((err, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>
                    <strong style={{ color: '#fb7185' }}>{err}</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Extracted Payload Summary */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginBottom: '1.5rem',
          }}>
            <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Payee UPI VPA:</span>
              <div style={{ fontWeight: '700', color: '#f8fafc', fontSize: '0.95rem', marginTop: '2px', wordBreak: 'break-all' }}>
                {result.recipient}
              </div>
            </div>

            <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Locked Debit Amount:</span>
              <div style={{
                fontWeight: '900',
                color: result.amount && result.amount > 0 ? getRiskColor(result.riskLevel, result.riskScore) : '#38bdf8',
                fontSize: '1.1rem',
                fontFamily: 'var(--font-mono)',
                marginTop: '2px'
              }}>
                {result.amount && result.amount > 0 ? `₹${result.amount.toLocaleString('en-IN')}` : 'Open / Unset by Payee'}
              </div>
            </div>

            <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Transaction Target:</span>
              <div style={{ fontWeight: '700', color: '#f8fafc', fontSize: '0.95rem', marginTop: '2px' }}>
                {result.destination}
              </div>
            </div>
          </div>

          {/* Payment Signals Breakdown */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#f8fafc', marginBottom: '0.75rem' }}>
              Identified Payment Signals & Risk Breakdown
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {result.signals?.map((sig, idx) => {
                const sigColor = sig.severity === 'HIGH' ? '#f43f5e' : sig.severity === 'MEDIUM' ? '#f59e0b' : '#10b981';
                return (
                  <div key={idx} style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderLeft: `4px solid ${sigColor}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div>
                      <strong style={{ color: '#f8fafc', fontSize: '0.9rem' }}>{sig.name}</strong>
                      <p style={{ color: '#cbd5e1', fontSize: '0.8rem', marginTop: '2px' }}>{sig.description}</p>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '800', color: sigColor, flexShrink: 0 }}>
                      +{sig.score}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explanation Alert */}
          <div style={{
            background: result.riskLevel === 'HIGH' ? 'rgba(244, 63, 94, 0.12)' : result.riskLevel === 'MEDIUM' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)',
            border: `1px solid ${getRiskColor(result.riskLevel, result.riskScore)}40`,
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
          }}>
            <h4 style={{ color: getRiskColor(result.riskLevel, result.riskScore), fontSize: '0.95rem', fontWeight: '800', marginBottom: '4px' }}>
              DOOMSDAY AI Safety Assessment ({result.riskScore}% {result.riskLevel} Risk)
            </h4>
            <p style={{ color: '#f8fafc', fontSize: '0.9rem', lineHeight: '1.5' }}>
              {result.explanation}
            </p>
          </div>

          {/* Safety Recommendation */}
          <div style={{
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '10px',
            padding: '1rem',
            marginBottom: '1.25rem',
          }}>
            <h5 style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: '800', marginBottom: '4px' }}>
              Action Required:
            </h5>
            <p style={{ color: '#f8fafc', fontSize: '0.85rem' }}>
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
