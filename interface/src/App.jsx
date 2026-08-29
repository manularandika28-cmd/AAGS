import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import backgroundVideo from './Assets/BackgroundVideo.mp4';

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
import AuditTrail from './pages/Administrator/AuditTrail';
import SystemConfiguration from './pages/Administrator/SysConfig';
import RolesAndPermissions from './pages/Administrator/RoleSettings';

function App() {
  return (
    <BrowserRouter>
      {/* =========================================
          GLOBAL BACKGROUND VIDEO
      ========================================= */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>

        {/* Dark/white overlay - adjust opacity if needed */}
        <div className="absolute inset-0 bg-white/10" />
      </div>

      {/* =========================================
          APPLICATION CONTENT
      ========================================= */}
      <div className="relative z-10 min-h-screen">
        <Routes>
          {/* =====================================
              HOD ROUTES
          ===================================== */}
          <Route
            path="/hod/dashboard"
            element={<HODDashboard />}
          />
          <Route
            path="/hod/meetings"
            element={<MeetingRequests />}
          />
          <Route
            path="/hod/medical"
            element={<MedicalReview />}
          />

          {/* =====================================
              LECTURER ROUTES
          ===================================== */}
          <Route
            path="/lecturer/dashboard"
            element={<LecturerDashboard />}
          />
          <Route
            path="/lecturer/attendance"
            element={<AttendanceManager />}
          />
          <Route
            path="/lecturer/meetings"
            element={<MeetingManagement />}
          />

          {/* =====================================
              STUDENT ROUTES
          ===================================== */}
          <Route
            path="/Student/dashboard"
            element={<StudentDashboard />}
          />
          <Route
            path="/Student/meetings"
            element={<MeetingScheduler />}
          />
          <Route
            path="/Student/medical"
            element={<MedicalHub />}
          />
          <Route
            path="/Student/academic-records"
            element={<AcademicRecords />}
          />

          {/* =====================================
              ADMIN ROUTES
          ===================================== */}
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />
          <Route
            path="/admin/users"
            element={<UserManagement />}
          />
          <Route
            path="/admin/audit-logs"
            element={<AuditTrail />}
          />
          <Route
            path="/admin/system-configuration"
            element={<SystemConfiguration />}
          />
          <Route
            path="/admin/Roles-And-Permissions"
            element={<RolesAndPermissions />}
          />

          {/* =====================================
              DEFAULT ROUTE
          ===================================== */}
          <Route
            path="*"
            element={<Navigate to="/Student/dashboard" replace />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;