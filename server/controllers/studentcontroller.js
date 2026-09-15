// server/controllers/studentController.js
import { pool } from '../db.js';

export const getStudentDashboardData = async (req, res) => {
  try {
    const studentId = req.user.userId;

    // 1. Student Profile (including department, level, and semester)
    let student = { 
      student_id: studentId, 
      student_name: req.user.name || 'Student', 
      email: req.user.email,
      academic_level: 'Level 2',
      semester: 'Semester 1',
      department_id: 1
    };

    try {
      const studentRes = await pool.query(
        `SELECT student_id, student_name, email, department_id, academic_level, semester 
         FROM students 
         WHERE student_id = $1`,
        [studentId]
      );
      if (studentRes.rows.length > 0) {
        student = studentRes.rows[0];
      }
    } catch (e) {
      console.warn('Student query error:', e.message);
    }

    // 2. Attendance Calculation (DISTINCT session guard)
    let attendanceRate = 75;
    try {
      const attendanceRes = await pool.query(
        `SELECT 
           COUNT(DISTINCT s.session_id) AS total_sessions,
           COUNT(DISTINCT ar.session_id) FILTER (WHERE ar.status = 'present') AS attended_sessions
         FROM enrollments e
         JOIN sessions s ON s.course_id = e.course_id
         LEFT JOIN attendance_records ar 
           ON ar.session_id = s.session_id 
          AND ar.student_id = e.student_id
         WHERE e.student_id = $1`,
        [studentId]
      );
      const total = parseInt(attendanceRes.rows[0]?.total_sessions || 0);
      const attended = parseInt(attendanceRes.rows[0]?.attended_sessions || 0);
      attendanceRate = total === 0 ? 100 : Math.round((attended / total) * 100);
    } catch (e) {
      console.warn('Attendance query error:', e.message);
    }

    // 3. Upcoming Confirmed Meetings
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

    // 4. Medical Status
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

    // 5. OFFICIAL TIMETABLE FOR STUDENT'S DEPT, LEVEL & SEMESTER
    let timetable = [];
    try {
      const timetableRes = await pool.query(
        `SELECT 
           timetable_id,
           day_of_week,
           TO_CHAR(start_time, 'HH24:MI') AS start_time,
           TO_CHAR(end_time, 'HH24:MI') AS end_time,
           course_code,
           course_name,
           location,
           lecturer_abbr
         FROM department_timetables
         WHERE department_id = $1 
           AND academic_level = $2 
           AND semester = $3
         ORDER BY start_time ASC`,
        [student.department_id || 1, student.academic_level || 'Level 2', student.semester || 'Semester 1']
      );
      timetable = timetableRes.rows;
    } catch (e) {
      console.warn('Timetable query error:', e.message);
    }

    // 6. Recent Alerts
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