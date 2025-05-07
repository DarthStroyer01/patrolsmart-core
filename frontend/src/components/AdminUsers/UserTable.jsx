// src/components/AdminUsers/UserTable.jsx

import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import UserRow from './UserRow';

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db, 'users'));
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    })();
  }, []);

  return (
    <table className="admin-table">
      {/* …thead… */}
      <tbody>
        {users.map(u => (
          <UserRow key={u.id} user={u} />
        ))}
      </tbody>
    </table>
  );
}
