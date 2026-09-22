import { pool } from '../db.js';
const checkAttendanceAlert = async (studentId, courseId) => {
    const attendanceSummary = await pool.query(
        `SELECT
            (
                SELECT COUNT(*)
                FROM attendance_records ar
                INNER JOIN sessions s
                    ON ar.session_id = s.session_id
                WHERE s.course_id = $1
                  AND ar.student_id = $2
                  AND ar.status = 'present'
            ) AS present_count,
            (
                SELECT COUNT(*)
                FROM sessions
                WHERE course_id = $1
            ) AS total_sessions`,
        [courseId, studentId]
    );

    const presentCount = Number(
        attendanceSummary.rows[0].present_count
    );

    const totalSessions = Number(
        attendanceSummary.rows[0].total_sessions
    );

    const attendancePercentage =
        totalSessions > 0
            ? (presentCount / totalSessions) * 100
            : 0;

    console.log(
        `Student ${studentId} attendance: ${attendancePercentage.toFixed(2)}%`
    );

    if (attendancePercentage < 75) {
                const existingWarning = await pool.query(
            `SELECT n.notification_id
             FROM notifications n
             INNER JOIN notification_students ns
                ON n.notification_id = ns.notification_id
             WHERE ns.student_id = $1
               AND n.title = 'Attendance Warning'
             LIMIT 1`,
            [studentId]
        );

        if (existingWarning.rows.length === 0) {

            const notificationResult = await pool.query(
                `INSERT INTO notifications
                    (title, message, delivery_status, created_at)
                 VALUES
                    ($1, $2, 'delivered', NOW())
                 RETURNING notification_id`,
                [
                    'Attendance Warning',
                    'Your attendance for this course has dropped below 75%.'
                ]
            );

            const notificationId =
                notificationResult.rows[0].notification_id;

            await pool.query(
                `INSERT INTO notification_students
                    (notification_id, student_id, created_at, is_read)
                 VALUES
                    ($1, $2, NOW(), false)`,
                [notificationId, studentId]
            );

            const lecturerResult = await pool.query(
                `SELECT lecturer_id
                 FROM course_lecturers
                 WHERE course_id = $1
                 LIMIT 1`,
                [courseId]
            );

            if (lecturerResult.rows.length > 0) {

                await pool.query(
                    `INSERT INTO notification_lecturers
                        (notification_id, lecturer_id, received_at, is_read)
                     VALUES
                        ($1, $2, NOW(), false)`,
                    [
                        notificationId,
                        lecturerResult.rows[0].lecturer_id
                    ]
                );
            }
        }
    }
};
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
                ar.changed_reason,
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
        const sessionResult = await pool.query(
            `SELECT session_id, session_status
            FROM sessions
            WHERE session_id = $1`,
            [sessionId]
        );


        if (sessionResult.rows.length === 0) {
            return res.status(404).json({
                error: 'Session not found'
            });
        }

        if (sessionResult.rows[0].session_status !== 'active') {
            return res.status(400).json({
                error: 'Attendance session is not active'
            });
        }

        if (!studentId) {
            return res.status(400).json({
                error: 'Student ID is required'
            });
        }
        const timeResult = await pool.query(
            `SELECT actual_start_time
            FROM sessions
            WHERE session_id = $1`,
            [sessionId]
        );

        const sessionStartTime = timeResult.rows[0].actual_start_time;

                if (!sessionStartTime) {
                    return res.status(400).json({
                        error: 'Attendance session has not been started'
                    });
                }

                const hoursSinceStart =
                    (Date.now() - new Date(sessionStartTime).getTime()) /
                    (1000 * 60 * 60);

                if (hoursSinceStart > 24) {
                    return res.status(400).json({
                        error: 'Attendance can only be corrected within 24 hours of the session'
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
const courseResult = await pool.query(
    `SELECT course_id
     FROM sessions
     WHERE session_id = $1`,
    [sessionId]
);

const courseId = courseResult.rows[0].course_id;

await checkAttendanceAlert(studentId, courseId);

        return res.status(201).json({
            message: 'Attendance marked manually',
            attendance: result.rows[0]
        });

    } catch (error) {
    console.error('Manual attendance error:', error);

    if (error.code === '23505') {
        return res.status(409).json({
            error: 'Attendance has already been marked for this student in this session.'
        });
    }

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
export const markAttendanceByFingerprint = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { fingerprintId } = req.body;

        if (!fingerprintId) {
            return res.status(400).json({
                error: 'Fingerprint ID is required'
            });
        }

        const sessionResult = await pool.query(
            `SELECT session_id, course_id, session_status
            FROM sessions
            WHERE session_id = $1`,
            [sessionId]
        );
        if (sessionResult.rows.length === 0) {
            return res.status(404).json({
                error: 'Session not found'
            });
        }

        if (sessionResult.rows[0].session_status !== 'active') {
            return res.status(400).json({
                error: 'Attendance session is not active'
            });
        }

        const studentResult = await pool.query(
            `SELECT student_id, student_name, fingerprint_id
             FROM students
             WHERE fingerprint_id = $1`,
            [fingerprintId]
        );

        if (studentResult.rows.length === 0) {
            return res.status(404).json({
                error: 'No student found for this fingerprint'
            });
        }

        const student = studentResult.rows[0];

        const existingResult = await pool.query(
            `SELECT attendance_id
             FROM attendance_records
             WHERE session_id = $1 AND student_id = $2`,
            [sessionId, student.student_id]
        );

        if (existingResult.rows.length > 0) {
            return res.status(409).json({
                error: 'Attendance has already been marked for this student'
            });
        }

        const result = await pool.query(
            `INSERT INTO attendance_records
                (session_id, student_id, status, marked_at)
             VALUES
                ($1, $2, 'present', NOW())
             RETURNING *`,
            [sessionId, student.student_id]
        );
       await checkAttendanceAlert(
            student.student_id,
            sessionResult.rows[0].course_id
        );
        return res.status(201).json({
            message: 'Fingerprint attendance marked successfully',
            student: {
                student_id: student.student_id,
                student_name: student.student_name,
                fingerprint_id: student.fingerprint_id
            },
            attendance: result.rows[0]
        });

    
}
    
    catch (error) {
        console.error('Fingerprint attendance error:', error);

        return res.status(500).json({
            error: 'Internal server error'
        });
    }

};