import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import LandingPage from './pages/LandingPage';
import PaymentScanner from './pages/PaymentScanner';
import RiskResult from './pages/RiskResult';
import ConversationAnalyzer from './pages/ConversationAnalyzer';
import UrlAnalyzerPage from './pages/UrlAnalyzerPage';
import QrAnalyzerPage from './pages/QrAnalyzerPage';
import ScamSpotterGame from './pages/ScamSpotterGame';
import ScanHistory from './pages/ScanHistory';
import SafetyCenter from './pages/SafetyCenter';
import AlreadyPaidPage from './pages/AlreadyPaidPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AboutPage from './pages/AboutPage';

export default function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/scan" element={<PaymentScanner />} />
            <Route path="/result" element={<RiskResult />} />
            <Route path="/conversation" element={<ConversationAnalyzer />} />
            <Route path="/url-analyzer" element={<UrlAnalyzerPage />} />
            <Route path="/qr-analyzer" element={<QrAnalyzerPage />} />
            <Route path="/game" element={<ScamSpotterGame />} />
            <Route path="/history" element={<ScanHistory />} />
            <Route path="/safety" element={<SafetyCenter />} />
            <Route path="/already-paid" element={<AlreadyPaidPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/about" element={<AboutPage />} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
