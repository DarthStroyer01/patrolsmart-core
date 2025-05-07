import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import './ProfileSection.css';

export default function ProfileSection() {
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      setEmail(user.email);
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setFirstName(data.firstName || '');
        setLastName(data.lastName || '');
        setDepartment(data.department || '');
        setPhone(data.phone || '');
        // Display name fallback: first initial + last name, or email prefix
        const dn = data.displayName ||
          (data.firstName && data.lastName
            ? `${data.firstName[0]}${data.lastName}`
            : user.email.split('@')[0]);
        setDisplayName(dn);
        setRole(data.role || '');
      }
      setLoading(false);
    }
    fetchProfile();
  }, [db, user]);

  const handleSave = async () => {
    setMessage(null);
    setError(null);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        department,
        phone,
        displayName
      });
      setMessage('✅ Profile updated successfully.');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="profile-section">
      {message && <p className="success-msg">{message}</p>}
      {error   && <p className="error-msg">{error}</p>}

      <div className="field-group">
        <label>First Name</label>
        <input
          type="text"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          required
        />
      </div>

      <div className="field-group">
        <label>Last Name</label>
        <input
          type="text"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          required
        />
      </div>

      <div className="field-group">
        <label>Display Name</label>
        <input
          type="text"
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          required
        />
      </div>

      <div className="field-group">
        <label>Department</label>
        <input
          type="text"
          value={department}
          onChange={e => setDepartment(e.target.value)}
        />
      </div>

      <div className="field-group">
        <label>Phone</label>
        <input
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
      </div>

      <div className="field-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          disabled
        />
      </div>

      <div className="field-group">
        <label>Role</label>
        <input
          type="text"
          value={role}
          disabled
        />
      </div>

      <button onClick={handleSave} className="save-btn">
        Save Changes
      </button>
    </div>
  );
}
