// src/components/AdminCertExpiry/ReminderModal.jsx
import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
// (You’ll integrate your email/SMS API here)
export default function ReminderModal({ cert, user, onClose }) {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);

  const sendReminder = async () => {
    setSending(true);
    try {
      // TODO: call cloud function or third-party API
      // sendReminderEmailOrSMS(user.email, cert);
      setStatus('Reminder sent!');
    } catch (e) {
      setStatus(`Error: ${e.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2>Send Reminder</h2>
        <p>
          {user.displayName}’s <strong>{cert.name}</strong> expires on{' '}
          {new Date(cert.date).toLocaleDateString()}.
        </p>
        {status && <p>{status}</p>}
        <div style={{ marginTop: '1rem', textAlign: 'right' }}>
          <button onClick={onClose} style={modalBtn}>Cancel</button>
          <button onClick={sendReminder} disabled={sending} style={modalBtnPrimary}>
            {sending ? 'Sending…' : 'Send Reminder'}
          </button>
        </div>
      </div>
    </div>
  );
}

const overlay = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.3)', display: 'flex',
  alignItems: 'center', justifyContent: 'center'
};

const modal = {
  background: '#fff', padding: '2rem', borderRadius: '8px', maxWidth: '400px', width: '100%'
};

const modalBtn = {
  padding: '0.5rem 1rem', marginRight: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', background: '#f9fafb'
};

const modalBtnPrimary = {
  ...modalBtn, background: '#2563eb', color: '#fff', border: 'none'
};
