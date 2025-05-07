import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import L from 'leaflet';

// Fix for missing default icon
import 'leaflet/dist/leaflet.css';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default function IncidentMap() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'incidents'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setIncidents(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <MapContainer center={[47.6062, -122.3321]} zoom={12} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {incidents.map(incident => (
        incident.location?.lat && incident.location?.lng && (
          <Marker
            key={incident.id}
            position={[incident.location.lat, incident.location.lng]}>
            <Popup>
              <strong>{incident.type}</strong><br />
              {incident.description}<br />
              {incident.email}<br />
              {new Date(incident.timestamp?.seconds * 1000).toLocaleString()}
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
}
