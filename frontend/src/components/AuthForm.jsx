// src/components/AuthForm.jsx

import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import './AuthForm.css';

export default function AuthForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const auth = getAuth();
  const db = getFirestore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCred.user.uid));
      const userRole = userDoc.exists() ? userDoc.data().role : 'admin';
      onLogin(userCred.user, userRole);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCred.user.uid), {
        email: email,
        role: role
      });
      onLogin(userCred.user, role);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordReset = async () => {
    setError(null);
    setMessage(null);

    if (!email) {
      setError('Please enter your email above first.');
      return;
    }

    const result = await Swal.fire({
      title: 'Reset Password?',
      text: `Send password reset email to ${email}?`,
      icon: 'question',
      background: '#ffffff',
      color: '#1f2937',
      confirmButtonColor: '#1d4ed8',
      cancelButtonColor: '#6b7280',
      showCancelButton: true,
      confirmButtonText: 'Send Email',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await sendPasswordResetEmail(auth, email);
        setMessage('✅ Password reset email sent. Check your inbox.');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-logo">
          <img src="/logo192.png" alt="PatrolSmart Logo" style={{ width: '60px', marginBottom: '1rem' }} />
          <h1 style={{ margin: 0, fontSize: '1.75rem', color: '#1d4ed8' }}>PatrolSmart</h1>
        </div>

        <h2>{isRegister ? 'Register' : 'Log In'}</h2>
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        <form onSubmit={isRegister ? handleRegister : handleLogin}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          {isRegister && (
            <>
              <label>Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="admin">Admin</option>
                <option value="guard">Guard</option>
                <option value="client">Client</option>
              </select>
            </>
          )}

          <button type="submit">{isRegister ? 'Register' : 'Log In'}</button>
        </form>

        {!isRegister && (
          <div className="toggle-auth">
            <button onClick={handlePasswordReset} style={{ marginTop: '1rem', background: 'none', border: 'none', color: '#1d4ed8', fontWeight: 'bold', cursor: 'pointer' }}>
              Forgot Password?
            </button>
          </div>
        )}

        <div className="toggle-auth">
          {isRegister ? (
            <span>Have an account? <button onClick={() => setIsRegister(false)}>Log in</button></span>
          ) : (
            <span>New here? <button onClick={() => setIsRegister(true)}>Register</button></span>
          )}
        </div>
      </div>
    </div>
  );
}
