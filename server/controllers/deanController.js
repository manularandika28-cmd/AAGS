import { pool } from '../db.js';

// ============================================================
// DEAN DASHBOARD STATISTICS
// ============================================================

export const getDeanDashboardStats = async (req, res) => {

    try {

        // ------------------------------------------------------
        // TOTAL STUDENTS
        // ------------------------------------------------------

        const totalStudentsResult =
            await pool.query(`
                SELECT COUNT(*) AS total
                FROM students
            `);

        // ------------------------------------------------------
        // FACULTY ATTENDANCE AVERAGE
        // ------------------------------------------------------

        const attendanceResult =
            await pool.query(`
                SELECT
                    COALESCE(
                        ROUND(
                            100.0 * SUM(
                                CASE
                                    WHEN LOWER(status::text) = 'present'
                                    THEN 1
                                    ELSE 0
                                END
                            )
                            /
                            NULLIF(COUNT(*), 0),
                            1
                        ),
                        0
                    ) AS average
                FROM attendance_records
            `);

        // ------------------------------------------------------
        // PENDING MEETING REQUESTS
        // ------------------------------------------------------

        const pendingApprovalsResult =
            await pool.query(`
                SELECT COUNT(*) AS total
                FROM dean_meeting_requests
                WHERE LOWER(status::text) = 'pending'
            `);

        // ------------------------------------------------------
        // RESPONSE
        // ------------------------------------------------------

        res.json({

            totalEnrolledStudents:
                Number(
                    totalStudentsResult.rows[0].total
                ),

            facultyAttendanceAverage:
                Number(
                    attendanceResult.rows[0].average
                ),

            pendingFinalApprovals:
                Number(
                    pendingApprovalsResult.rows[0].total
                )
        });

    } catch (error) {

        console.error(
            'Dean dashboard stats error:',
            error
        );

        res.status(500).json({
            error:
                'Failed to load Dean dashboard statistics',

            details:
                error.message
        });
    }
};


// ============================================================
// GET DEAN MEETING REQUESTS
// ============================================================

export const getDeanMeetingRequests = async (
    req,
    res
) => {

    try {

        const {
            status = 'pending'
        } = req.query;

        // ------------------------------------------------------
        // BASE QUERY
        //
        // Only Lecturer and HOD requests are shown.
        // Student requests are NOT included.
        // ------------------------------------------------------

        let query = `
            SELECT

                dmr.request_id,

                dmr.dean_id,

                dmr.requester_type,

                dmr.preferred_date,

                dmr.preferred_time,

                dmr.purpose,

                dmr.response,

                dmr.confirmed_date,

                dmr.confirmed_time,

                dmr.location,

                dmr.status,

                dmr.created_at,

                dmr.updated_at,

                -- Requester name
                CASE

                    WHEN dmr.requester_type = 'Lecturer'
                    THEN l.name

                    WHEN dmr.requester_type = 'HOD'
                    THEN h.name

                    ELSE NULL

                END AS requester_name,

                -- Requester email
                CASE

                    WHEN dmr.requester_type = 'Lecturer'
                    THEN l.email

                    WHEN dmr.requester_type = 'HOD'
                    THEN h.email

                    ELSE NULL

                END AS requester_email,

                -- Requester role
                CASE

                    WHEN dmr.requester_type = 'Lecturer'
                    THEN 'Lecturer'

                    WHEN dmr.requester_type = 'HOD'
                    THEN 'HOD'

                    ELSE dmr.requester_type

                END AS requester_role,

                -- Lecturer information
                l.email AS lecturer_email,

                l.name AS lecturer_name,

                -- HOD information
                h.email AS hod_email,

                h.name AS hod_name

            FROM dean_meeting_requests dmr

            LEFT JOIN lecturers l
                ON dmr.lecturer_id = l.lecturer_id

            LEFT JOIN hods h
                ON dmr.hod_id = h.hod_id

            WHERE dmr.requester_type
                IN ('Lecturer', 'HOD')
        `;

        const values = [];

        // ------------------------------------------------------
        // FILTER BY STATUS
        //
        // /meeting-requests?status=pending
        // /meeting-requests?status=accepted
        // /meeting-requests?status=rejected
        // /meeting-requests?status=all
        // ------------------------------------------------------

        if (
            status &&
            status.toLowerCase() !== 'all'
        ) {

            query += `
                AND LOWER(dmr.status::text)
                    = LOWER($1)
            `;

            values.push(status);
        }

        // ------------------------------------------------------
        // ORDER
        // ------------------------------------------------------

        query += `
            ORDER BY

                dmr.preferred_date ASC,

                dmr.preferred_time ASC,

                dmr.created_at ASC
        `;

        // ------------------------------------------------------
        // DEBUG
        // ------------------------------------------------------

        console.log(
            'Dean meeting request query:',
            query
        );

        console.log(
            'Dean meeting request values:',
            values
        );

        // ------------------------------------------------------
        // EXECUTE
        // ------------------------------------------------------

        const result =
            await pool.query(
                query,
                values
            );

        console.log(
            'Dean meeting requests found:',
            result.rows.length
        );

        // ------------------------------------------------------
        // RESPONSE
        // ------------------------------------------------------

        res.json(
            result.rows
        );

    } catch (error) {

        console.error(
            'Dean meeting requests error:',
            error
        );

        res.status(500).json({

            error:
                'Failed to load meeting requests',

            details:
                error.message
        });
    }
};


// ============================================================
// UPDATE DEAN MEETING REQUEST
// ============================================================
//
// IMPORTANT DATABASE ENUM:
//
// pending
// accepted
// rejected
// cancelled
// completed
//
// Therefore:
// Approve button -> accepted
// Reject button  -> rejected
// ============================================================

export const updateDeanMeetingRequest = async (
    req,
    res
) => {

    try {

        const {
            requestId,
            status
        } = req.params;

        // ------------------------------------------------------
        // NORMALIZE STATUS
        // ------------------------------------------------------

        const newStatus =
            String(status).toLowerCase();

        // ------------------------------------------------------
        // ALLOWED STATUS VALUES FOR DEAN ACTION
        // ------------------------------------------------------

        const allowedStatuses = [
            'accepted',
            'rejected'
        ];

        // ------------------------------------------------------
        // VALIDATE STATUS
        // ------------------------------------------------------

        if (
            !allowedStatuses.includes(
                newStatus
            )
        ) {

            return res.status(400).json({

                error:
                    'Invalid status. Use accepted or rejected.'
            });
        }

        // ------------------------------------------------------
        // UPDATE DATABASE
        // ------------------------------------------------------

        const result =
            await pool.query(
                `
                UPDATE dean_meeting_requests

                SET

                    status = $1,

                    updated_at =
                        CURRENT_TIMESTAMP

                WHERE request_id = $2

                RETURNING

                    request_id,

                    dean_id,

                    requester_type,

                    preferred_date,

                    preferred_time,

                    purpose,

                    response,

                    confirmed_date,

                    confirmed_time,

                    location,

                    status,

                    created_at,

                    updated_at
                `,
                [
                    newStatus,
                    requestId
                ]
            );

        // ------------------------------------------------------
        // REQUEST NOT FOUND
        // ------------------------------------------------------

        if (
            result.rows.length === 0
        ) {

            return res.status(404).json({

                error:
                    'Meeting request not found'
            });
        }

        // ------------------------------------------------------
        // SUCCESS
        // ------------------------------------------------------

        res.json({

            message:
                `Meeting request ${newStatus} successfully`,

            request:
                result.rows[0]
        });

    } catch (error) {

        console.error(
            'Update Dean meeting request error:',
            error
        );

        res.status(500).json({

            error:
                'Failed to update meeting request',

            details:
                error.message
        });
    }
};