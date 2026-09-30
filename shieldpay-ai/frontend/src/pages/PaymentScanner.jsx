import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ShieldAlert, 
  Sparkles, 
  Lock, 
  EyeOff, 
  HelpCircle, 
  ArrowRight, 
  AlertTriangle,
  RotateCcw,
  Zap
} from 'lucide-react';
import { api } from '../services/api';
import AnalysisLoadingScreen from './AnalysisLoadingScreen';

export default function PaymentScanner() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [sender, setSender] = useState('');
  const [senderType, setSenderType] = useState('Unknown Person');
  const [url, setUrl] = useState('');
  const [reason, setReason] = useState('');
  const [privacyMode, setPrivacyMode] = useState(false);

  const [analyzing, setAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');

  // Check URL query parameters for demo triggers
  useEffect(() => {
    if (searchParams.get('demo') === 'account_suspension') {
      populateDemoScam();
    }
  }, [searchParams]);

  const populateRealMessage = () => {
    setMessage('Dear Customer, INR 450.00 debited from A/c XX8920 on 30-Sep. Info: UPI/3920194829/Starbucks. Available Bal: INR 12,450.00.');
    setAmount('450');
    setPaymentMethod('UPI');
    setSender('HDFC-Alerts');
    setSenderType('Business');
    setUrl('');
    setReason('Routine coffee purchase debit notification');
    setError('');
  };

  const populateScamThreat = () => {
    setMessage('URGENT: Your electricity connection will be disconnected TONIGHT at 9:30 PM due to unpaid bill of ₹1,450. Call electricity officer immediately at 9876543210 to stop disconnection!');
    setAmount('1450');
    setPaymentMethod('UPI');
    setSender('+91 9876543210');
    setSenderType('Unknown Person');
    setUrl('');
    setReason('Electricity bill payment to avoid immediate disconnection');
    setError('');
  };

  const populateDemoScam = () => {
    setMessage('Your bank account will be blocked today due to pending KYC. Call customer support immediately and pay ₹1,999 to verify your account.');
    setAmount('1999');
    setPaymentMethod('UPI');
    setSender('+91 9876543210');
    setSenderType('Unknown Person');
    setUrl('http://sbi-alert-verify.com/login');
    setReason('Account verification fee to prevent permanent suspension');
    setError('');
  };

  const populateDigitalArrestScam = () => {
    setMessage('CYBER CRIME POLICE SUMMONS: Arrest warrant issued under FIR #90218 for money laundering. You are placed under DIGITAL ARREST. Transfer ₹45,000 bail security to clearing account immediately or police team will reach your residence in 30 minutes.');
    setAmount('45000');
    setPaymentMethod('Bank Transfer');
    setSender('+91 8899001122');
    setSenderType('Unknown Person');
    setUrl('');
    setReason('Police digital arrest bail security deposit');
    setError('');
  };

  const populateDinnerSplitReal = () => {
    setMessage('Hey! Thanks for organizing dinner last night. Here is my ₹650 share for the restaurant bill. Sent via UPI ref 49201948.');
    setAmount('650');
    setPaymentMethod('UPI');
    setSender('Rahul Sharma');
    setSenderType('Friend / Family');
    setUrl('');
    setReason('Split dinner bill with Rahul');
    setError('');
  };

  const clearForm = () => {
    setMessage('');
    setAmount('');
    setPaymentMethod('UPI');
    setSender('');
    setSenderType('Unknown Person');
    setUrl('');
    setReason('');
    setError('');
  };

  const handleAnalyze = async (e) => {
    e?.preventDefault();
    if (!message.trim()) {
      setError('Please paste or type the message/information you received before analyzing.');
      return;
    }
    setError('');
    setAnalyzing(true);

    try {
      const payload = {
        message: message.trim(),
        amount: amount ? parseFloat(amount) : null,
        paymentMethod,
        sender: sender.trim(),
        senderType,
        url: url.trim(),
        reason: reason.trim(),
        privacyMode,
      };

      const result = await api.scanPayment(payload);
      setScanResult(result);
    } catch (err) {
      setError('An error occurred during scan processing. Using local engine fallback.');
    }
  };

  const handleLoadingComplete = () => {
    setAnalyzing(false);
    if (scanResult) {
      navigate('/result', { state: { scanResult } });
    }
  };

  if (analyzing) {
    return <AnalysisLoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
      {/* Page Header */}
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
          <ShieldAlert size={16} />
          <span>Pre-Transaction Decision Support</span>
        </div>

        <h1 style={{ fontSize: '2.4rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#f8fafc', marginBottom: '0.5rem' }}>
          Check Before You Pay
        </h1>
        <p style={{ color: '#cbd5e1', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
          Paste the message or payment information you received. We will analyze suspicious signals before your money leaves.
        </p>
      </div>

      {/* Mandatory Privacy Warning Banner */}
      <div style={{
        background: 'rgba(244, 63, 94, 0.1)',
        border: '1px solid rgba(244, 63, 94, 0.35)',
        borderRadius: '12px',
        padding: '1rem 1.25rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
      }}>
        <AlertTriangle size={22} color="#f43f5e" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h4 style={{ color: '#fb7185', fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Strict Privacy & Security Rule
          </h4>
          <p style={{ color: '#f8fafc', fontSize: '0.85rem', marginTop: '3px' }}>
            Never enter or share: <strong>OTP, UPI PIN, card PIN, CVV, passwords, or banking login credentials</strong>. Legitimate payment services never need your PIN to send money or verify accounts.
          </p>
        </div>
      </div>

      {/* Main Scanner Card */}
      <div className="glass-panel" style={{ padding: '2rem', position: 'relative' }}>
        {/* Quick Demo Pre-fill Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          paddingBottom: '1.5rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} color="#00f2fe" />
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#e2e8f0' }}>
              Quick Evaluation:
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={populateRealMessage}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.4)' }}
            >
              ✓ Real: Bank Receipt (Safe)
            </button>
            <button
              type="button"
              onClick={populateDinnerSplitReal}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.4)' }}
            >
              ✓ Real: Dinner Split (Safe)
            </button>
            <button
              type="button"
              onClick={populateScamThreat}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#fb7185', borderColor: 'rgba(244, 63, 94, 0.4)' }}
            >
              ⚠ Scam: Power Threat (Urgent)
            </button>
            <button
              type="button"
              onClick={populateDigitalArrestScam}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#fb7185', borderColor: 'rgba(244, 63, 94, 0.4)' }}
            >
              ⚠ Scam: Digital Arrest (Urgent)
            </button>
            <button
              type="button"
              onClick={populateDemoScam}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.4)' }}
            >
              ⚠ Scam: KYC Phishing Trap
            </button>
            <button
              type="button"
              onClick={clearForm}
              className="btn-secondary"
              style={{ padding: '6px 10px', fontSize: '0.8rem' }}
              title="Reset fields"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Real vs Scam Message Difference Education Card */}
        <div style={{
          background: 'rgba(6, 9, 19, 0.75)',
          borderRadius: '14px',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          padding: '1.25rem',
          marginBottom: '1.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Sparkles size={18} color="#38bdf8" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
              How DOOMSDAY AI Senses Real Messages vs Scam Messages
            </h4>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            {/* Real Message Card */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.06)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '10px',
              padding: '12px 14px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <span style={{ color: '#10b981', fontWeight: '900' }}>✓</span>
                <strong style={{ color: '#34d399', fontSize: '0.85rem' }}>Authentic / Real Message Traits:</strong>
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.78rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                <li><strong>Purpose:</strong> Post-transaction statement (<code style={{ color: '#34d399' }}>debited from a/c</code>, <code style={{ color: '#34d399' }}>ref no</code>) or casual peer chat.</li>
                <li><strong>No Coercion:</strong> Contains zero threats of disconnection, arrest, or panic countdowns.</li>
                <li><strong>Credential Safety:</strong> Never asks you to click links or enter PIN to "receive" money.</li>
                <li><strong>Score:</strong> Evaluates to <strong>0% - 15% LOW RISK</strong> with verified real badge.</li>
              </ul>
            </div>

            {/* Scam Message Card */}
            <div style={{
              background: 'rgba(244, 63, 94, 0.06)',
              border: '1px solid rgba(244, 63, 94, 0.25)',
              borderRadius: '10px',
              padding: '12px 14px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <span style={{ color: '#f43f5e', fontWeight: '900' }}>⚠</span>
                <strong style={{ color: '#fb7185', fontSize: '0.85rem' }}>Scam Message Defect Indicators:</strong>
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.78rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                <li><strong>Manufactured Threats:</strong> Utility cut-offs ("tonight at 9:30"), fake digital arrest, blocked accounts.</li>
                <li><strong>Artificial Urgency:</strong> Demands immediate action to bypass your logical scrutiny.</li>
                <li><strong>Unofficial Redirection:</strong> Calls to personal mobile numbers or rogue links.</li>
                <li><strong>Score:</strong> Evaluates to <strong>80% - 95% HIGH RISK</strong> with critical scam warning.</li>
              </ul>
            </div>
          </div>
        </div>

        <form onSubmit={handleAnalyze}>
          {/* Message Field (Required) */}
          <div className="form-group">
            <label className="form-label" htmlFor="scanner-message">
              Message Received <span style={{ color: '#f43f5e' }}>*</span>
            </label>
            <textarea
              id="scanner-message"
              className="form-textarea"
              placeholder="Paste the SMS, WhatsApp message, email notice, or chat text here... (e.g. 'Your account will be blocked today. Pay ₹1,999 to verify...')"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
            />
          </div>

          {/* Amount & Payment Method */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.25rem',
          }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="scanner-amount">
                Payment Amount (₹)
              </label>
              <input
                id="scanner-amount"
                type="number"
                step="any"
                className="form-input"
                placeholder="e.g. 1999"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="scanner-method">
                Payment Method
              </label>
              <select
                id="scanner-method"
                className="form-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="UPI">UPI (Google Pay, PhonePe, Paytm, etc.)</option>
                <option value="Bank Transfer">Bank Transfer (IMPS / NEFT / RTGS)</option>
                <option value="Card">Credit / Debit Card</option>
                <option value="Wallet">Digital Wallet</option>
                <option value="Other">Other / Unknown</option>
              </select>
            </div>
          </div>

          {/* Sender & Sender Type */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.25rem',
          }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="scanner-sender">
                Sender Identifier (Optional)
              </label>
              <input
                id="scanner-sender"
                type="text"
                className="form-input"
                placeholder="Phone number, UPI handle, or email"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="scanner-sender-type">
                Sender Type
              </label>
              <select
                id="scanner-sender-type"
                className="form-select"
                value={senderType}
                onChange={(e) => setSenderType(e.target.value)}
              >
                <option value="Unknown Person">Unknown Person</option>
                <option value="Known Person">Known Person</option>
                <option value="Customer Support">Customer Support</option>
                <option value="Business">Business</option>
                <option value="Delivery Service">Delivery Service</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* URL (Optional) */}
          <div className="form-group">
            <label className="form-label" htmlFor="scanner-url">
              Website Link / URL (Optional)
            </label>
            <input
              id="scanner-url"
              type="text"
              className="form-input"
              placeholder="e.g. http://sbi-alert-verify.com/login or bit.ly/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          {/* Reason for Payment */}
          <div className="form-group">
            <label className="form-label" htmlFor="scanner-reason">
              Reason for Payment (Optional)
            </label>
            <textarea
              id="scanner-reason"
              className="form-textarea"
              style={{ minHeight: '70px' }}
              placeholder="What did they claim this money was for? (e.g. Account unblocking, prize tax, parcel customs fee)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
            />
          </div>

          {/* Privacy Mode Toggle */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: '12px',
            padding: '1.2rem',
            border: '1px solid rgba(56, 189, 248, 0.15)',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: privacyMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(148, 163, 184, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <EyeOff size={20} color={privacyMode ? '#10b981' : '#94a3b8'} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.95rem', color: '#f8fafc' }}>
                    Privacy Mode
                  </span>
                  <span className={`badge ${privacyMode ? 'badge-low' : 'badge-med'}`}>
                    {privacyMode ? 'ACTIVE' : 'STANDARD'}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                  Masks phone numbers & emails. Original text is never permanently stored.
                </p>
              </div>
            </div>

            <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px' }}>
              <input
                type="checkbox"
                checked={privacyMode}
                onChange={(e) => setPrivacyMode(e.target.checked)}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: privacyMode ? '#10b981' : '#334155',
                borderRadius: '34px',
                transition: '0.3s',
              }}>
                <span style={{
                  position: 'absolute',
                  content: '""',
                  height: '20px',
                  width: '20px',
                  left: privacyMode ? '25px' : '3px',
                  bottom: '3px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  transition: '0.3s',
                }} />
              </span>
            </label>
          </div>

          {error && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.4)',
              color: '#fb7185',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
            }}>
              {error}
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '16px', fontSize: '1.05rem', letterSpacing: '0.02em' }}
          >
            <ShieldAlert size={20} />
            ANALYZE PAYMENT
          </button>
        </form>
      </div>
    </div>
  );
}
