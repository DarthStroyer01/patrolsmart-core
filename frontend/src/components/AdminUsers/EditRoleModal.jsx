import React, { useState } from 'react';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

export default function EditRoleModal({ user, onClose }) {
  const [role, setRole] = useState(user.role);
  const db = getFirestore();

  const save = async () => {
    await updateDoc(doc(db, 'users', user.id), { role });
    // Close and refresh to reflect change
    onClose();
    window.location.reload();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Change Role</h2>
        <p>
          <strong>{user.displayName}</strong>
        </p>
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          className="modal-select"
        >
          <option value="guard">Guard</option>
          <option value="orgAdmin">Org Admin</option>
          <option value="superAdmin">Super Admin</option>
        </select>
        <div className="modal-footer">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-action" onClick={save}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
