import React, { useState, useEffect } from 'react';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';
import './CertificatesSection.css';

export default function CertificatesSection() {
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const user = auth.currentUser;

  const [certs, setCerts] = useState([]);
  const [form, setForm] = useState({
    name: '', issuer: '', date: '', file: null
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch certificates
  useEffect(() => {
    const fetchCerts = async () => {
      if (!user) return;
      const q = query(
        collection(db, 'certificates'),
        where('userId', '==', user.uid)
      );
      const snap = await getDocs(q);
      setCerts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchCerts();
  }, [db, user]);

  // Handle form input
  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: files ? files[0] : value
    }));
  };

  // Upload file and return URL
  const uploadFile = async file => {
    const path = `certificates/${user.uid}/${Date.now()}_${file.name}`;
    const ref = storageRef(storage, path);
    await uploadBytes(ref, file);
    return await getDownloadURL(ref);
  };

  // Add or update certificate
  const handleSubmit = async e => {
    e.preventDefault();
    const { name, issuer, date, file } = form;
    if (!name || !issuer || !date) return;

    let fileUrl = null;
    if (file) {
      fileUrl = await uploadFile(file);
    }

    if (editingId) {
      // Update existing
      const docRef = doc(db, 'certificates', editingId);
      await updateDoc(docRef, {
        name, issuer, date, ...(fileUrl && { fileUrl })
      });
      setCerts(cs =>
        cs.map(c => c.id === editingId ? { ...c, name, issuer, date, fileUrl: fileUrl||c.fileUrl } : c)
      );
    } else {
      // Add new
      const data = { userId: user.uid, name, issuer, date, fileUrl };
      const docRef = await addDoc(collection(db, 'certificates'), data);
      setCerts(cs => [...cs, { id: docRef.id, ...data }]);
    }

    // Reset form
    setForm({ name: '', issuer: '', date: '', file: null });
    setEditingId(null);
  };

  // Populate form for edit
  const startEdit = cert => {
    setForm({
      name: cert.name,
      issuer: cert.issuer,
      date: cert.date,
      file: null
    });
    setEditingId(cert.id);
  };

  // Delete certificate
  const handleDelete = async id => {
    await deleteDoc(doc(db, 'certificates', id));
    setCerts(cs => cs.filter(c => c.id !== id));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="certificates-section">
      <form className="add-certificate-form" onSubmit={handleSubmit}>
        <input
          name="name" type="text" placeholder="Certificate Name"
          value={form.name} onChange={handleChange} required
        />
        <input
          name="issuer" type="text" placeholder="Issuer"
          value={form.issuer} onChange={handleChange} required
        />
        <input
          name="date" type="date"
          value={form.date} onChange={handleChange} required
        />
        <input
          name="file" type="file" accept=".pdf,.jpg,.png"
          onChange={handleChange}
        />
        <button type="submit">
          {editingId ? 'Update Certificate' : 'Add Certificate'}
        </button>
        {editingId && (
          <button
            type="button"
            className="cancel-btn"
            onClick={() => {
              setForm({ name: '', issuer: '', date: '', file: null });
              setEditingId(null);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <table className="certificate-table">
        <thead>
          <tr>
            <th>Name</th><th>Issuer</th><th>Date</th><th>File</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {certs.map(c => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.issuer}</td>
              <td>{c.date}</td>
              <td>
                {c.fileUrl
                  ? <a href={c.fileUrl} target="_blank" rel="noreferrer">View</a>
                  : '—'}
              </td>
              <td>
                <button onClick={() => startEdit(c)}>Edit</button>
                <button onClick={() => handleDelete(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
