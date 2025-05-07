import React, { useState, useEffect } from 'react';
import { getAuth }  from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import './PreferencesSection.css';

export default function PreferencesSection() {
  const auth = getAuth();
  const db   = getFirestore();
  const user = auth.currentUser;

  const [theme,       setTheme]     = useState('light');
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [notifySMS,   setNotifySMS]   = useState(false);
  const [language,    setLanguage]    = useState('en');
  const [loading,     setLoading]     = useState(true);
  const [message,     setMessage]     = useState(null);
  const [error,       setError]       = useState(null);

  // 1️⃣ load saved prefs
  useEffect(() => {
    (async () => {
      if (!user) return;
      const snap = await getDoc(doc(db, 'users', user.uid));
      const p    = snap.exists() ? snap.data().preferences || {} : {};
      setTheme(p.theme || 'light');
      setNotifyEmail(p.notifications?.email || false);
      setNotifySMS(p.notifications?.sms   || false);
      setLanguage(p.language              || 'en');
      setLoading(false);
    })();
  }, [db, user]);

  // 2️⃣ apply theme to <body>
  useEffect(() => {
    if (!loading) {
      document.body.classList.toggle('dark-mode', theme === 'dark');
    }
  }, [theme, loading]);

  // 3️⃣ save back to Firestore
  const handleSave = async () => {
    setMessage(null);
    setError(null);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        preferences: {
          theme,
          notifications: { email: notifyEmail, sms: notifySMS },
          language
        }
      });
      setMessage('✅ Preferences saved.');
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) return <p>Loading preferences…</p>;

  return (
    <div className="preferences-section">
      {message && <div className="alert success">{message}</div>}
      {error   && <div className="alert error">{error}</div>}

      <div className="field-group">
        <label>Theme</label>
        <div className="theme-options">
          <label>
            <input
              type="radio"
              name="theme"
              value="light"
              checked={theme === 'light'}
              onChange={() => setTheme('light')}
            />
            Light
          </label>
          <label>
            <input
              type="radio"
              name="theme"
              value="dark"
              checked={theme === 'dark'}
              onChange={() => setTheme('dark')}
            />
            Dark
          </label>
        </div>
      </div>

      <div className="field-group">
        <label>Notifications</label>
        <div className="notifications-group">
          <label>
            <input
              type="checkbox"
              checked={notifyEmail}
              onChange={() => setNotifyEmail(!notifyEmail)}
            />
            Email
          </label>
          <label>
            <input
              type="checkbox"
              checked={notifySMS}
              onChange={() => setNotifySMS(!notifySMS)}
            />
            SMS
          </label>
        </div>
      </div>

      <div className="field-group">
        <label>Language</label>
        <select
          value={language}
          onChange={e => setLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
        </select>
      </div>

      <button className="save-btn" onClick={handleSave}>
        Save Preferences
      </button>
    </div>
  );
}
