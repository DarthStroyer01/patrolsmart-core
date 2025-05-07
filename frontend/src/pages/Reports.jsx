// src/pages/Reports.jsx

import React from 'react';

export default function Reports() {
  return (
    <div className="reports-page">
      <h2>📁 Reports</h2>
      <p>This page will allow users to generate, filter, and export incident reports.</p>

      <ul>
        <li>📝 Export to PDF or CSV</li>
        <li>📆 Filter by date range</li>
        <li>🔍 Filter by incident type or user</li>
        <li>📊 Monthly activity summaries</li>
      </ul>
    </div>
  );
}
