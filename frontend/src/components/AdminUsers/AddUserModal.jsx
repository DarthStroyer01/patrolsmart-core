// src/components/AdminUsers/AddUserModal.jsx

import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import './AddUserModal.css';

export default function AddUserModal({ onClose, onUserAdded }) {
  const auth = getAuth();
  const db   = getFirestore();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [role,     setRole]     = useState('guard');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCred.user.uid), {
        email,
        role,
        active: true
      });
      Swal.fire('Success','User created','success');
      onUserAdded();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <form className="modal-content" onSubmit={handleAdd}>
        <h2>Add New User</h2>
        {error && <p className="error">{error}</p>}
        <label>Email</label>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
        <label>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
        <label>Role</label>
        <select value={role} onChange={e=>setRole(e.target.value)}>
          <option value="guard">Guard</option>
          <option value="admin">Admin</option>
          <option value="superAdmin">Super Admin</option>
        </select>
        <div className="modal-footer">
          <button type="button" className="btn" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-action" disabled={loading}>
            {loading ? 'Adding…' : 'Add User'}
          </button>
        </div>
      </form>
    </div>
  );
}
