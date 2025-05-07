// src/pages/MapView.jsx

import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapView() {
  return (
    <div className="map-view-container">
      <h2>🗺️ Live Incident Map</h2>
      <p>This page will display real-time incident pins and guard locations.</p>

      <MapContainer
        center={[37.0902, -95.7129]} // Center of USA
        zoom={4}
        style={{ height: '500px', width: '100%', marginTop: '1rem' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
    </div>
  );
}
