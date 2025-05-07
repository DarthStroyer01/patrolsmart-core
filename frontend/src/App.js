import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import LayoutShell from './components/LayoutShell';
import IncidentForm from './components/IncidentForm';
import Dashboard from './pages/Dashboard';
import MapView from './pages/MapView';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import AdminUsers from './pages/AdminUsers';

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  const handleLogin = (userObj, userRole) => {
    setUser(userObj);
    setRole(userRole);
  };

  if (!user) return <AuthForm onLogin={handleLogin} />;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LayoutShell role={role} />}>
          <Route index element={<Navigate to="/submit" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="submit"    element={<IncidentForm user={user} />} />
          <Route path="map"       element={<MapView />} />
          <Route path="reports"   element={<Reports />} />
          <Route path="settings"  element={<Settings />} />

          {/* show for both admin and superAdmin */}
          {(role === 'admin' || role === 'superAdmin') && (
            <Route path="admin/users" element={<AdminUsers />} />
          )}

          <Route path="*" element={<Navigate to="/submit" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
