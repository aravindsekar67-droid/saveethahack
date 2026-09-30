import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Key, User, ShieldCheck, AlertCircle, CheckCircle2, UserPlus, LogIn } from 'lucide-react';
import { api } from '../services/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  
  // Login form state (no hardcoded defaults)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register form state
  const [name, setName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [adminStatus, setAdminStatus] = useState(null);

  useEffect(() => {
    // Check if any admin already exists
    api.getAdminStatus().then(status => {
      setAdminStatus(status);
      if (status && !status.hasAdmin) {
        // If no admin exists yet, default to Create Admin Account mode
        setMode('register');
      }
    }).catch(() => {
      // Ignored
    });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await api.adminLogin({ email: email.trim(), password });
      if (res.authenticated && res.token) {
        localStorage.setItem('shieldpay_admin_token', res.token);
        localStorage.setItem('shieldpay_admin_user', JSON.stringify({ email: res.email, name: res.name || 'Administrator' }));
        navigate('/admin/dashboard');
      } else {
        setError('Invalid administrative credentials. If you haven\'t created an admin yet, please use "Create Admin Account".');
      }
    } catch (err) {
      setError(err.message || 'Authentication error. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (regPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.registerAdmin({
        name: name.trim(),
        email: regEmail.trim(),
        password: regPassword,
      });

      if (res.authenticated && res.token) {
        localStorage.setItem('shieldpay_admin_token', res.token);
        localStorage.setItem('shieldpay_admin_user', JSON.stringify({ email: res.email, name: res.name }));
        setSuccessMsg('Admin account created successfully! Redirecting to intelligence portal...');
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 900);
      } else {
        setSuccessMsg('Admin registered! You can now log in.');
        setEmail(regEmail.trim());
        setMode('login');
      }
    } catch (err) {
      setError(err.message || 'Failed to create admin account. The email may already be registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '3rem auto', padding: '1rem 1.5rem 5rem' }}>
      <div className="glass-panel" style={{ padding: '2.5rem 2rem', position: 'relative' }}>
        
        {/* Portal Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #00f2fe, #a855f7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 0 25px rgba(0, 242, 254, 0.3)',
          }}>
            <Lock size={28} color="#060913" strokeWidth={2.5} />
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#f8fafc', marginBottom: '0.4rem' }}>
            Admin Intelligence Portal
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Direct access to payment scam telemetry, pattern analytics, and system signals
          </p>
        </div>

        {/* Informational Policy Banner */}
        <div style={{
          padding: '10px 14px',
          borderRadius: '10px',
          background: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          marginBottom: '1.5rem',
          fontSize: '0.8rem',
          color: '#38bdf8',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <ShieldCheck size={18} style={{ flexShrink: 0 }} />
          <span>
            <strong>Zero Default Credential Policy:</strong> Administrative accounts are created and managed by authorized operators. No pre-set credentials exist.
          </span>
        </div>

        {/* Mode Selector Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '4px',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
            style={{
              padding: '10px 0',
              borderRadius: '8px',
              border: 'none',
              background: mode === 'login' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              color: mode === 'login' ? '#38bdf8' : '#94a3b8',
              fontWeight: mode === 'login' ? '700' : '500',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <LogIn size={15} />
            Sign In
          </button>
          
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); }}
            style={{
              padding: '10px 0',
              borderRadius: '8px',
              border: 'none',
              background: mode === 'register' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              color: mode === 'register' ? '#38bdf8' : '#94a3b8',
              fontWeight: mode === 'register' ? '700' : '500',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <UserPlus size={15} />
            Create Admin
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '8px',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            color: '#fb7185',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Success message */}
        {successMsg && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '8px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34d399',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* SIGN IN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label" htmlFor="admin-email">Administrative Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#64748b" style={{ position: 'absolute', top: '14px', left: '14px' }} />
                <input
                  id="admin-email"
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="admin-password">Password</label>
              <div style={{ position: 'relative' }}>
                <Key size={18} color="#64748b" style={{ position: 'absolute', top: '14px', left: '14px' }} />
                <input
                  id="admin-password"
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '0.5rem' }}
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>
        ) : (
          /* CREATE ADMIN ACCOUNT FORM */
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label" htmlFor="admin-name">Full Name / Operator Title</label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="#64748b" style={{ position: 'absolute', top: '14px', left: '14px' }} />
                <input
                  id="admin-name"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  placeholder="e.g. Security Lead"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Administrative Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#64748b" style={{ position: 'absolute', top: '14px', left: '14px' }} />
                <input
                  id="reg-email"
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  placeholder="admin@yourcompany.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password (min 6 characters)</label>
              <div style={{ position: 'relative' }}>
                <Key size={18} color="#64748b" style={{ position: 'absolute', top: '14px', left: '14px' }} />
                <input
                  id="reg-password"
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  placeholder="Create secure password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm-password">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Key size={18} color="#64748b" style={{ position: 'absolute', top: '14px', left: '14px' }} />
                <input
                  id="reg-confirm-password"
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  placeholder="Repeat secure password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !name || !regEmail || !regPassword || !confirmPassword}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '0.5rem' }}
            >
              {loading ? 'Registering Admin...' : 'Create Admin Account & Launch'}
            </button>
          </form>
        )}

        {/* Footer switch prompt */}
        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          textAlign: 'center',
          fontSize: '0.82rem',
          color: '#94a3b8'
        }}>
          {mode === 'login' ? (
            <span>
              Don't have an admin account yet?{' '}
              <button
                type="button"
                onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); }}
                style={{ background: 'none', border: 'none', color: '#38bdf8', fontWeight: '700', cursor: 'pointer', padding: 0 }}
              >
                Create one now
              </button>
            </span>
          ) : (
            <span>
              Already registered an admin account?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
                style={{ background: 'none', border: 'none', color: '#38bdf8', fontWeight: '700', cursor: 'pointer', padding: 0 }}
              >
                Sign In
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
