import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// 1. Department Overview Stats & Module Averages (for Dashboard)
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const pendingMedicals = await pool.query(
      "SELECT COUNT(*) FROM medical_submissions WHERE status = 'pending'"
    );
    const activeSessions = await pool.query(
      "SELECT COUNT(*) FROM sessions WHERE session_date::date = CURRENT_DATE"
    );
    const moduleOverview = await pool.query(`
      SELECT c.course_code, c.course_name, l.name AS lecturer_name,
             COUNT(DISTINCT e.student_id) AS total_students
      FROM courses c
      LEFT JOIN course_lecturers cl ON c.course_id = cl.course_id
      LEFT JOIN lecturers l ON cl.lecturer_id = l.lecturer_id
      LEFT JOIN enrollments e ON c.course_id = e.course_id
      GROUP BY c.course_id, c.course_code, c.course_name, l.name
    `);

    res.json({
      deptAttendanceAvg: 87.5,
      pendingMedicals: parseInt(pendingMedicals.rows[0].count, 10),
      activeSessionsToday: parseInt(activeSessions.rows[0].count, 10),
      staffOnLeave: 3,
      modules: moduleOverview.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Medical Submissions (for HOD Medical Review)
app.get('/api/medicals', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.submission_id, s.student_name, s.student_id, m.description, 
             m.date_from, m.date_to, m.file_path, m.status, m.submitted_at
      FROM medical_submissions m
      JOIN students s ON m.student_id = s.student_id
      ORDER BY m.submitted_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/medicals/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, reviewed_by } = req.body;
  try {
    const result = await pool.query(
      `UPDATE medical_submissions 
       SET status = $1, reviewed_by = $2, reviewed_at = NOW() 
       WHERE submission_id = $3 RETURNING *`,
      [status, reviewed_by, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Meeting Requests (for Meeting Request Management)
app.get('/api/meetings', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT mr.request_id, s.student_name, s.student_id, l.name AS lecturer_name,
             mr.purpose, mr.preferred_date, mr.preferred_time, mr.status
      FROM meeting_requests mr
      JOIN students s ON mr.student_id = s.student_id
      JOIN lecturers l ON mr.lecturer_id = l.lecturer_id
      ORDER BY mr.preferred_date DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});