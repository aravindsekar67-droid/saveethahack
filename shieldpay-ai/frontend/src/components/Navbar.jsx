import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, ShieldAlert, Activity, GitFork, Link2, QrCode, Gamepad2, History, HelpCircle, Lock, Menu, X, UserCheck } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const raw = localStorage.getItem('shieldpay_admin_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Keep admin user updated on route change
  useEffect(() => {
    try {
      const raw = localStorage.getItem('shieldpay_admin_user');
      setAdminUser(raw ? JSON.parse(raw) : null);
    } catch {}
  }, [location]);

  const navLinks = [
    { name: 'Scanner', path: '/scan', icon: ShieldAlert },
    { name: 'Link Check', path: '/url-analyzer', icon: Link2 },
    { name: 'QR Check', path: '/qr-analyzer', icon: QrCode },
    { name: 'Spotter Game', path: '/game', icon: Gamepad2 },
    { name: 'History', path: '/history', icon: History },
    { name: 'Safety Center', path: '/safety', icon: HelpCircle },
    { name: 'Admin', path: '/admin/dashboard', icon: Lock },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'rgba(6, 9, 19, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(56, 189, 248, 0.12)',
      padding: '0 1.5rem',
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      {/* Brand Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #f43f5e, #ff0055, #7928ca)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(244, 63, 94, 0.4)',
        }}>
          <Shield size={24} color="#ffffff" strokeWidth={2.5} />
        </div>
        <div>
          <span style={{ fontSize: '1.3rem', fontWeight: '900', letterSpacing: '0.04em', color: '#f8fafc' }}>
            DOOM<span style={{ color: '#f43f5e' }}>SDAY</span>
          </span>
          <span style={{
            marginLeft: '6px',
            padding: '2px 6px',
            borderRadius: '4px',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fb7185',
            fontSize: '0.65rem',
            fontWeight: '800',
            verticalAlign: 'middle',
            letterSpacing: '0.05em',
          }}>
            AI
          </span>
        </div>
      </Link>

      {/* Desktop Links */}
      <div style={{ display: 'none', alignItems: 'center', gap: '6px' }} className="desktop-nav">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: active ? '700' : '500',
                textDecoration: 'none',
                color: active ? '#38bdf8' : '#94a3b8',
                backgroundColor: active ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                border: active ? '1px solid rgba(56, 189, 248, 0.25)' : '1px solid transparent',
                transition: 'all 0.2s ease',
              }}
            >
              <Icon size={16} />
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* Right Action & Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          display: 'none',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '9999px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          color: '#10b981',
          fontSize: '0.75rem',
          fontWeight: '600'
        }} className="privacy-badge-container">
          <Shield size={14} />
          <span>Privacy First Mode</span>
        </div>

        {adminUser && (
          <Link
            to="/admin/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.18), rgba(0, 242, 254, 0.15))',
              border: '1px solid rgba(168, 85, 247, 0.45)',
              color: '#f8fafc',
              fontSize: '0.8rem',
              fontWeight: '700',
              textDecoration: 'none',
              boxShadow: '0 0 15px rgba(168, 85, 247, 0.2)',
            }}
            title={`Logged in as Admin: ${adminUser.name} (${adminUser.email})`}
          >
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00f2fe, #a855f7)',
              color: '#060913',
              fontSize: '0.72rem',
              fontWeight: '900',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {adminUser.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <span>Admin: <strong style={{ color: '#00f2fe' }}>{adminUser.name}</strong></span>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#10b981',
              display: 'inline-block',
              boxShadow: '0 0 8px #10b981',
            }} />
          </Link>
        )}

        <Link to="/scan" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          Check a Payment
        </Link>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#f8fafc',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="mobile-menu-btn"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '70px',
          left: 0,
          right: 0,
          backgroundColor: '#0b1120',
          borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 40,
        }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  color: active ? '#38bdf8' : '#cbd5e1',
                  backgroundColor: active ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                  textDecoration: 'none',
                }}
              >
                <Icon size={18} />
                {link.name}
              </Link>
            );
          })}
        </div>
      )}

      <style>{`
        @media (min-width: 992px) {
          .desktop-nav { display: flex !important; }
          .privacy-badge-container { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
