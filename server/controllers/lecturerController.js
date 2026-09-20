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