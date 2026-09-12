import { pool } from '../db.js';

export const getPendingUsers = async (req, res) => {
    try {
        const students = await pool.query(
            `SELECT student_id AS id, student_name AS name, email, 'Student' AS role, created_at
             FROM students WHERE is_active = false`
        );

        const lecturers = await pool.query(
            `SELECT lecturer_id AS id, name, email, 'Lecturer' AS role, created_at
             FROM lecturers WHERE is_active = false`
        );

        const pending = [...students.rows, ...lecturers.rows].sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        return res.status(200).json(pending);
    } catch (error) {
        console.error('Fetch pending users error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const approveUser = async (req, res) => {
    const { role, id } = req.params;

    if (!['Student', 'Lecturer'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
    }

    try {
        const table = role === 'Student' ? 'students' : 'lecturers';
        const idColumn = role === 'Student' ? 'student_id' : 'lecturer_id';

        const result = await pool.query(
            `UPDATE ${table} SET is_active = true WHERE ${idColumn} = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ message: 'User approved', user: result.rows[0] });
    } catch (error) {
        console.error('Approve user error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const rejectUser = async (req, res) => {
    const { role, id } = req.params;

    if (!['Student', 'Lecturer'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
    }

    try {
        const table = role === 'Student' ? 'students' : 'lecturers';
        const idColumn = role === 'Student' ? 'student_id' : 'lecturer_id';

        await pool.query(
            `DELETE FROM ${table} WHERE ${idColumn} = $1 AND is_active = false`,
            [id]
        );

        return res.status(200).json({ message: 'User rejected and removed' });
    } catch (error) {
        console.error('Reject user error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};