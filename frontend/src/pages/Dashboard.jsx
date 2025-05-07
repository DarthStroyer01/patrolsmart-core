// src/pages/Dashboard.jsx

import React from 'react';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <span>📊 Dashboard</span>
        <span className="client-badge">Ironclad Security</span> {/* Optional client label */}
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-title">Total Incidents This Week</div>
          <div className="metric-value">42</div>
        </div>
        <div className="metric-card">
          <div className="metric-title">Most Common Type</div>
          <div className="metric-value">Trespassing</div>
        </div>
        <div className="metric-card">
          <div className="metric-title">Active Guards</div>
          <div className="metric-value">8</div>
        </div>
        <div className="metric-card">
          <div className="metric-title">Reports Submitted</div>
          <div className="metric-value">17</div>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <ul className="activity-list">
          <li>[12:14 PM] Guard A submitted a Trespassing report</li>
          <li>[11:03 AM] Guard B flagged a broken lock</li>
          <li>[09:28 AM] Guard C checked in at Main Gate</li>
        </ul>
      </div>
    </div>
  );
}
