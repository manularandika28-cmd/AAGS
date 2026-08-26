import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Updated paths to include pages/HOD/
import HODDashboard from './pages/HOD/HOD_dashboard';
import MeetingRequests from './pages/HOD/Meeting_requests';
import MedicalReview from './pages/HOD/Medical_review';

//students paths
import StudentDashboard from './pages/Student/StudentDashboard';
import MeetingScheduler from './pages/Student/MeetingScheduler';
import MedicalHub from './pages/Student/MedicalHub';
import AcademicRecords from './pages/Student/AcademicRecords';

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

        {/* =========================
            DEFAULT ROUTE
        ========================== */}
        <Route
          path="*"
          element={<Navigate to="/Student/dashboard" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;