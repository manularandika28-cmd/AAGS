// server/controllers/studentController.js
import { pool } from '../db.js';

export const getStudentDashboardData = async (req, res) => {
  try {
    const studentId = req.user.userId;

    // 1. Student Name & Profile
    let student = { student_id: studentId, student_name: req.user.name || 'Student', email: req.user.email };
    try {
      const studentRes = await pool.query(
        `SELECT student_id, student_name, email FROM students WHERE student_id = $1`,
        [studentId]
      );
      if (studentRes.rows.length > 0) {
        student = studentRes.rows[0];
      }
    } catch (e) {
      console.warn('Student query error:', e.message);
    }

    // 2. Overall Attendance Percentage Calculation
    let attendanceRate = 75;
    try {
      const attendanceRes = await pool.query(
        `SELECT 
           COUNT(s.session_id) AS total_sessions,
           COUNT(ar.attendance_id) FILTER (WHERE ar.status = 'present') AS attended_sessions
         FROM enrollments e
         JOIN courses c ON e.course_id = c.course_id
         LEFT JOIN sessions s ON s.course_id = c.course_id
         LEFT JOIN attendance_records ar ON ar.session_id = s.session_id AND ar.student_id = e.student_id
         WHERE e.student_id = $1`,
        [studentId]
      );
      const total = parseInt(attendanceRes.rows[0]?.total_sessions || 0);
      const attended = parseInt(attendanceRes.rows[0]?.attended_sessions || 0);
      attendanceRate = total === 0 ? 100 : Math.round((attended / total) * 100);
    } catch (e) {
      console.warn('Attendance query error:', e.message);
    }

    // 3. Upcoming Confirmed Meetings Count
    let upcomingMeetings = 0;
    try {
      const meetingsRes = await pool.query(
        `SELECT COUNT(*) AS upcoming_count
         FROM meeting_requests
         WHERE student_id = $1 
           AND status = 'confirmed' 
           AND (confirmed_date >= CURRENT_DATE OR confirmed_date IS NULL)`,
        [studentId]
      );
      upcomingMeetings = parseInt(meetingsRes.rows[0]?.upcoming_count || 0);
    } catch (e) {
      console.warn('Meetings query error:', e.message);
    }

    // 4. Medical Status (Latest submission status)
    let latestMedical = { status: 'Cleared', date_to: null };
    try {
      const medicalRes = await pool.query(
        `SELECT status, date_to
         FROM medical_submissions
         WHERE student_id = $1
         ORDER BY submitted_at DESC
         LIMIT 1`,
        [studentId]
      );
      if (medicalRes.rows.length > 0) {
        latestMedical = medicalRes.rows[0];
      }
    } catch (e) {
      console.warn('Medical query error:', e.message);
    }

    // 5. Weekly Timetable Sessions for Enrolled Courses
    let timetable = [];
    try {
      const timetableRes = await pool.query(
        `SELECT 
           s.session_id,
           c.course_name,
           c.course_code,
           s.location,
           s.day_of_week,
           TO_CHAR(s.start_time::time, 'HH24:MI') AS start_time,
           TO_CHAR(s.end_time::time, 'HH24:MI') AS end_time
         FROM enrollments e
         JOIN sessions s ON e.course_id = s.course_id
         JOIN courses c ON s.course_id = c.course_id
         WHERE e.student_id = $1
         ORDER BY s.start_time ASC`,
        [studentId]
      );
      timetable = timetableRes.rows;
    } catch (e) {
      console.warn('Timetable query error:', e.message);
    }

    // 6. Recent Alerts / Notifications
    let alerts = [];
    try {
      const alertsRes = await pool.query(
        `SELECT n.notification_id, n.title, n.message, n.created_at
         FROM notification_students ns
         JOIN notifications n ON ns.notification_id = n.notification_id
         WHERE ns.student_id = $1
         ORDER BY n.created_at DESC
         LIMIT 5`,
        [studentId]
      );
      alerts = alertsRes.rows;
    } catch (e) {
      console.warn('Alerts query error:', e.message);
    }

    return res.json({
      student,
      attendanceRate,
      upcomingMeetings,
      medicalStatus: latestMedical,
      timetable,
      alerts
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    return res.status(500).json({ error: 'Server error loading dashboard' });
  }
};