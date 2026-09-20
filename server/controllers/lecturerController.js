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
                s.day_of_week
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

        return res.status(200).json({
            attendance: result.rows
        });

    } catch (error) {
        console.error('Session attendance error:', error);

        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};