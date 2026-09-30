import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  History, 
  Search, 
  Filter, 
  Trash2, 
  Link2, 
  QrCode, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ShieldAlert,
  X,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';

export default function ScanHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL'); // ALL, LINK, QR, PAYMENT
  const [selectedScan, setSelectedScan] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getScanHistory();
      setHistory(data);
    } catch (err) {
      console.error('Error loading history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear your checked links and scan history? This action cannot be undone.')) {
      setLoading(true);
      try {
        await api.clearHistory();
        setHistory([]);
      } catch (err) {
        console.error('Error clearing history:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredHistory = history.filter((item) => {
    // Type filter
    if (activeFilter === 'LINK' && item.sourceType !== 'LINK' && item.paymentMethod !== 'Website Link') return false;
    if (activeFilter === 'QR' && item.sourceType !== 'QR' && item.paymentMethod !== 'UPI QR Code') return false;
    if (activeFilter === 'PAYMENT' && item.sourceType === 'LINK' && item.sourceType === 'QR') return false;

    // Search query
    const q = searchTerm.toLowerCase();
    const target = (item.target || item.url || item.sender || '').toLowerCase();
    const category = (item.scamCategory || '').toLowerCase();
    const risk = (item.riskLevel || '').toLowerCase();
    return target.includes(q) || category.includes(q) || risk.includes(q);
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Just now';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const getRiskColor = (level, score) => {
    if (level === 'HIGH' || score >= 60) return '#f43f5e';
    if (level === 'MEDIUM' || score >= 30) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
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
          <History size={16} />
          <span>DOOMSDAY Security Audit Trail</span>
        </div>

        <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#f8fafc', marginBottom: '0.5rem' }}>
          My Verified Check History
        </h1>
        <p style={{ color: '#cbd5e1', fontSize: '1.05rem', maxWidth: '620px', margin: '0 auto' }}>
          Strictly records your actual analyzed website links, scanned payment QR codes, and transaction evaluations. Zero pre-loaded or dummy data.
        </p>
      </div>

      {/* Control Bar: Filters, Search & Clear */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Type Filter Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveFilter('ALL')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: activeFilter === 'ALL' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
              background: activeFilter === 'ALL' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(0, 0, 0, 0.2)',
              color: activeFilter === 'ALL' ? '#38bdf8' : '#94a3b8',
              fontSize: '0.85rem',
              fontWeight: activeFilter === 'ALL' ? '700' : '500',
              cursor: 'pointer',
            }}
          >
            All Checks ({history.length})
          </button>

          <button
            onClick={() => setActiveFilter('LINK')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: activeFilter === 'LINK' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
              background: activeFilter === 'LINK' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(0, 0, 0, 0.2)',
              color: activeFilter === 'LINK' ? '#38bdf8' : '#94a3b8',
              fontSize: '0.85rem',
              fontWeight: activeFilter === 'LINK' ? '700' : '500',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Link2 size={14} />
            Checked Links
          </button>

          <button
            onClick={() => setActiveFilter('QR')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: activeFilter === 'QR' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
              background: activeFilter === 'QR' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(0, 0, 0, 0.2)',
              color: activeFilter === 'QR' ? '#38bdf8' : '#94a3b8',
              fontSize: '0.85rem',
              fontWeight: activeFilter === 'QR' ? '700' : '500',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <QrCode size={14} />
            QR Scans
          </button>

          <button
            onClick={() => setActiveFilter('PAYMENT')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: activeFilter === 'PAYMENT' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
              background: activeFilter === 'PAYMENT' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(0, 0, 0, 0.2)',
              color: activeFilter === 'PAYMENT' ? '#38bdf8' : '#94a3b8',
              fontSize: '0.85rem',
              fontWeight: activeFilter === 'PAYMENT' ? '700' : '500',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <CreditCard size={14} />
            Payment Checks
          </button>
        </div>

        {/* Search and Clear action */}
        <div style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '260px', justifyContent: 'flex-end' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
            <Search size={16} color="#64748b" style={{ position: 'absolute', top: '12px', left: '12px' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '36px', height: '40px', fontSize: '0.85rem' }}
              placeholder="Search target or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="btn-secondary"
              style={{
                padding: '8px 14px',
                fontSize: '0.85rem',
                color: '#fb7185',
                borderColor: 'rgba(244, 63, 94, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
              title="Clear all recorded history"
            >
              <Trash2 size={15} />
              Clear History
            </button>
          )}
        </div>
      </div>

      {/* History Records Table */}
      <div className="glass-panel" style={{ padding: '1rem', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
            Loading DOOMSDAY security audit records...
          </div>
        ) : filteredHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'rgba(56, 189, 248, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              color: '#38bdf8',
            }}>
              <History size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f8fafc', marginBottom: '0.5rem' }}>
              No Recorded Scans in History
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '460px', margin: '0 auto 1.5rem' }}>
              Your check history is completely clean. Analyze any suspicious link or QR code to immediately log verified results here.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/url-analyzer" className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
                <Link2 size={16} />
                Check a Link
              </Link>
              <Link to="/qr-analyzer" className="btn-secondary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
                <QrCode size={16} />
                Inspect a QR Code
              </Link>
            </div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '12px 14px' }}>Timestamp</th>
                <th style={{ padding: '12px 14px' }}>Type</th>
                <th style={{ padding: '12px 14px' }}>Analyzed Target</th>
                <th style={{ padding: '12px 14px' }}>Risk Percentage</th>
                <th style={{ padding: '12px 14px' }}>Identified Finding</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item, idx) => {
                const isLink = item.sourceType === 'LINK' || item.paymentMethod === 'Website Link';
                const isQr = item.sourceType === 'QR' || item.paymentMethod === 'UPI QR Code';
                const score = item.riskScore !== undefined ? item.riskScore : 0;
                const level = item.riskLevel || (score >= 60 ? 'HIGH' : score >= 30 ? 'MEDIUM' : 'LOW');
                const riskColor = getRiskColor(level, score);

                return (
                  <tr
                    key={`${item.id || 'scan'}-${idx}`}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      fontSize: '0.88rem',
                      transition: 'background 0.2s',
                    }}
                    className="glass-panel-interactive"
                  >
                    <td style={{ padding: '14px', color: '#94a3b8', whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                      {formatDate(item.createdAt)}
                    </td>

                    <td style={{ padding: '14px', whiteSpace: 'nowrap' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        background: isLink ? 'rgba(56, 189, 248, 0.12)' : isQr ? 'rgba(168, 85, 247, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                        color: isLink ? '#38bdf8' : isQr ? '#c084fc' : '#34d399',
                        border: `1px solid ${isLink ? 'rgba(56, 189, 248, 0.25)' : isQr ? 'rgba(168, 85, 247, 0.25)' : 'rgba(16, 185, 129, 0.25)'}`,
                      }}>
                        {isLink ? <Link2 size={13} /> : isQr ? <QrCode size={13} /> : <CreditCard size={13} />}
                        {isLink ? 'LINK' : isQr ? 'QR CODE' : 'PAYMENT'}
                      </span>
                    </td>

                    <td style={{ padding: '14px', color: '#f8fafc', fontWeight: '600', maxWidth: '300px', wordBreak: 'break-all' }}>
                      {item.target || item.url || item.recipient || item.sender || 'Scanned Input'}
                      {item.amount && item.amount > 0 ? (
                        <span style={{ display: 'block', fontSize: '0.75rem', color: '#fb7185', fontFamily: 'var(--font-mono)' }}>
                          Locked: ₹{item.amount.toLocaleString('en-IN')}
                        </span>
                      ) : null}
                    </td>

                    <td style={{ padding: '14px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          className={`badge ${level === 'HIGH' ? 'badge-high' : level === 'MEDIUM' ? 'badge-med' : 'badge-low'}`}
                          style={{ fontSize: '0.75rem', padding: '3px 8px' }}
                        >
                          {score}% {level}
                        </span>
                      </div>
                    </td>

                    <td style={{ padding: '14px', color: '#cbd5e1', fontSize: '0.85rem' }}>
                      {item.scamCategory || (item.errors && item.errors.length > 0 ? item.errors[0] : 'Security Verification')}
                    </td>

                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedScan(item)}
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Inspect Modal Drawer */}
      {selectedScan && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem',
        }}>
          <div className="glass-panel" style={{
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            position: 'relative',
            borderTop: `4px solid ${getRiskColor(selectedScan.riskLevel, selectedScan.riskScore)}`,
          }}>
            <button
              onClick={() => setSelectedScan(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>

            <span className={`badge ${selectedScan.riskLevel === 'HIGH' ? 'badge-high' : selectedScan.riskLevel === 'MEDIUM' ? 'badge-med' : 'badge-low'}`}>
              {selectedScan.riskScore}% {selectedScan.riskLevel} RISK
            </span>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#f8fafc', marginTop: '8px', wordBreak: 'break-all' }}>
              {selectedScan.target || selectedScan.url || selectedScan.recipient}
            </h3>

            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '4px' }}>
              Checked on: {formatDate(selectedScan.createdAt)} • Type: {selectedScan.sourceType || selectedScan.paymentMethod}
            </p>

            {/* Error alerts if present */}
            {selectedScan.errors && selectedScan.errors.length > 0 && (
              <div style={{
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.4)',
                borderRadius: '8px',
                padding: '10px 14px',
                margin: '1.2rem 0',
                color: '#fb7185',
                fontSize: '0.85rem',
              }}>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Identified Errors / Traps:</strong>
                {selectedScan.errors.map((err, i) => (
                  <div key={i}>• {err}</div>
                ))}
              </div>
            )}

            {/* Explanation / Assessment */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '10px',
              padding: '1.2rem',
              margin: '1.2rem 0',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#38bdf8', marginBottom: '4px' }}>
                DOOMSDAY Security Assessment
              </h4>
              <p style={{ color: '#f8fafc', fontSize: '0.85rem', lineHeight: '1.5' }}>
                {selectedScan.explanation || selectedScan.summary}
              </p>
            </div>

            {/* Signals */}
            {selectedScan.signals && selectedScan.signals.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#f8fafc', marginBottom: '8px' }}>
                  Signal Breakdown:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedScan.signals.map((s, i) => (
                    <div key={i} style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.8rem',
                    }}>
                      <span style={{ color: '#cbd5e1' }}>{s.name || s.signalName}: {s.description}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#38bdf8' }}>+{s.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setSelectedScan(null)}
              className="btn-primary"
              style={{ width: '100%', padding: '10px' }}
            >
              Close Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
