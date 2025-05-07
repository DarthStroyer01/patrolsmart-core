// src/pages/AdminCertExpiry.jsx
import React from 'react';
import CertExpiryTable from '../components/AdminCertExpiry/CertExpiryTable';

export default function AdminCertExpiry() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        Certificate Expiry Dashboard
      </h1>
      <CertExpiryTable />
    </div>
  );
}
