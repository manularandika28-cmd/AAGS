import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Updated paths to include pages/HOD/
import HODDashboard from './pages/HOD/HOD_dashboard';
import MeetingRequests from './pages/HOD/Meeting_requests';
import MedicalReview from './pages/HOD/Medical_review';

//students paths
import StudentDashboard from './pages/student/StudentDashboard';
import MeetingScheduler from './pages/student/MeetingScheduler';


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            HOD ROUTES
        ========================== */}
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

        {/* =========================
            STUDENT ROUTES
        ========================== */}
        <Route
          path="/student/dashboard"
          element={<StudentDashboard />}
        />

        <Route
          path="/student/meetings"
          element={<MeetingScheduler />}
        />

        {/* =========================
            DEFAULT ROUTE
        ========================== */}
        <Route
          path="*"
          element={<Navigate to="/student/dashboard" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;