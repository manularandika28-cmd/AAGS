import React from 'react';
import StudentDashboard from './pages/Student/StudentDashboard.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Demo from './pages/Student/Demo.jsx';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          {/* Main Routes */}
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/" element={<Demo />} />

        </Routes>
    </BrowserRouter>
  );
}

export default App;