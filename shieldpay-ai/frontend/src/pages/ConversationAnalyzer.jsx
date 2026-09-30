import React, { useState } from 'react';
import { 
  GitFork, 
  MessageSquare, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Info
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { api } from '../services/api';

export default function ConversationAnalyzer() {
  const [messages, setMessages] = useState([
    "Hello, I'm customer support from your payment app.",
    "We noticed an irregular transaction on your account. Your account has an issue.",
    "Send ₹1 token fee to our temporary nodal address to verify your account.",
    "Do it immediately or your bank account will be blocked within 30 minutes."
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);

  const addMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, newMessage.trim()]);
      setNewMessage('');
    }
  };

  const removeMessage = (idx) => {
    setMessages(messages.filter((_, i) => i !== idx));
  };

  const loadSample = () => {
    setMessages([
      "Hello, I'm customer support.",
      "Your account has an issue.",
      "Send ₹1 to verify your account.",
      "Do it immediately or your account will be blocked."
    ]);
    setAnalysis(null);
  };

  const runAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await api.scanConversation({
        messages,
        senderType: 'Unknown Person',
        paymentMethod: 'UPI',
      });
      setAnalysis(res);
      if (res.timeline && res.timeline.length > 0) {
        setSelectedPoint(res.timeline[res.timeline.length - 1]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  // Prepare chart data
  const chartData = analysis?.timeline?.map((step) => ({
    name: `Msg ${step.stepNumber}`,
    score: step.progressiveRiskScore,
    message: step.messageText,
    level: step.riskLevel,
    stepData: step,
  })) || [];

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
          background: 'rgba(168, 85, 247, 0.1)',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          color: '#c084fc',
          fontSize: '0.85rem',
          fontWeight: '700',
          marginBottom: '1rem',
        }}>
          <GitFork size={16} />
          <span>Unique Feature 1 & 2</span>
        </div>

        <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#f8fafc', marginBottom: '0.5rem' }}>
          Conversation Risk Analyzer
        </h1>
        <p style={{ color: '#cbd5e1', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto' }}>
          See how social engineering unfolds step by step across multiple messages and pinpoint where manipulation starts.
        </p>
      </div>

      {/* Input messages panel */}
      <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '8px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} color="#38bdf8" />
            Dialogue Messages ({messages.length})
          </h3>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={loadSample} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              Load Demo Dialogue
            </button>
            <button
              onClick={runAnalysis}
              disabled={analyzing || messages.length === 0}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            >
              <Sparkles size={16} />
              {analyzing ? 'Analyzing...' : 'Analyze Risk Escalation'}
            </button>
          </div>
        </div>

        {/* Existing Messages list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.2rem' }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: '700',
                  flexShrink: 0,
                }}>
                  #{idx + 1}
                </span>
                <span style={{ color: '#f8fafc', fontSize: '0.9rem' }}>
                  {msg}
                </span>
              </div>

              <button
                onClick={() => removeMessage(idx)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
                title="Remove message"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Add Message input */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Type or paste the next message in the conversation..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') addMessage(); }}
          />
          <button onClick={addMessage} className="btn-secondary" style={{ padding: '0 16px', flexShrink: 0 }}>
            <Plus size={18} />
            Add Message
          </button>
        </div>
      </div>

      {/* Analysis Results View */}
      {analysis && (
        <div>
          {/* Risk Progression Header */}
          <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <span className="badge badge-high" style={{ marginBottom: '6px' }}>
                  CONVERSATION ESCALATION DETECTED
                </span>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#f8fafc' }}>
                  How the conversation became risky
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
                  Risk progression: {analysis.timeline.map((t) => t.progressiveRiskScore).join(' → ')}
                </p>
              </div>

              <div style={{
                textAlign: 'right',
                padding: '12px 20px',
                borderRadius: '12px',
                background: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
              }}>
                <span style={{ fontSize: '0.75rem', color: '#fb7185', fontWeight: '700', textTransform: 'uppercase' }}>
                  Final Dialogue Risk
                </span>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                  {analysis.finalRiskScore} / 100
                </div>
              </div>
            </div>

            {/* Interactive Graph (Unique Feature 2) */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <TrendingUp size={20} color="#38bdf8" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#f8fafc' }}>
                  Why Did My Risk Score Change? (Risk Score Evolution)
                </h3>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Click on any step point below to see the exact signal detected, score added, and behavioral explanation.
              </p>

              <div style={{ width: '100%', height: '260px', background: 'rgba(0, 0, 0, 0.25)', borderRadius: '12px', padding: '10px 0' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    onClick={(e) => {
                      if (e && e.activePayload && e.activePayload[0]) {
                        setSelectedPoint(e.activePayload[0].payload.stepData);
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div style={{
                              background: '#0b1120',
                              border: '1px solid rgba(56, 189, 248, 0.3)',
                              borderRadius: '8px',
                              padding: '10px 14px',
                              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                            }}>
                              <div style={{ fontWeight: '700', color: '#38bdf8', fontSize: '0.85rem' }}>
                                {data.name} — Risk: {data.score}/100
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#e2e8f0', marginTop: '4px', maxWidth: '200px' }}>
                                "{data.message}"
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <ReferenceLine y={60} stroke="#f43f5e" strokeDasharray="4 4" label={{ value: 'HIGH RISK THRESHOLD', fill: '#fb7185', fontSize: 10 }} />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#38bdf8"
                      strokeWidth={3}
                      dot={{ r: 6, fill: '#00f2fe', stroke: '#ffffff', strokeWidth: 2 }}
                      activeDot={{ r: 9, fill: '#f43f5e' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Clicked Point Detail Box */}
            {selectedPoint && (
              <div style={{
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '2rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '800', color: '#38bdf8', fontSize: '0.9rem' }}>
                    STEP {selectedPoint.stepNumber} INSPECTION
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#f8fafc' }}>
                    Progressive Score: {selectedPoint.progressiveRiskScore}/100
                  </span>
                </div>
                <div style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '8px', fontStyle: 'italic' }}>
                  "{selectedPoint.messageText}"
                </div>
                <p style={{ color: '#f8fafc', fontSize: '0.85rem' }}>
                  <strong>Escalation Cause:</strong> {selectedPoint.explanation}
                </p>
              </div>
            )}

            {/* Visual Step-by-Step Conversation Timeline (Unique Feature 1) */}
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#f8fafc', marginBottom: '1.25rem' }}>
                Timeline of Social Engineering Escalation
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {analysis.timeline.map((step) => {
                  const hasSignals = step.introducedSignals && step.introducedSignals.length > 0;
                  return (
                    <div
                      key={step.stepNumber}
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        padding: '1.25rem',
                        borderRadius: '12px',
                        background: hasSignals ? 'rgba(244, 63, 94, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                        border: hasSignals ? '1px solid rgba(244, 63, 94, 0.35)' : '1px solid rgba(255, 255, 255, 0.05)',
                        position: 'relative',
                      }}
                    >
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: hasSignals ? '#f43f5e' : '#334155',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontWeight: '800',
                        fontSize: '0.85rem',
                        fontFamily: 'var(--font-mono)',
                        flexShrink: 0,
                      }}>
                        {step.stepNumber}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                          <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>
                            Message {step.stepNumber}
                          </span>
                          <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontWeight: '800',
                            fontSize: '0.85rem',
                            color: step.progressiveRiskScore >= 60 ? '#f43f5e' : step.progressiveRiskScore >= 30 ? '#f59e0b' : '#10b981',
                          }}>
                            Risk: {step.progressiveRiskScore} / 100
                          </span>
                        </div>

                        <div style={{ color: '#f8fafc', fontSize: '0.95rem', marginBottom: '8px', fontWeight: '500' }}>
                          "{step.messageText}"
                        </div>

                        {hasSignals && (
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                            {step.introducedSignals.map((sig, sIdx) => (
                              <span key={sIdx} className="badge badge-high" style={{ fontSize: '0.7rem' }}>
                                Introduced: {sig.name} (+{sig.score})
                              </span>
                            ))}
                          </div>
                        )}

                        <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                          {step.explanation}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
