
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import SettingsPage from './pages/settings';

import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// HOD
import HODDashboard from './pages/HOD/HOD_dashboard';
import MeetingRequests from './pages/HOD/Meeting_requests';
import MedicalReview from './pages/HOD/Medical_review';

// Lecturer
import LecturerDashboard from './pages/Lecturer/LecturerDashboard';
import AttendanceManager from './pages/Lecturer/AttendanceManager';
import MeetingManagement from './pages/Lecturer/MeetingManagement';

// Student
import StudentDashboard from './pages/Student/StudentDashboard';
import MeetingScheduler from './pages/Student/MeetingScheduler';
import MedicalHub from './pages/Student/MedicalHub';
import AcademicRecords from './pages/Student/AcademicRecords';

// Administrator
import AdminDashboard from './pages/Administrator/AdminDashboard';
import UserManagement from './pages/Administrator/UserManagement';
import PendingApprovals from './pages/Administrator/PendingApprovals';
import AuditTrail from './pages/Administrator/AuditTrail';
import SystemConfiguration from './pages/Administrator/SysConfig';
import RolesAndPermissions from './pages/Administrator/RoleSettings';

// Dean
import DeanDashboard from './pages/Dean/DeanDashboard';
import DeanMeetingRequests from './pages/Dean/MeetingRequests';

// Medical Officer
import MoDashboard from './pages/MedicalOfficer/MoDashboard';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        {/* =========================================
            GLOBAL ACADEMIC AMBIENT BACKGROUND
            Animated Glows + Dotted Grid
        ========================================= */}

        <div
          className="academic-backdrop"
          aria-hidden="true"
        >
          {/* Primary animated glow */}
          <div className="glow-layer"></div>

          {/* Secondary animated glow */}
          <div className="glow-layer-secondary"></div>

          {/* Moving dotted grid */}
          <div className="grid-layer"></div>
        </div>


        {/* =========================================
            APPLICATION CONTENT
        ========================================= */}

        <div className="relative z-10 min-h-screen">

          <Routes>

            {/* ROOT */}
            <Route
              path="/"
              element={<Navigate to="/Login" replace />}
            />


            {/* AUTH */}
            <Route
              path="/Register"
              element={<Register />}
            />

            <Route
              path="/Login"
              element={<Login />}
            />

            <Route
              path="/forgot-password"
              element={<ForgotPassword />}
            />

            <Route
              path="/reset-password"
              element={<ResetPassword />}
            />


            {/* =====================================
                HOD
            ===================================== */}

            <Route
              path="/hod/dashboard"
              element={
                <ProtectedRoute allowedRoles={['HOD']}>
                  <HODDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/hod/meetings"
              element={
                <ProtectedRoute allowedRoles={['HOD']}>
                  <MeetingRequests />
                </ProtectedRoute>
              }
            />

            <Route
              path="/hod/medical"
              element={
                <ProtectedRoute allowedRoles={['HOD']}>
                  <MedicalReview />
                </ProtectedRoute>
              }
            />


            {/* =====================================
                STUDENT
            ===================================== */}

            <Route
              path="/Student/dashboard"
              element={
                <ProtectedRoute allowedRoles={['Student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/Student/meetings"
              element={
                <ProtectedRoute allowedRoles={['Student']}>
                  <MeetingScheduler />
                </ProtectedRoute>
              }
            />

            <Route
              path="/Student/medical"
              element={
                <ProtectedRoute allowedRoles={['Student']}>
                  <MedicalHub />
                </ProtectedRoute>
              }
            />

            <Route
              path="/Student/academic-records"
              element={
                <ProtectedRoute allowedRoles={['Student']}>
                  <AcademicRecords />
                </ProtectedRoute>
              }
            />


            {/* =====================================
                ADMINISTRATOR
            ===================================== */}

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/pending-approvals"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <PendingApprovals />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/audit-logs"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AuditTrail />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/system-configuration"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <SystemConfiguration />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/Roles-And-Permissions"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <RolesAndPermissions />
                </ProtectedRoute>
              }
            />


            {/* =====================================
                DEAN
            ===================================== */}

            <Route
              path="/dean/dashboard"
              element={
                <ProtectedRoute allowedRoles={['Dean']}>
                  <DeanDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dean/meetings"
              element={
                <ProtectedRoute allowedRoles={['Dean']}>
                  <DeanMeetingRequests />
                </ProtectedRoute>
              }
            />


            {/* =====================================
                MEDICAL OFFICER
            ===================================== */}

            <Route
              path="/medical-officer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['Medical Officer']}>
                  <MoDashboard />
                </ProtectedRoute>
              }
            />


            {/* =====================================
                LECTURER
            ===================================== */}

            <Route
              path="/lecturer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['Lecturer']}>
                  <LecturerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/lecturer/attendance"
              element={
                <ProtectedRoute allowedRoles={['Lecturer']}>
                  <AttendanceManager />
                </ProtectedRoute>
              }
            />

            <Route
              path="/lecturer/meetings"
              element={
                <ProtectedRoute allowedRoles={['Lecturer']}>
                  <MeetingManagement />
                </ProtectedRoute>
              }
            />


            {/* =====================================
                SETTINGS
            ===================================== */}

            <Route
              path="/settings"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    'Student',
                    'Lecturer',
                    'HOD',
                    'Dean',
                    'Admin',
                    'Medical Officer'
                  ]}
                >
                  <SettingsPage />
                </ProtectedRoute>
              }
            />


            {/* =====================================
                UNKNOWN ROUTES
            ===================================== */}

            <Route
              path="*"
              element={<Navigate to="/Login" replace />}
            />

          </Routes>

        </div>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
