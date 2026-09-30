import { pool } from '../db.js';

export const getHODDashboard = async (req, res) => {
  try {
    // Get logged-in HOD ID from JWT
    const hodId =
      req.user?.userId ||
      req.user?.id ||
      req.user?.hod_id;

    if (!hodId) {
      return res.status(401).json({
        error: 'HOD identity not found'
      });
    }

    // ---------------------------------------------------------
    // 1. FIND HOD'S DEPARTMENT
    // HOD -> lecturer -> department
    // ---------------------------------------------------------
    const hodResult = await pool.query(
      `
      SELECT
        h.hod_id,
        h.name AS hod_name,
        l.lecturer_id,
        l.department_id,
        d.dep_name
      FROM hods h
      JOIN lecturers l
        ON h.lecturer_id = l.lecturer_id
      JOIN departments d
        ON l.department_id = d.department_id
      WHERE h.hod_id = $1
        AND h.is_active = true
      `,
      [hodId]
    );

    if (hodResult.rows.length === 0) {
      return res.status(404).json({
        error: 'HOD or department not found'
      });
    }

    const hod = hodResult.rows[0];
    const departmentId = hod.department_id;

    // ---------------------------------------------------------
    // 2. DEPARTMENT ATTENDANCE AVERAGE
    // ---------------------------------------------------------
    const attendanceResult = await pool.query(
      `
      SELECT
        COALESCE(
          ROUND(
            100.0 *
            SUM(
              CASE
                WHEN LOWER(ar.status::text) = 'present'
                THEN 1
                ELSE 0
              END
            )
            /
            NULLIF(COUNT(ar.attendance_id), 0),
            1
          ),
          0
        ) AS average
      FROM attendance_records ar
      JOIN sessions s
        ON ar.session_id = s.session_id
      JOIN courses c
        ON s.course_id = c.course_id
      WHERE c.department_id = $1
      `,
      [departmentId]
    );

    // ---------------------------------------------------------
    // 3. PENDING MEDICAL SUBMISSIONS
    // ONLY STUDENTS FROM HOD'S DEPARTMENT
    // ---------------------------------------------------------
    const medicalCountResult = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM medical_submissions ms
      JOIN students st
        ON ms.student_id = st.student_id
      WHERE st.department_id = $1
        AND LOWER(ms.status::text) = 'pending'
      `,
      [departmentId]
    );

    // ---------------------------------------------------------
    // 4. ACTIVE SESSIONS TODAY
    // ---------------------------------------------------------
    const activeSessionsResult = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM sessions s
      JOIN courses c
        ON s.course_id = c.course_id
      WHERE c.department_id = $1
        AND s.session_date::date = CURRENT_DATE
        AND (
          s.start_time IS NULL
          OR s.end_time IS NULL
          OR (
            CURRENT_TIME >= s.start_time
            AND CURRENT_TIME <= s.end_time
          )
        )
      `,
      [departmentId]
    );

    // ---------------------------------------------------------
    // 5. MODULE ATTENDANCE
    // ---------------------------------------------------------
    const modulesResult = await pool.query(
      `
      SELECT
        c.course_id,
        c.course_code AS code,

        COALESCE(
          STRING_AGG(DISTINCT l.name, ', '),
          'No Lecturer Assigned'
        ) AS lecturer,

        COUNT(
          DISTINCT e.student_id
        ) AS students,

        COALESCE(
          ROUND(
            100.0 *
            SUM(
              CASE
                WHEN LOWER(ar.status::text) = 'present'
                THEN 1
                ELSE 0
              END
            )
            /
            NULLIF(COUNT(ar.attendance_id), 0),
            1
          ),
          0
        ) AS avg_attendance

      FROM courses c

      LEFT JOIN course_lecturers cl
        ON c.course_id = cl.course_id

      LEFT JOIN lecturers l
        ON cl.lecturer_id = l.lecturer_id

      LEFT JOIN enrollments e
        ON c.course_id = e.course_id

      LEFT JOIN sessions s
        ON c.course_id = s.course_id
        AND s.session_date <= NOW()

      LEFT JOIN attendance_records ar
        ON s.session_id = ar.session_id
        AND e.student_id = ar.student_id

      WHERE c.department_id = $1

      GROUP BY
        c.course_id,
        c.course_code

      ORDER BY
        c.course_code
      `,
      [departmentId]
    );

    // ---------------------------------------------------------
    // 6. MEDICAL QUEUE
    // ---------------------------------------------------------
    const medicalQueueResult = await pool.query(
      `
      SELECT
        ms.submission_id,
        st.student_id,
        st.student_name,
        ms.description,
        ms.date_from,
        ms.date_to,
        ms.status,
        ms.submitted_at,
        l.name AS lecturer_name

      FROM medical_submissions ms

      JOIN students st
        ON ms.student_id = st.student_id

      LEFT JOIN enrollments e
        ON st.student_id = e.student_id

      LEFT JOIN course_lecturers cl
        ON e.course_id = cl.course_id

      LEFT JOIN lecturers l
        ON cl.lecturer_id = l.lecturer_id

      LEFT JOIN courses c
        ON e.course_id = c.course_id

      WHERE st.department_id = $1

      GROUP BY
        ms.submission_id,
        st.student_id,
        st.student_name,
        ms.description,
        ms.date_from,
        ms.date_to,
        ms.status,
        ms.submitted_at,
        l.name

      ORDER BY ms.submitted_at ASC

      LIMIT 5
      `,
      [departmentId]
    );

    // ---------------------------------------------------------
    // 7. SEND RESPONSE
    // ---------------------------------------------------------
    res.json({
      hod: {
        id: hod.hod_id,
        name: hod.hod_name
      },

      department: {
        id: departmentId,
        name: hod.dep_name
      },

      metrics: {
        attendanceAverage: Number(
          attendanceResult.rows[0]?.average || 0
        ),

        pendingMedicals: Number(
          medicalCountResult.rows[0]?.total || 0
        ),

        activeSessionsToday: Number(
          activeSessionsResult.rows[0]?.total || 0
        ),

        // No staff-leave table exists; null means this metric is not tracked.
        staffOnLeave: null
      },

      modules: modulesResult.rows.map((row) => {
        const attendance = Number(row.avg_attendance || 0);

        let trend = 'stable';

        if (attendance >= 80) {
          trend = 'up';
        } else if (attendance < 70) {
          trend = 'down';
        }

        return {
          courseId: row.course_id,
          code: row.code,
          lecturer: row.lecturer,
          students: Number(row.students || 0),
          avgAttendance: attendance,
          status: trend
        };
      }),

      medicalQueue: medicalQueueResult.rows.map((row) => ({
        id: row.submission_id,
        studentId: row.student_id,
        studentName: row.student_name,
        description: row.description,
        dateFrom: row.date_from,
        dateTo: row.date_to,
        status: row.status,
        submittedAt: row.submitted_at,
        lecturer: row.lecturer_name
      }))
    });

  } catch (error) {
    console.error('HOD dashboard error:', error);

    res.status(500).json({
      error: 'Failed to load HOD dashboard',
      details: error.message
    });
  }
};

// ============================================================
// HOD MEDICAL REVIEW - GET DATA
// ============================================================

// ============================================================
// HOD MEDICAL REVIEW - GET DATA
// ============================================================

export const getHODMedicalReview = async (req, res) => {
  try {
    const hodId =
      req.user?.userId ||
      req.user?.id ||
      req.user?.hod_id;

    if (!hodId) {
      return res.status(401).json({
        error: 'HOD identity not found'
      });
    }

    // ---------------------------------------------------------
    // 1. FIND HOD'S DEPARTMENT
    // ---------------------------------------------------------
    const hodResult = await pool.query(
      `
      SELECT
        h.hod_id,
        h.name AS hod_name,
        l.department_id,
        d.dep_name
      FROM hods h
      JOIN lecturers l
        ON h.lecturer_id = l.lecturer_id
      JOIN departments d
        ON l.department_id = d.department_id
      WHERE h.hod_id = $1
        AND h.is_active = true
      `,
      [hodId]
    );

    if (hodResult.rows.length === 0) {
      return res.status(404).json({
        error: 'HOD or department not found'
      });
    }

    const hod = hodResult.rows[0];
    const departmentId = hod.department_id;

    // ---------------------------------------------------------
    // 2. PENDING MEDICAL COUNT
    // ---------------------------------------------------------
    const pendingResult = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM medical_submissions ms
      JOIN students st
        ON ms.student_id = st.student_id
      WHERE st.department_id = $1
        AND ms.status = 'pending'
      `,
      [departmentId]
    );

    // ---------------------------------------------------------
    // 3. APPROVED THIS MONTH
    // ---------------------------------------------------------
    const approvedResult = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM medical_submissions ms
      JOIN students st
        ON ms.student_id = st.student_id
      WHERE st.department_id = $1
        AND ms.status = 'approved'
        AND ms.reviewed_at >= DATE_TRUNC('month', CURRENT_DATE)
        AND ms.reviewed_at < DATE_TRUNC('month', CURRENT_DATE)
            + INTERVAL '1 month'
      `,
      [departmentId]
    );

    // ---------------------------------------------------------
    // 4. MEDICAL REVIEW QUEUE
    // ---------------------------------------------------------
    //
    // LATERAL is used here so one medical submission creates
    // one card, even if the student is enrolled in multiple
    // courses.
    //
    const queueResult = await pool.query(
      `
      SELECT
        ms.submission_id,
        ms.student_id,
        st.student_name,
        st.email AS student_email,

        course_info.course_id,
        course_info.course_code,
        course_info.course_name,
        course_info.lecturer_name,

        ms.description,
        ms.date_from,
        ms.date_to,
        ms.file_path,
        ms.status,
        ms.submitted_at,
        ms.reviewed_at,

        ms.reviewed_by,
        reviewer.name AS reviewer_name

      FROM medical_submissions ms

      JOIN students st
        ON ms.student_id = st.student_id

      -- Get one course/lecturer for the student
      LEFT JOIN LATERAL (
        SELECT
          c.course_id,
          c.course_code,
          c.course_name,
          STRING_AGG(
            DISTINCT l.name,
            ', '
            ORDER BY l.name
          ) AS lecturer_name

        FROM enrollments e

        JOIN courses c
          ON e.course_id = c.course_id

        LEFT JOIN course_lecturers cl
          ON c.course_id = cl.course_id

        LEFT JOIN lecturers l
          ON cl.lecturer_id = l.lecturer_id

        WHERE e.student_id = st.student_id
          AND c.department_id = $1

        GROUP BY
          c.course_id,
          c.course_code,
          c.course_name

        ORDER BY c.course_code

        LIMIT 1
      ) course_info
        ON true

      LEFT JOIN lecturers reviewer
        ON ms.reviewed_by = reviewer.lecturer_id

      WHERE st.department_id = $1

      ORDER BY ms.submitted_at ASC
      `,
      [departmentId]
    );

    // ---------------------------------------------------------
    // 5. SEND DATA TO FRONTEND
    // ---------------------------------------------------------
    res.json({
      hod: {
        id: hod.hod_id,
        name: hod.hod_name
      },

      department: {
        id: departmentId,
        name: hod.dep_name
      },

      counts: {
        pending: Number(
          pendingResult.rows[0]?.total || 0
        ),

        approvedThisMonth: Number(
          approvedResult.rows[0]?.total || 0
        )
      },

      submissions: queueResult.rows.map((row) => ({
        id: row.submission_id,

        studentId: row.student_id,
        studentName: row.student_name,
        studentEmail: row.student_email,

        courseId: row.course_id,
        courseCode: row.course_code,
        courseName: row.course_name,

        lecturer: row.lecturer_name,

        description: row.description,

        dateFrom: row.date_from,
        dateTo: row.date_to,

        filePath: row.file_path,

        status: row.status,

        submittedAt: row.submitted_at,
        reviewedAt: row.reviewed_at,

        reviewedBy: row.reviewed_by,
        reviewerName: row.reviewer_name
      }))
    });

  } catch (error) {
    console.error('HOD medical review error:', error);

    res.status(500).json({
      error: 'Failed to load medical review data',
      details: error.message
    });
  }
};


// ============================================================
// HOD MEDICAL REVIEW - APPROVE
// ============================================================

export const approveMedicalSubmission = async (req, res) => {
  try {
    const hodId =
      req.user?.userId ||
      req.user?.id ||
      req.user?.hod_id;

    const submissionId = req.params.id;

    if (!hodId) {
      return res.status(401).json({
        error: 'HOD identity not found'
      });
    }

    // Find HOD department
    const hodResult = await pool.query(
      `
      SELECT l.department_id
      FROM hods h
      JOIN lecturers l
        ON h.lecturer_id = l.lecturer_id
      WHERE h.hod_id = $1
        AND h.is_active = true
      `,
      [hodId]
    );

    if (hodResult.rows.length === 0) {
      return res.status(404).json({
        error: 'HOD not found'
      });
    }

    const departmentId = hodResult.rows[0].department_id;

    // Only allow approving a pending medical
    // belonging to this HOD's department
    const result = await pool.query(
      `
      UPDATE medical_submissions ms
      SET
        status = 'approved',
        reviewed_at = CURRENT_TIMESTAMP
      FROM students st
      WHERE ms.submission_id = $1
        AND ms.student_id = st.student_id
        AND st.department_id = $2
        AND ms.status = 'pending'
      RETURNING
        ms.submission_id,
        ms.student_id,
        ms.status,
        ms.reviewed_at
      `,
      [submissionId, departmentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Pending medical submission not found'
      });
    }

    res.json({
      message: 'Medical certificate approved successfully',
      submission: result.rows[0]
    });

  } catch (error) {
    console.error('Approve medical error:', error);

    res.status(500).json({
      error: 'Failed to approve medical submission',
      details: error.message
    });
  }
};


// ============================================================
// HOD MEDICAL REVIEW - REJECT
// ============================================================

export const rejectMedicalSubmission = async (req, res) => {
  try {
    const hodId =
      req.user?.userId ||
      req.user?.id ||
      req.user?.hod_id;

    const submissionId = req.params.id;

    if (!hodId) {
      return res.status(401).json({
        error: 'HOD identity not found'
      });
    }

    // Find HOD department
    const hodResult = await pool.query(
      `
      SELECT l.department_id
      FROM hods h
      JOIN lecturers l
        ON h.lecturer_id = l.lecturer_id
      WHERE h.hod_id = $1
        AND h.is_active = true
      `,
      [hodId]
    );

    if (hodResult.rows.length === 0) {
      return res.status(404).json({
        error: 'HOD not found'
      });
    }

    const departmentId = hodResult.rows[0].department_id;

    // Only reject pending medical submissions
    // from this HOD's department
    const result = await pool.query(
      `
      UPDATE medical_submissions ms
      SET
        status = 'rejected',
        reviewed_at = CURRENT_TIMESTAMP
      FROM students st
      WHERE ms.submission_id = $1
        AND ms.student_id = st.student_id
        AND st.department_id = $2
        AND ms.status = 'pending'
      RETURNING
        ms.submission_id,
        ms.student_id,
        ms.status,
        ms.reviewed_at
      `,
      [submissionId, departmentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Pending medical submission not found'
      });
    }

    res.json({
      message: 'Medical certificate rejected successfully',
      submission: result.rows[0]
    });

  } catch (error) {
    console.error('Reject medical error:', error);

    res.status(500).json({
      error: 'Failed to reject medical submission',
      details: error.message
    });
  }
};

export const getHODMeetings = async (req, res) => {
  try {
    const hodId = req.user?.userId || req.user?.id || req.user?.hod_id;
    if (!hodId) {
      return res.status(401).json({ error: 'HOD identity not found' });
    }

    const hodResult = await pool.query(
      `SELECT l.department_id
       FROM hods h
       JOIN lecturers l ON h.lecturer_id = l.lecturer_id
       WHERE h.hod_id = $1 AND h.is_active = true`,
      [hodId]
    );

    if (hodResult.rows.length === 0) {
      return res.status(404).json({ error: 'HOD or department not found' });
    }

    const departmentId = hodResult.rows[0].department_id;
    const status = String(req.query.status || 'all').toLowerCase();
    const values = [departmentId];
    const statusFilter = status === 'all'
      ? ''
      : (values.push(status), `AND LOWER(mr.status::text) = $${values.length}`);

    const [meetingsResult, countsResult, lecturersResult, studentsResult] = await Promise.all([
      pool.query(
        `SELECT
           mr.request_id,
           mr.student_id,
           st.student_name,
           mr.lecturer_id,
           l.name AS lecturer_name,
           TO_CHAR(mr.preferred_date, 'YYYY-MM-DD') AS preferred_date,
           TO_CHAR(mr.preferred_time, 'HH24:MI') AS preferred_time,
           TO_CHAR(mr.confirmed_date, 'YYYY-MM-DD') AS confirmed_date,
           TO_CHAR(mr.confirmed_time, 'HH24:MI') AS confirmed_time,
           mr.purpose,
           mr.response,
           mr.location,
           mr.status
         FROM meeting_requests mr
         JOIN students st ON st.student_id = mr.student_id
         JOIN lecturers l ON l.lecturer_id = mr.lecturer_id
         WHERE st.department_id = $1
           AND l.department_id = $1
           ${statusFilter}
         ORDER BY
           CASE WHEN LOWER(mr.status::text) = 'pending' THEN 0 ELSE 1 END,
           COALESCE(mr.confirmed_date, mr.preferred_date),
           COALESCE(mr.confirmed_time, mr.preferred_time)`,
        values
      ),
      pool.query(
        `SELECT
           COUNT(*) FILTER (WHERE LOWER(mr.status::text) = 'pending') AS pending,
           COUNT(*) FILTER (
             WHERE LOWER(mr.status::text) = 'confirmed'
               AND COALESCE(mr.confirmed_date, mr.preferred_date) = CURRENT_DATE
           ) AS confirmed_today,
           COUNT(*) FILTER (WHERE LOWER(mr.status::text) = 'rejected') AS rejected
         FROM meeting_requests mr
         JOIN students st ON st.student_id = mr.student_id
         JOIN lecturers l ON l.lecturer_id = mr.lecturer_id
         WHERE st.department_id = $1 AND l.department_id = $1`,
        [departmentId]
      ),
      pool.query(
        `SELECT
           l.lecturer_id,
           l.name AS lecturer_name,
           l.email AS lecturer_email,
           CASE WHEN EXISTS (
             SELECT 1
             FROM meeting_requests mr
             WHERE mr.lecturer_id = l.lecturer_id
               AND LOWER(mr.status::text) = 'confirmed'
               AND COALESCE(mr.confirmed_date, mr.preferred_date) = CURRENT_DATE
           ) THEN 'Meetings scheduled today'
             ELSE 'No meetings scheduled today'
           END AS schedule_status
         FROM lecturers l
         WHERE l.department_id = $1
         ORDER BY l.name`,
        [departmentId]
      ),
      pool.query(
        `SELECT st.student_id, st.student_name
         FROM students st
         WHERE st.department_id = $1
         ORDER BY st.student_name`,
        [departmentId]
      )
    ]);

    res.json({
      meetings: meetingsResult.rows.map((row) => ({
        id: row.request_id,
        studentId: row.student_id,
        studentName: row.student_name,
        lecturerId: row.lecturer_id,
        lecturerName: row.lecturer_name,
        preferredDate: row.preferred_date,
        preferredTime: row.preferred_time,
        confirmedDate: row.confirmed_date,
        confirmedTime: row.confirmed_time,
        purpose: row.purpose,
        response: row.response,
        location: row.location,
        status: row.status
      })),
      counts: {
        pending: Number(countsResult.rows[0]?.pending || 0),
        confirmedToday: Number(countsResult.rows[0]?.confirmed_today || 0),
        rejected: Number(countsResult.rows[0]?.rejected || 0)
      },
      lecturers: lecturersResult.rows.map((row) => ({
        id: row.lecturer_id,
        name: row.lecturer_name,
        email: row.lecturer_email,
        scheduleStatus: row.schedule_status
      })),
      students: studentsResult.rows.map((row) => ({
        id: row.student_id,
        name: row.student_name
      }))
    });
  } catch (error) {
    console.error('HOD meetings error:', error);
    res.status(500).json({ error: 'Failed to load HOD meetings', details: error.message });
  }
};

export const createHODMeeting = async (req, res) => {
  try {
    const hodId = req.user?.userId || req.user?.id || req.user?.hod_id;
    const { studentId, lecturerId, preferredDate, preferredTime, purpose } = req.body || {};

    if (!hodId) {
      return res.status(401).json({ error: 'HOD identity not found' });
    }
    if (!studentId || !lecturerId || !preferredDate || !preferredTime || !String(purpose || '').trim()) {
      return res.status(400).json({ error: 'Student, lecturer, date, time, and topic are required' });
    }

    const hodResult = await pool.query(
      `SELECT l.department_id
       FROM hods h
       JOIN lecturers l ON h.lecturer_id = l.lecturer_id
       WHERE h.hod_id = $1 AND h.is_active = true`,
      [hodId]
    );
    if (hodResult.rows.length === 0) {
      return res.status(404).json({ error: 'HOD or department not found' });
    }

    const departmentId = hodResult.rows[0].department_id;
    const result = await pool.query(
      `INSERT INTO meeting_requests
         (student_id, lecturer_id, preferred_date, preferred_time, purpose, status)
       SELECT st.student_id, l.lecturer_id, $3::date, $4::time, $5, 'pending'
       FROM students st
       JOIN lecturers l ON l.department_id = st.department_id
       WHERE st.student_id = $1
         AND l.lecturer_id = $2
         AND st.department_id = $6
       RETURNING request_id, student_id, lecturer_id, preferred_date,
                 preferred_time, purpose, status`,
      [studentId, lecturerId, preferredDate, preferredTime, String(purpose).trim(), departmentId]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Selected student and lecturer must belong to this department' });
    }

    res.status(201).json({ message: 'Meeting request created', meeting: result.rows[0] });
  } catch (error) {
    console.error('HOD meeting creation error:', error);
    res.status(500).json({ error: 'Failed to create meeting request', details: error.message });
  }
};

export const updateHODMeeting = async (req, res) => {
  try {
    const hodId = req.user?.userId || req.user?.id || req.user?.hod_id;
    const { requestId } = req.params;
    const status = String(req.body?.status || '').toLowerCase();

    if (!hodId) {
      return res.status(401).json({ error: 'HOD identity not found' });
    }
    if (!['confirmed', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be confirmed or rejected' });
    }

    const hodResult = await pool.query(
      `SELECT l.department_id
       FROM hods h
       JOIN lecturers l ON h.lecturer_id = l.lecturer_id
       WHERE h.hod_id = $1 AND h.is_active = true`,
      [hodId]
    );
    if (hodResult.rows.length === 0) {
      return res.status(404).json({ error: 'HOD or department not found' });
    }

    const departmentId = hodResult.rows[0].department_id;

    if (status === 'confirmed') {
      const conflictResult = await pool.query(
        `SELECT existing.request_id
         FROM meeting_requests target
         JOIN meeting_requests existing
           ON existing.lecturer_id = target.lecturer_id
          AND existing.request_id <> target.request_id
          AND LOWER(existing.status::text) = 'confirmed'
          AND existing.confirmed_date = target.preferred_date
          AND existing.confirmed_time = target.preferred_time
         JOIN students st ON st.student_id = target.student_id
         JOIN lecturers l ON l.lecturer_id = target.lecturer_id
         WHERE target.request_id = $1
           AND st.department_id = $2
           AND l.department_id = $2
         LIMIT 1`,
        [requestId, departmentId]
      );
      if (conflictResult.rows.length > 0) {
        return res.status(409).json({ error: 'The lecturer already has a confirmed meeting at that time' });
      }
    }

    const decisionUpdates = status === 'confirmed'
      ? `status = 'confirmed',
         response = 'Meeting request approved by HOD.',
         confirmed_date = mr.preferred_date,
         confirmed_time = mr.preferred_time`
      : `status = 'rejected',
         response = 'Meeting request rejected by HOD.'`;

    const result = await pool.query(
      `UPDATE meeting_requests mr
       SET ${decisionUpdates}
       FROM students st, lecturers l
       WHERE mr.request_id = $1
         AND mr.student_id = st.student_id
         AND mr.lecturer_id = l.lecturer_id
         AND st.department_id = $2
         AND l.department_id = $2
         AND LOWER(mr.status::text) = 'pending'
       RETURNING mr.request_id, mr.status, mr.response,
                 mr.confirmed_date, mr.confirmed_time`,
      [requestId, departmentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pending meeting request not found in this department' });
    }

    res.json({ message: 'Meeting request updated', meeting: result.rows[0] });
  } catch (error) {
    console.error('HOD meeting update error:', error);
    res.status(500).json({ error: 'Failed to update meeting request', details: error.message });
  }
};