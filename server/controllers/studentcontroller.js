import { pool } from '../db.js';

export const getStudentDashboardData = async (req, res) => {
  try {
    // Resolve logged in student ID from auth token payload
    const studentId = req.user.userId || req.user.id || req.user.student_id;
    console.log('Logged in student ID:', studentId);

    // 1. Student Profile
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
        `SELECT s.student_id, s.student_name, s.email, s.academic_level, s.semester, s.department_id, d.dep_name
         FROM students s
         JOIN departments d ON s.department_id = d.department_id
         WHERE s.student_id = $1`,
        [studentId]
      );
      if (studentRes.rows.length > 0) {
        student = studentRes.rows[0];
      }
    } catch (e) {
      console.warn('Student profile query error:', e.message);
    }

    // 2. Attendance Calculation (DISTINCT session guard)
    let overallRate = 100;
    let lowAttendanceModules = [];

    try {
      const attendanceRes = await pool.query(
      `SELECT 
         c.course_id,
         c.course_code,
         c.course_name,
         COUNT(DISTINCT s.session_id) AS total_sessions,
         COUNT(DISTINCT ar.session_id) FILTER (WHERE ar.status = 'present') AS attended,
         ROUND(
           (COUNT(DISTINCT ar.session_id) FILTER (WHERE ar.status = 'present')::numeric / 
           NULLIF(COUNT(DISTINCT s.session_id), 0)) * 100, 1
         ) AS attendance_pct
       FROM enrollments e
       JOIN courses c ON c.course_id = e.course_id
       LEFT JOIN sessions s 
         ON s.course_id = c.course_id
        AND s.session_date <= now()   -- only count sessions that have actually happened
       LEFT JOIN attendance_records ar 
         ON ar.session_id = s.session_id 
        AND ar.student_id = e.student_id
       WHERE e.student_id = $1
       GROUP BY c.course_id, c.course_code, c.course_name
       ORDER BY attendance_pct ASC`,
      [studentId]
    );

      const rows = attendanceRes.rows;
      if (rows.length > 0) {
        let sumPct = 0;
        rows.forEach((row) => {
      const totalSessions = parseInt(row.total_sessions || 0, 10);
      const pct = parseFloat(row.attendance_pct || 0);
      sumPct += totalSessions > 0 ? pct : 100; // don't drag the average down for not-yet-started courses
 
      if (totalSessions > 0 && pct < 80.0) {
        lowAttendanceModules.push({
          course_id: row.course_id,
          course_code: row.course_code,
          course_name: row.course_name,
          total_sessions: totalSessions,
          attended: parseInt(row.attended || 0, 10),
          attendance_pct: pct
        });
      }
    });

        overallRate = Math.round(sumPct / rows.length);
      }
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
      const studentDepId = student.department_id || 1;
      const studentLevel = student.academic_level || 'Level 2';

      const alertsRes = await pool.query(
        `SELECT 
           notification_id,
           title,
           message,
           type,
           audience,
           is_read,
           created_at
         FROM notifications
         WHERE 
           -- 1. Direct personal alerts for this student
           (audience = 'personal' AND student_id = $1)
           
           -- 2. Broadcasts to students or all campus users
           OR (
             audience IN ('students', 'all') 
             AND (department_id IS NULL OR department_id = $2)
             AND (academic_level IS NULL OR academic_level = $3)
           )
         ORDER BY created_at DESC
         LIMIT 6`,
        [studentId, studentDepId, studentLevel]
      );
      alerts = alertsRes.rows;
    } catch (e) {
      console.warn('Alerts query error:', e.message);
    }

    return res.json({
      student,
      attendanceRate: overallRate,
      lowAttendanceModules: lowAttendanceModules,
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


//-----meetingController------

export const getLecturersForBooking = async (req, res) => {
  try {
    const studentId = req.user.userId || req.user.id || req.user.student_id;

    // Get student's department to prioritize their department lecturers
    const studentRes = await pool.query(
      `SELECT department_id FROM students WHERE student_id = $1`,
      [studentId]
    );
    const departmentId = studentRes.rows[0]?.department_id;

    const lecturersRes = await pool.query(
      `SELECT 
         l.lecturer_id, 
         l.name, 
         l.email, 
         d.dep_name,
         l.department_id
       FROM lecturers l
       LEFT JOIN departments d ON l.department_id = d.department_id
       WHERE l.is_active = true
       ORDER BY (l.department_id = $1) DESC, l.name ASC`,
      [departmentId || 1]
    );

    return res.json(lecturersRes.rows);
  } catch (err) {
    console.error('Error fetching lecturers:', err);
    return res.status(500).json({ error: 'Failed to fetch lecturers' });
  }
};

// 2. Get student's meeting requests & appointments
export const getStudentMeetings = async (req, res) => {
  try {
    const studentId = req.user.userId || req.user.id || req.user.student_id;

    const meetingsRes = await pool.query(
      `SELECT 
         mr.request_id,
         mr.student_id,
         mr.lecturer_id,
         l.name AS lecturer_name,
         l.email AS lecturer_email,
         d.dep_name AS department_name,
         TO_CHAR(mr.preferred_date, 'YYYY-MM-DD') AS preferred_date,
         TO_CHAR(mr.preferred_time, 'HH24:MI') AS preferred_time,
         TO_CHAR(mr.confirmed_date, 'YYYY-MM-DD') AS confirmed_date,
         TO_CHAR(mr.confirmed_time, 'HH24:MI') AS confirmed_time,
         mr.purpose,
         mr.response,
         mr.location,
         mr.status
       FROM meeting_requests mr
       JOIN lecturers l ON l.lecturer_id = mr.lecturer_id
       LEFT JOIN departments d ON l.department_id = d.department_id
       WHERE mr.student_id = $1
       ORDER BY 
         CASE WHEN mr.status = 'confirmed' THEN 1
              WHEN mr.status = 'pending' THEN 2
              ELSE 3 END,
         COALESCE(mr.confirmed_date, mr.preferred_date) DESC`,
      [studentId]
    );

    return res.json(meetingsRes.rows);
  } catch (err) {
    console.error('Error fetching student meetings:', err);
    return res.status(500).json({ error: 'Failed to fetch meetings' });
  }
};

// 3. Submit a new meeting request
export const createMeetingRequest = async (req, res) => {
  try {
    const studentId = req.user.userId || req.user.id || req.user.student_id;
    const { lecturer_id, preferred_date, preferred_time, purpose } = req.body;

    if (!lecturer_id || !preferred_date || !preferred_time || !purpose) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const insertRes = await pool.query(
      `INSERT INTO meeting_requests 
         (student_id, lecturer_id, preferred_date, preferred_time, purpose, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING *`,
      [studentId, lecturer_id, preferred_date, preferred_time, purpose]
    );

    return res.status(201).json({
      message: 'Meeting requested successfully',
      meeting: insertRes.rows[0]
    });
  } catch (err) {
    console.error('Error creating meeting request:', err);
    return res.status(500).json({ error: 'Failed to submit meeting request' });
  }
};

// 4. Cancel a pending/confirmed meeting request
export const cancelMeetingRequest = async (req, res) => {
  try {
    const studentId = req.user.userId || req.user.id || req.user.student_id;
    const { requestId } = req.params;

    const updateRes = await pool.query(
      `UPDATE meeting_requests
       SET status = 'cancelled'
       WHERE request_id = $1 AND student_id = $2 AND status IN ('pending', 'confirmed')
       RETURNING *`,
      [requestId, studentId]
    );

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ error: 'Meeting not found or cannot be cancelled' });
    }

    return res.json({ message: 'Meeting cancelled successfully', meeting: updateRes.rows[0] });
  } catch (err) {
    console.error('Error cancelling meeting:', err);
    return res.status(500).json({ error: 'Failed to cancel meeting' });
  }
};