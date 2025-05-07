// src/components/AdminUsers/UserRow.jsx

import React from 'react';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import Swal from 'sweetalert2';

export default function UserRow({ user }) {
  const db = getFirestore();
  const functions = getFunctions();
  const deleteUserFn = httpsCallable(functions, 'deleteUser');

  const handleDelete = async () => {
    const { isConfirmed } = await Swal.fire({
      title: 'Delete user?',
      text: `Remove ${user.displayName} permanently?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
    });
    if (!isConfirmed) return;

    try {
      // 1) Delete from Auth via Cloud Function
      await deleteUserFn({ uid: user.id });
      // 2) Delete Firestore doc
      await deleteDoc(doc(db, 'users', user.id));
      Swal.fire('Deleted!', '', 'success').then(() => {
        window.location.reload();
      });
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  return (
    <tr>
      <td>{user.displayName}</td>
      <td>{user.email}</td>
      {/* …other columns… */}
      <td>
        {/* existing role/edit and activate toggles */}
        <button onClick={handleDelete} className="btn btn-delete">
          Delete
        </button>
      </td>
    </tr>
  );
}
