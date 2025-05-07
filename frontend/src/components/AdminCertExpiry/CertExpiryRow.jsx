// src/components/AdminCertExpiry/CertExpiryRow.jsx
import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import ReminderModal from './ReminderModal';

export default function CertExpiryRow({ cert }) {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const db = getFirestore();

  // Fetch user info
  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, 'users', cert.userId));
      if (snap.exists()) setUser(snap.data());
    })();
  }, [db, cert.userId]);

  return (
    <>
      <tr>
        <td style={td}>{cert.name}</td>
        <td style={td}>{cert.issuer}</td>
        <td style={td}>{new Date(cert.date).toLocaleDateString()}</td>
        <td style={td}>{user ? user.displayName : 'Loading…'}</td>
        <td style={td}>
          <button onClick={() => setShowModal(true)} style={btn}>
            Send Reminder
          </button>
        </td>
      </tr>
      {showModal && (
        <ReminderModal
          cert={cert}
          user={user}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

const td = {
  padding: '0.75rem',
  border: '1px solid #ddd'
};

const btn = {
  padding: '0.5rem 1rem',
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};
