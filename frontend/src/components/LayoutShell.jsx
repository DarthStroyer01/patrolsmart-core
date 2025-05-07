import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Logo from '../logo.svg';          // your PatrolSmart logo
import './LayoutShell.css';

export default function LayoutShell({ role }) {
  return (
    <div className="layout-shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={Logo} alt="PatrolSmart" className="sidebar-logo" />
        </div>
        <nav>
          <ul>
            <li><NavLink to="/submit">Submit Incident</NavLink></li>
            <li><NavLink to="/dashboard">Dashboard</NavLink></li>
            <li><NavLink to="/map">Map View</NavLink></li>
            <li><NavLink to="/reports">Reports</NavLink></li>
            <li><NavLink to="/settings">Settings</NavLink></li>
            {(role === 'admin' || role === 'superAdmin') && (
              <li><NavLink to="/admin/users">User Management</NavLink></li>
            )}
          </ul>
        </nav>
      </aside>
      <main className="content-area">
        <Outlet />
      </main>
    </div>
  );
}
