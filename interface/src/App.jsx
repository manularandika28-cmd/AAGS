import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import StudentDashboard from './pages/Student/StudentDashboard';
import Login from './pages/Login';
import Demo from './pages/Student/Demo';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Demo />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes for Students */}
          <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
            <Route path="/dashboard" element={<StudentDashboard />} />
          </Route>

          {/* Default Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;