import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, CheckCircle, HelpCircle } from 'lucide-react';
import { api } from '../services/api';

export default function FeedbackPrompt({ scanId }) {
  const [useful, setUseful] = useState(null);
  const [actualStatus, setActualStatus] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (actual) => {
    setActualStatus(actual);
    setSubmitting(true);
    try {
      await api.submitFeedback({
        scanId: scanId || Date.now(),
        useful: useful === true,
        actualStatus: actual,
        comments: 'Submitted via analysis result prompt',
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center', borderColor: 'rgba(16, 185, 129, 0.4)' }}>
        <CheckCircle size={24} color="#10b981" style={{ margin: '0 auto 8px' }} />
        <h4 style={{ color: '#f8fafc', fontSize: '0.95rem', fontWeight: '700' }}>
          Thank you for your feedback!
        </h4>
        <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '4px' }}>
          Your anonymized input helps refine community safety heuristics without storing personal data.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <h4 style={{ color: '#f8fafc', fontWeight: '700', fontSize: '1rem', marginBottom: '0.8rem' }}>
        Help Improve ShieldPay AI
      </h4>

      {useful === null ? (
        <div>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Was this warning and breakdown useful?
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setUseful(true)}
              className="btn-secondary"
              style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
            >
              <ThumbsUp size={16} color="#10b981" />
              YES
            </button>
            <button
              onClick={() => setUseful(false)}
              className="btn-secondary"
              style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
            >
              <ThumbsDown size={16} color="#f43f5e" />
              NO
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Was this payment situation actually suspicious or deceptive?
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleSubmit('YES')}
              disabled={submitting}
              className="btn-secondary"
              style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem', color: '#f43f5e' }}
            >
              YES
            </button>
            <button
              onClick={() => handleSubmit('NO')}
              disabled={submitting}
              className="btn-secondary"
              style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem', color: '#10b981' }}
            >
              NO
            </button>
            <button
              onClick={() => handleSubmit('NOT_SURE')}
              disabled={submitting}
              className="btn-secondary"
              style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem', color: '#f59e0b' }}
            >
              NOT SURE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
