// src/pages/AdminUsers.jsx

import React, { useState } from 'react';
import UserTable from '../components/AdminUsers/UserTable';
import AddUserModal from '../components/AdminUsers/AddUserModal';
import '../components/AdminUsers/AdminUsers.css';

export default function AdminUsers() {
  const [showAdd, setShowAdd] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const triggerRefresh = () => setRefresh(r => r + 1);

  return (
    <div className="admin-users-container">
      <div className="admin-users-header">
        <h1>User Management</h1>
        <button className="btn btn-action" onClick={()=>setShowAdd(true)}>
          + Add User
        </button>
      </div>

      <UserTable key={refresh} />

      {showAdd && (
        <AddUserModal
          onClose={()=>setShowAdd(false)}
          onUserAdded={triggerRefresh}
        />
      )}
    </div>
  );
}
