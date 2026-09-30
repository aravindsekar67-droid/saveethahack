import React from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertOctagon, 
  PhoneCall, 
  FileText, 
  Camera, 
  Ban, 
  ShieldCheck, 
  ArrowLeft,
  ExternalLink,
  Info
} from 'lucide-react';

export default function AlreadyPaidPage() {
  const steps = [
    {
      num: '1',
      title: 'Contact your bank or payment provider immediately',
      desc: 'Use the official phone number printed on the back of your physical debit/credit card or within your bank mobile application. Request your bank to flag the transaction, freeze the receiver account if possible, and initiate a recall request.',
      icon: PhoneCall,
      color: '#f43f5e',
    },
    {
      num: '2',
      title: 'Report through official cyber fraud mechanisms',
      desc: 'Lodge an official report with your national or regional cyber crime portal (such as cybercrime.gov.in / 1930 in India, or your local law enforcement cyber division). Official reporting provides legal tracking and bank coordinate freezes.',
      icon: FileText,
      color: '#38bdf8',
    },
    {
      num: '3',
      title: 'Preserve all transaction details and evidence',
      desc: 'Take complete, uncropped screenshots of the messages, phone numbers, UPI reference numbers (UTR), QR codes, payment receipts, and conversation history. Do not delete chats, as they form critical forensic evidence.',
      icon: Camera,
      color: '#f59e0b',
    },
    {
      num: '4',
      title: 'Do NOT send additional money to anyone promising recovery',
      desc: 'Beware of secondary "fund recovery agents" or cyber detectives online who claim they can hack back or refund your lost money for an advance fee. These are almost always secondary scams exploiting vulnerable victims.',
      icon: Ban,
      color: '#a855f7',
    },
  ];

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
      <Link to="/safety" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#38bdf8', textDecoration: 'none', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
        <ArrowLeft size={16} /> Back to Safety Center
      </Link>

      <div style={{
        background: 'rgba(244, 63, 94, 0.15)',
        border: '1px solid rgba(244, 63, 94, 0.45)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        flexWrap: 'wrap',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: '#f43f5e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          flexShrink: 0,
          boxShadow: '0 0 25px rgba(244, 63, 94, 0.5)',
        }}>
          <AlertOctagon size={36} />
        </div>

        <div style={{ flex: 1 }}>
          <span className="badge badge-high" style={{ marginBottom: '6px' }}>
            EMERGENCY INCIDENT PROTOCOL
          </span>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '900', color: '#ffffff', marginBottom: '4px' }}>
            Already Sent the Money?
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
            Time is critical. Follow these four mandatory actions to prevent further financial damage and log formal trace requests.
          </p>
        </div>
      </div>

      {/* 4 Protocol Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {steps.map((st) => {
          const Icon = st.icon;
          return (
            <div
              key={st.num}
              className="glass-panel"
              style={{
                padding: '1.75rem',
                borderLeft: `5px solid ${st.color}`,
                display: 'flex',
                gap: '1.25rem',
                alignItems: 'flex-start',
              }}
            >
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${st.color}`,
                color: st.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={22} />
              </div>

              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#f8fafc', marginBottom: '0.4rem' }}>
                  {st.num}. {st.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                  {st.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Important disclaimer */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.6)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '1.25rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        fontSize: '0.8rem',
        color: '#94a3b8',
      }}>
        <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
        <span>
          <strong>Emergency Reference Guidance:</strong> ShieldPay AI does not provide direct financial recovery services or dialers. Always obtain contact credentials from your authorized physical cards or verified banking branches.
        </span>
      </div>
    </div>
  );
}
