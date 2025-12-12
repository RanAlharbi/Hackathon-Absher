import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import VerifyCertificate from './pages/VerifyCertificate';
import ManualReview from './pages/ManualReview';
import SkillGapAnalysis from './pages/SkillGapAnalysis';
import Achievements from './pages/Achievements';
import HRManager from './pages/HRManager';
import { UserRole } from './types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  userRole: UserRole | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles, userRole }) => {
  if (!userRole) {
    return <Navigate to="/" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
  };

  const handleLogout = () => {
    setUserRole(null);
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col font-sans">
        {userRole && <Navbar role={userRole} onLogout={handleLogout} />}
        
        <main className={`flex-grow ${userRole ? 'max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8' : ''}`}>
          <Routes>
            <Route path="/" element={!userRole ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute userRole={userRole}>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute userRole={userRole} allowedRoles={[UserRole.STUDENT]}>
                <Profile />
              </ProtectedRoute>
            } />

            <Route path="/achievements" element={
              <ProtectedRoute userRole={userRole} allowedRoles={[UserRole.STUDENT]}>
                <Achievements />
              </ProtectedRoute>
            } />
            
            <Route path="/skill-gap" element={
              <ProtectedRoute userRole={userRole} allowedRoles={[UserRole.STUDENT]}>
                <SkillGapAnalysis />
              </ProtectedRoute>
            } />
            
            <Route path="/verify" element={
              <ProtectedRoute userRole={userRole}>
                <VerifyCertificate />
              </ProtectedRoute>
            } />
            
            <Route path="/hr-dashboard" element={
              <ProtectedRoute userRole={userRole} allowedRoles={[UserRole.HR]}>
                <HRManager />
              </ProtectedRoute>
            } />

            <Route path="/review" element={
              <ProtectedRoute userRole={userRole} allowedRoles={[UserRole.HR]}>
                <ManualReview />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
