import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  ShieldAlert, 
  AlertTriangle, 
  ShieldCheck, 
  MessageSquare, 
  TrendingUp, 
  PieChart as PieIcon, 
  BarChart3, 
  MapPin, 
  LogOut, 
  Sparkles,
  Info,
  RefreshCw
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { api } from '../services/api';

const RISK_COLORS = {
  HIGH: '#f43f5e',
  MEDIUM: '#f59e0b',
  LOW: '#10b981',
};

const CHART_PALETTE = ['#00f2fe', '#4facfe', '#a855f7', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const raw = localStorage.getItem('shieldpay_admin_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [sData, tData] = await Promise.all([
        api.getAdminStatistics(),
        api.getAdminTrends(),
      ]);
      setStats(sData);
      setTrends(tData.trends || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('shieldpay_admin_token');
    localStorage.removeItem('shieldpay_admin_user');
    navigate('/admin/login');
  };

  // Prepare chart formats
  const riskPieData = stats?.riskDistribution
    ? Object.entries(stats.riskDistribution).map(([name, value]) => ({ name, value }))
    : [
        { name: 'HIGH', value: 215 },
        { name: 'MEDIUM', value: 340 },
        { name: 'LOW', value: 690 },
      ];

  const categoryBarData = stats?.categoryDistribution
    ? Object.entries(stats.categoryDistribution).map(([name, count]) => ({ name, count }))
    : [
        { name: 'Account Suspension', count: 310 },
        { name: 'Fake Support', count: 245 },
        { name: 'Fake Refund', count: 180 },
        { name: 'Prize Scam', count: 165 },
        { name: 'Credential Harvest', count: 140 },
        { name: 'Fake Shopping', count: 115 },
      ];

  const paymentMethodPieData = stats?.paymentMethodDistribution
    ? Object.entries(stats.paymentMethodDistribution).map(([name, value]) => ({ name, value }))
    : [
        { name: 'UPI', value: 780 },
        { name: 'Bank Transfer', value: 230 },
        { name: 'Card', value: 140 },
        { name: 'Wallet', value: 65 },
        { name: 'Other', value: 30 },
      ];

  const signalBarData = stats?.signalFrequencies
    ? Object.entries(stats.signalFrequencies)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([name, count]) => ({ name, count }))
    : [
        { name: 'Urgency', count: 598 },
        { name: 'Payment Req', count: 523 },
        { name: 'Unknown Sender', count: 460 },
        { name: 'Threat Lang', count: 386 },
        { name: 'Suspicious URL', count: 324 },
        { name: 'Credential Req', count: 210 },
      ];

  const communityInsights = [
    { city: 'Chennai', topScam: 'Fake Customer Care', reports: 128, severity: 'HIGH' },
    { city: 'Bengaluru', topScam: 'Fake Refund', reports: 94, severity: 'HIGH' },
    { city: 'Mumbai', topScam: 'Shopping Scam', reports: 76, severity: 'MEDIUM' },
    { city: 'Delhi NCR', topScam: 'Account Suspension', reports: 112, severity: 'HIGH' },
    { city: 'Hyderabad', topScam: 'Prize / Lottery', reports: 68, severity: 'MEDIUM' },
    { city: 'Pune', topScam: 'QR Reverse Charge', reports: 54, severity: 'HIGH' },
  ];

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
      {/* Top Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #00f2fe, #a855f7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '900',
            color: '#060913',
            fontSize: '1.3rem',
            boxShadow: '0 0 15px rgba(0, 242, 254, 0.35)',
          }}>
            {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#f8fafc' }}>
                {adminUser?.name || 'Authorized Administrator'}
              </span>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: '800',
                padding: '2px 8px',
                borderRadius: '9999px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#34d399',
                letterSpacing: '0.04em',
              }}>
                ACTIVE OPERATOR
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
              {adminUser?.email || 'admin@doomsday.ai'} • DOOMSDAY Threat Intelligence Portal
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={loadDashboardData}
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <RefreshCw size={14} />
            Refresh Data
          </button>
          <button
            onClick={handleLogout}
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.85rem', color: '#f43f5e' }}
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Prominent Admin Operator Display Card */}
      <div className="glass-panel" style={{
        padding: '1.25rem 1.75rem',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(6, 9, 19, 0.95), rgba(15, 23, 42, 0.9))',
        border: '1px solid rgba(0, 242, 254, 0.3)',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 8px 30px rgba(0, 242, 254, 0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #00f2fe, #a855f7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '900',
            color: '#060913',
            fontSize: '1.5rem',
            boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)',
          }}>
            {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#38bdf8', fontWeight: '800' }}>
                ADMINISTRATOR ON DUTY
              </span>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: '800',
                padding: '2px 8px',
                borderRadius: '9999px',
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.5)',
                color: '#34d399',
              }}>
                ● ACTIVE SESSION
              </span>
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: '900', color: '#ffffff', margin: '4px 0 2px' }}>
              {adminUser?.name || 'Authorized Administrator'}
            </h2>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              Email: <span style={{ color: '#cbd5e1' }}>{adminUser?.email || 'admin@doomsday.ai'}</span> • Role: <span style={{ color: '#c084fc', fontWeight: '700' }}>Security Administrator</span> • Portal: <span style={{ color: '#38bdf8' }}>DOOMSDAY AI Radar</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{
            padding: '8px 16px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            textAlign: 'right',
          }}>
            <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: '700' }}>
              System Authority
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#34d399' }}>
              Level-1 Full Defense Access
            </span>
          </div>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem',
      }}>
        {/* Total Scans */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #38bdf8' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>
            TOTAL SCANS
          </span>
          <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#f8fafc', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {(stats?.totalScans || 1245).toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '4px' }}>
            ↑ 14.8% volume this week
          </div>
        </div>

        {/* High Risk */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #f43f5e' }}>
          <span style={{ fontSize: '0.8rem', color: '#fb7185', textTransform: 'uppercase', fontWeight: '700' }}>
            HIGH RISK SCANS
          </span>
          <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#f43f5e', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {(stats?.highRiskScans || 215).toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
            Coercive signals detected
          </div>
        </div>

        {/* Medium Risk */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
          <span style={{ fontSize: '0.8rem', color: '#fbbf24', textTransform: 'uppercase', fontWeight: '700' }}>
            MEDIUM RISK SCANS
          </span>
          <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#f59e0b', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {(stats?.mediumRiskScans || 340).toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
            Caution flags advised
          </div>
        </div>

        {/* Low Risk */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
          <span style={{ fontSize: '0.8rem', color: '#34d399', textTransform: 'uppercase', fontWeight: '700' }}>
            LOW RISK SCANS
          </span>
          <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#10b981', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {(stats?.lowRiskScans || 690).toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
            Legitimate billing/splits
          </div>
        </div>

        {/* Feedback Reports */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #a855f7' }}>
          <span style={{ fontSize: '0.8rem', color: '#c084fc', textTransform: 'uppercase', fontWeight: '700' }}>
            FEEDBACK REPORTS
          </span>
          <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#c084fc', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {(stats?.totalFeedback || 128).toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '4px' }}>
            89.1% reported useful
          </div>
        </div>
      </div>

      {/* Row 1 Charts: Risk Distribution & Category Distribution */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
      }}>
        {/* Chart 1: Risk Distribution */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <PieIcon size={18} color="#38bdf8" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc' }}>
              Risk Distribution
            </h3>
          </div>
          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {riskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={RISK_COLORS[entry.name] || CHART_PALETTE[index % CHART_PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0b1120', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category Distribution */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <BarChart3 size={18} color="#a855f7" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc' }}>
              Scam Category Distribution
            </h3>
          </div>
          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryBarData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis type="number" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis dataKey="name" type="category" width={110} stroke="#64748b" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0b1120', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#818cf8" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2 Charts: Risk Trend Over Time & Common Signals */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
      }}>
        {/* Chart 3: Risk Trend Over Time */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <TrendingUp size={18} color="#10b981" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc' }}>
              Risk Trend Over Time (7-Day Average)
            </h3>
          </div>
          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#64748b" domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0b1120', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="avgRiskScore" stroke="#00f2fe" strokeWidth={3} dot={{ r: 4, fill: '#00f2fe' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Common Suspicious Signals */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <ShieldAlert size={18} color="#f43f5e" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc' }}>
              Most Common Suspicious Signals
            </h3>
          </div>
          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={signalBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0b1120', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ADMIN RECURRING PATTERN ANALYSIS */}
      <section className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#f8fafc', marginBottom: '0.5rem' }}>
          Recurring Causes of Risk Warnings
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Statistical recurrence frequency of individual psychological pressure signals across the demonstration dataset.
        </p>

        {/* Progress percentages */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}>
          {[
            { label: 'Urgency', pct: 48, color: '#f43f5e' },
            { label: 'Payment Request', pct: 42, color: '#f59e0b' },
            { label: 'Unknown Sender', pct: 37, color: '#38bdf8' },
            { label: 'Threat Language', pct: 31, color: '#a855f7' },
            { label: 'Suspicious URL', pct: 26, color: '#ec4899' },
          ].map((item) => (
            <div key={item.label} style={{ background: 'rgba(0,0,0,0.3)', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#cbd5e1', fontSize: '0.85rem', fontWeight: '600' }}>{item.label}</span>
                <span style={{ color: item.color, fontWeight: '800', fontFamily: 'var(--font-mono)' }}>{item.pct}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: '3px' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Insight Card */}
        <div style={{
          background: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '12px',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '14px',
        }}>
          <Sparkles size={24} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ color: '#38bdf8', fontSize: '1rem', fontWeight: '800', marginBottom: '4px' }}>
              Detected Pattern Insight
            </h4>
            <p style={{ color: '#f8fafc', fontSize: '0.9rem', lineHeight: '1.6' }}>
              "Urgency combined with unexpected payment requests appeared frequently in the demonstration dataset. Over 68% of confirmed high-risk scams leveraged both signals simultaneously to induce panic and force rapid payment action."
            </p>
            <span style={{ display: 'inline-block', marginTop: '8px', fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
              * Clearly labeled: Simulated demonstration data — not live police statistics.
            </span>
          </div>
        </div>
      </section>

      {/* UNIQUE FEATURE 7: ANONYMIZED COMMUNITY INSIGHTS */}
      <section className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={20} color="#f43f5e" />
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#f8fafc' }}>
                Anonymized Community Scam Trends
              </h3>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '2px' }}>
              Aggregated regional vector counts without personal details (demonstration data — not live crime statistics).
            </p>
          </div>

          <span className="badge badge-med">
            Simulated Demo Feed
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Region / City</th>
                <th style={{ padding: '12px 16px' }}>Prevalent Scam Vector</th>
                <th style={{ padding: '12px 16px' }}>Reports Ingested</th>
                <th style={{ padding: '12px 16px' }}>Threat Severity</th>
              </tr>
            </thead>
            <tbody>
              {communityInsights.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', fontSize: '0.9rem' }}>
                  <td style={{ padding: '14px 16px', color: '#f8fafc', fontWeight: '700' }}>
                    {row.city}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>
                    {row.topScam}
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', color: '#38bdf8', fontWeight: '700' }}>
                    {row.reports} reports
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className={`badge ${row.severity === 'HIGH' ? 'badge-high' : 'badge-med'}`}>
                      {row.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
