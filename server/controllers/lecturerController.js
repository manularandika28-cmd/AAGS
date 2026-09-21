import { pool } from '../db.js';

export const getLecturerDashboard = async (req, res) => {
    try {
        const lecturerId = req.user.userId;

        const result = await pool.query(
            `SELECT lecturer_id, name, email, department_id, role_id, is_active
             FROM lecturers
             WHERE lecturer_id = $1`,
            [lecturerId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Lecturer not found'
            });
        }

        return res.status(200).json({
            lecturer: result.rows[0]
        });

    } catch (error) {
        console.error('Lecturer dashboard error:', error);

        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};
export const getLecturerSessions = async (req, res) => {
    try {
        const lecturerId = req.user.userId;

        const result = await pool.query(
    `SELECT
        s.session_id,
        s.course_id,
        c.course_code,
        c.course_name,
        s.location,
        s.session_date,
        s.start_time,
        s.end_time,
        s.day_of_week,
        (
            SELECT COUNT(*)
            FROM enrollments e
            WHERE e.course_id = s.course_id
        ) AS enrolled_count
     FROM sessions s
     INNER JOIN course_lecturers cl
        ON s.course_id = cl.course_id
     INNER JOIN courses c
        ON s.course_id = c.course_id
     WHERE cl.lecturer_id = $1
     ORDER BY s.session_date, s.start_time`,
    [lecturerId]
);

        return res.status(200).json({
            sessions: result.rows
        });

    } catch (error) {
        console.error('Lecturer sessions error:', error);

        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};
export const getSessionAttendance = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const result = await pool.query(
            `SELECT
                ar.attendance_id,
                ar.session_id,
                ar.student_id,
                s.student_name,
                ar.status,
                ar.marked_at
             FROM attendance_records ar
             INNER JOIN students s
                ON ar.student_id = s.student_id
             WHERE ar.session_id = $1
             ORDER BY s.student_name`,
            [sessionId]
        );

        const enrolledResult = await pool.query(
    `SELECT COUNT(*) AS enrolled_count
     FROM enrollments e
     INNER JOIN sessions s
        ON e.course_id = s.course_id
     WHERE s.session_id = $1`,
    [sessionId]
);

return res.status(200).json({
    attendance: result.rows,
    enrolled_count: Number(enrolledResult.rows[0].enrolled_count)
});

    } catch (error) {
        console.error('Session attendance error:', error);

        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const markAttendanceManually = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { studentId, reason } = req.body;

        if (!studentId) {
            return res.status(400).json({
                error: 'Student ID is required'
            });
        }

        const studentResult = await pool.query(
            `SELECT student_id, student_name
             FROM students
             WHERE student_id = $1`,
            [studentId]
        );

        if (studentResult.rows.length === 0) {
            return res.status(404).json({
                error: 'Student not found'
            });
        }

        const existingResult = await pool.query(
    `SELECT attendance_id
     FROM attendance_records
     WHERE session_id = $1 AND student_id = $2`,
    [sessionId, studentId]
);

let result;

if (existingResult.rows.length > 0) {
    result = await pool.query(
        `UPDATE attendance_records
         SET status = 'present',
             marked_at = NOW(),
             changed_by = $2,
             changed_reason = $3,
             changed_at = NOW()
         WHERE attendance_id = $1
         RETURNING *`,
        [
            existingResult.rows[0].attendance_id,
            req.user.userId,
            reason
        ]
    );
} else {
    result = await pool.query(
        `INSERT INTO attendance_records
            (session_id, student_id, status, marked_at, changed_by, changed_reason)
         VALUES
            ($1, $2, 'present', NOW(), $3, $4)
         RETURNING *`,
        [sessionId, studentId, req.user.userId, reason]
    );
}

        return res.status(201).json({
            message: 'Attendance marked manually',
            attendance: result.rows[0]
        });

    } catch (error) {
        console.error('Manual attendance error:', error);

        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};
export const startAttendanceSession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const result = await pool.query(
            `UPDATE sessions
             SET session_status = 'active',
                 actual_start_time = NOW()
             WHERE session_id = $1
             RETURNING *`,
            [sessionId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Session not found'
            });
        }

        return res.status(200).json({
            message: 'Attendance session started',
            session: result.rows[0]
        });

    } catch (error) {
        console.error('Start attendance session error:', error);

        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};
export const endAttendanceSession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const result = await pool.query(
            `UPDATE sessions
             SET session_status = 'ended',
                 actual_end_time = NOW()
             WHERE session_id = $1
             RETURNING *`,
            [sessionId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Session not found'
            });
        }

        return res.status(200).json({
            message: 'Attendance session ended',
            session: result.rows[0]
        });

    } catch (error) {
        console.error('End attendance session error:', error);

        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};