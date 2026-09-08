import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DemoSwitcher } from './components/DemoSwitcher';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { TherapistDashboard } from './pages/TherapistDashboard';
import { ReceptionistDashboard } from './pages/ReceptionistDashboard';
import { ParentDashboard } from './pages/ParentDashboard';
import { TeacherDashboard } from './pages/TeacherDashboard';

export const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
          {/* Route Outlet */}
          <div className="flex-1 flex flex-col">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Administrator Protected Routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={['Administrator']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Therapist Protected Routes */}
              <Route
                path="/therapist/*"
                element={
                  <ProtectedRoute allowedRoles={['Therapist', 'Administrator']}>
                    <TherapistDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Receptionist Protected Routes */}
              <Route
                path="/receptionist/*"
                element={
                  <ProtectedRoute allowedRoles={['Receptionist', 'Administrator']}>
                    <ReceptionistDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Parent / Caregiver Protected Routes */}
              <Route
                path="/parent/*"
                element={
                  <ProtectedRoute allowedRoles={['Parent / Caregiver', 'Administrator']}>
                    <ParentDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Teacher Protected Routes */}
              <Route
                path="/teacher/*"
                element={
                  <ProtectedRoute allowedRoles={['Teacher', 'Administrator']}>
                    <TeacherDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
