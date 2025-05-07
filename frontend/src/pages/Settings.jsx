// src/pages/Settings.jsx

import React from 'react';
import ProfileSection from '../components/Settings/ProfileSection';
import PreferencesSection from '../components/Settings/PreferencesSection';
import SecuritySection from '../components/Settings/SecuritySection';
import CertificatesSection from '../components/Settings/CertificatesSection';
import './Settings.css';

export default function Settings() {
  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>

      <section className="settings-section">
        <h2 className="settings-section-title">Profile</h2>
        <ProfileSection />
      </section>

      <section className="settings-section">
        <h2 className="settings-section-title">Preferences</h2>
        <PreferencesSection />
      </section>

      <section className="settings-section">
        <h2 className="settings-section-title">Security</h2>
        <SecuritySection />
      </section>

      <section className="settings-section">
        <h2 className="settings-section-title">Certificates</h2>
        <CertificatesSection />
      </section>
    </div>
  );
}
