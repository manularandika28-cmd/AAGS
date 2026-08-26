import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Updated paths to include pages/HOD/
import HODDashboard from './pages/HOD/HOD_dashboard';
import MeetingRequests from './pages/HOD/Meeting_requests';
import MedicalReview from './pages/HOD/Medical_review';

// Updated paths to include pages/Lecturer/
import LecturerDashboard from './pages/Lecturer/LecturerDashboard';
import AttendanceManager from "./pages/Lecturer/AttendanceManager";
import MeetingManagement from "./pages/Lecturer/MeetingManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/hod/dashboard" element={<HODDashboard />} />
        <Route path="/hod/meetings" element={<MeetingRequests />} />
        <Route path="/hod/medical" element={<MedicalReview />} />
        <Route path="/lecturer/dashboard" element={<LecturerDashboard />}/>
        <Route path="/lecturer/attendance" element={<AttendanceManager />}/>
        <Route path="/lecturer/meetings" element={<MeetingManagement />}/>
        <Route path="*" element={<Navigate to="/hod/medical" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;