// Advanced Survey123-style Incident Form for PatrolSmart
// Cascading dropdowns, conditional vehicle fields, and mobile-ready layout

import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './IncidentForm.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
});

function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.setView([lat, lng], 17);
  }, [lat, lng]);
  return null;
}

const INCIDENT_TYPES = {
  'Suspicious Activity': ['Loitering', 'Vehicle Circling', 'Unusual Behavior'],
  'Property Damage': ['Broken Window', 'Graffiti', 'Vandalism'],
  'Theft': ['Vehicle Theft', 'Personal Property', 'Burglary'],
  'Trespass': ['Fence Jumping', 'Unauthorized Entry'],
  'Disturbance': ['Loud Noise', 'Verbal Altercation', 'Physical Altercation'],
  'Other': ['N/A']
};

export default function IncidentForm({ user }) {
  const [category, setCategory] = useState('Suspicious Activity');
  const [subtype, setSubtype] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [vehicleInvolved, setVehicleInvolved] = useState(false);
  const [licensePlate, setLicensePlate] = useState('');
  const [vehicleDetails, setVehicleDetails] = useState('');

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    setStatus("📡 Fetching location...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus("✅ Location acquired");
      },
      (err) => setStatus("⚠️ Location error: " + err.message),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus('');

    if (!location.lat || !location.lng) {
      setStatus("⚠️ Cannot submit without GPS coordinates. Please refresh location.");
      setSubmitting(false);
      return;
    }

    try {
      await addDoc(collection(db, 'incidents'), {
        category,
        subtype,
        description,
        location,
        timestamp: serverTimestamp(),
        userId: user.uid,
        email: user.email,
        vehicleInvolved,
        licensePlate: vehicleInvolved ? licensePlate : null,
        vehicleDetails: vehicleInvolved ? vehicleDetails : null
      });

      setCategory('Suspicious Activity');
      setSubtype('');
      setDescription('');
      setVehicleInvolved(false);
      setLicensePlate('');
      setVehicleDetails('');
      setStatus('✅ Incident submitted.');
    } catch (err) {
      console.error(err);
      setStatus('❌ ' + err.message);
    }

    setSubmitting(false);
  };

  return (
    <div className="incident-form-container">
      <h2>Incident Report</h2>
      {status && <p className="status-msg">{status}</p>}

      <form onSubmit={handleSubmit} className="incident-form">
        <div>
          <label>Incident Category</label>
          <select value={category} onChange={(e) => {
            setCategory(e.target.value);
            setSubtype('');
          }}>
            {Object.keys(INCIDENT_TYPES).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Incident Subtype</label>
          <select value={subtype} onChange={(e) => setSubtype(e.target.value)} required>
            <option value="">-- Select --</option>
            {INCIDENT_TYPES[category].map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        {category === 'Theft' && (
          <div>
            <label>
              <input
                type="checkbox"
                checked={vehicleInvolved}
                onChange={(e) => setVehicleInvolved(e.target.checked)}
              />{' '}
              Vehicle involved?
            </label>

            {vehicleInvolved && (
              <>
                <div>
                  <label>License Plate</label>
                  <input
                    type="text"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                  />
                </div>

                <div>
                  <label>Vehicle Make/Model</label>
                  <input
                    type="text"
                    value={vehicleDetails}
                    onChange={(e) => setVehicleDetails(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        )}

        <div className="map-container">
          <label>Location Preview</label>
          {location.lat && location.lng ? (
            <MapContainer
              center={[location.lat, location.lng]}
              zoom={17}
              style={{ height: '300px', width: '100%' }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[location.lat, location.lng]} />
              <RecenterMap lat={location.lat} lng={location.lng} />
            </MapContainer>
          ) : (
            <p>📍 Getting location...</p>
          )}
        </div>

        <button type="button" onClick={getLocation} className="gps-refresh">
          🔄 Refresh GPS
        </button>

        <button type="submit" disabled={submitting || !location.lat || !location.lng}>
          {submitting ? 'Submitting...' : 'Submit Incident'}
        </button>
      </form>
    </div>
  );
}
