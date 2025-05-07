// src/components/AdminCertExpiry/CertExpiryTable.jsx
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import CertExpiryRow from './CertExpiryRow';

export default function CertExpiryTable() {
  const [rows, setRows] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    (async () => {
      // Fetch all certificates
      const certSnap = await getDocs(collection(db, 'certificates'));
      const allCerts = certSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      // Find those expiring in the next 30 days
      const now = new Date();
      const in30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      const expiring = allCerts
        .filter(c => {
          const exp = new Date(c.date); // if your field is "expirationDate", adjust here
          return exp >= now && exp <= in30;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setRows(expiring);
    })();
  }, [db]);

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: '#f0f0f0' }}>
          <th style={th}>Name</th>
          <th style={th}>Issuer</th>
          <th style={th}>Expires</th>
          <th style={th}>User</th>
          <th style={th}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(cert => (
          <CertExpiryRow key={cert.id} cert={cert} />
        ))}
        {rows.length === 0 && (
          <tr>
            <td colSpan={5} style={{ textAlign: 'center', padding: '1rem' }}>
              No certificates expiring in the next 30 days.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

const th = {
  padding: '0.75rem',
  border: '1px solid #ddd',
  textAlign: 'left'
};
