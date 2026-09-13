import { pool } from '../db.js';
import bcrypt from 'bcrypt';
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
export const getDashboardStats = async (req, res) => {
    try {
        const studentCount = await pool.query(`
            SELECT COUNT(*)
            FROM students
            WHERE is_active = true
        `);

        const lecturerCount = await pool.query(`
            SELECT COUNT(*)
            FROM lecturers
            WHERE is_active = true
        `);

        const hodCount = await pool.query(`
            SELECT COUNT(*)
            FROM hods
        `);

        const deanCount = await pool.query(`
            SELECT COUNT(*)
            FROM deans
        `);

        const adminCount = await pool.query(`
            SELECT COUNT(*)
            FROM admins
        `);

        const pendingStudents = await pool.query(`
            SELECT COUNT(*)
            FROM students
            WHERE is_active = false
        `);

        const pendingLecturers = await pool.query(`
            SELECT COUNT(*)
            FROM lecturers
            WHERE is_active = false
        `);

        const totalActiveUsers =
            parseInt(studentCount.rows[0].count) +
            parseInt(lecturerCount.rows[0].count) +
            parseInt(hodCount.rows[0].count) +
            parseInt(deanCount.rows[0].count) +
            parseInt(adminCount.rows[0].count);

        const pendingUsers =
            parseInt(pendingStudents.rows[0].count) +
            parseInt(pendingLecturers.rows[0].count);

        const userListResult = await pool.query(`
            SELECT
                student_id AS id,
                student_name AS name,
                email,
                'Student' AS role,
                is_active,
                created_at
            FROM students

            UNION ALL

            SELECT
                lecturer_id AS id,
                name,
                email,
                'Lecturer' AS role,
                is_active,
                created_at
            FROM lecturers

            UNION ALL

            SELECT
                hod_id AS id,
                name,
                email,
                'HOD' AS role,
                true AS is_active,
                created_at
            FROM hods

            UNION ALL

            SELECT
                dean_id AS id,
                name,
                email,
                'Dean' AS role,
                true AS is_active,
                created_at
            FROM deans

            UNION ALL

            SELECT
                admin_id AS id,
                admin_name AS name,
                email,
                'Admin' AS role,
                true AS is_active,
                created_at
            FROM admins

            ORDER BY created_at DESC
            
        `);

        return res.status(200).json({
            totalActiveUsers,

            systemAdminsCount: parseInt(
                adminCount.rows[0].count
            ),

            pendingUsers,

            roleCounts: {
                Student: parseInt(studentCount.rows[0].count),
                Lecturer: parseInt(lecturerCount.rows[0].count),
                HOD: parseInt(hodCount.rows[0].count),
                Dean: parseInt(deanCount.rows[0].count),
                Admin: parseInt(adminCount.rows[0].count)
            },

            userList: userListResult.rows
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);

        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};
export const addUser = async (req, res) => {
    const client = await pool.connect();

    try {
        const {
            name,
            email,
            password,
            role,
            department_id,
            dean_id,
            lecturer_id
        } = req.body;

        // Basic validation
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                error: 'Name, email, password and role are required'
            });
        }

        const allowedRoles = [
            'Admin',
            'Dean',
            'HOD',
            'Lecturer',
            'Student'
        ];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                error: 'Invalid role'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: 'Password must be at least 6 characters'
            });
        }

        // Check whether email already exists
        const emailCheck = await pool.query(
            `
            SELECT email FROM admins WHERE LOWER(email) = LOWER($1)
            UNION
            SELECT email FROM deans WHERE LOWER(email) = LOWER($1)
            UNION
            SELECT email FROM hods WHERE LOWER(email) = LOWER($1)
            UNION
            SELECT email FROM lecturers WHERE LOWER(email) = LOWER($1)
            UNION
            SELECT email FROM students WHERE LOWER(email) = LOWER($1)
            `,
            [email.trim()]
        );

        if (emailCheck.rows.length > 0) {
            return res.status(409).json({
                error: 'A user with this email already exists'
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await client.query('BEGIN');

        // Get role ID from roles table
        const roleResult = await client.query(
            `SELECT role_id FROM roles WHERE role_name = $1`,
            [role]
        );

        if (roleResult.rows.length === 0) {
            await client.query('ROLLBACK');

            return res.status(400).json({
                error: 'Role not found in database'
            });
        }

        const roleId = roleResult.rows[0].role_id;

        /*
         * The currently logged-in admin should ideally come
         * from authentication middleware.
         *
         * For now, use the admin ID supplied by the frontend
         * only if your current authentication system does not
         * yet expose req.user.
         */
        const registeredBy = req.user?.id || 1;

        let result;

        // -------------------------
        // ADMIN
        // -------------------------
        if (role === 'Admin') {

            result = await client.query(
                `
                INSERT INTO admins
                    (admin_name, email, password_hash, role_id)
                VALUES
                    ($1, $2, $3, $4)
                RETURNING
                    admin_id AS id,
                    admin_name AS name,
                    email,
                    role_id,
                    created_at
                `,
                [
                    name.trim(),
                    email.trim(),
                    passwordHash,
                    roleId
                ]
            );
        }

        // -------------------------
        // DEAN
        // -------------------------
        else if (role === 'Dean') {

            result = await client.query(
                `
                INSERT INTO deans
                    (name, email, password_hash, role_id, registered_by)
                VALUES
                    ($1, $2, $3, $4, $5)
                RETURNING
                    dean_id AS id,
                    name,
                    email,
                    role_id,
                    created_at
                `,
                [
                    name.trim(),
                    email.trim(),
                    passwordHash,
                    roleId,
                    registeredBy
                ]
            );
        }

        // -------------------------
        // HOD
        // -------------------------
        else if (role === 'HOD') {

            if (!lecturer_id) {
                await client.query('ROLLBACK');

                return res.status(400).json({
                    error: 'A lecturer must be selected for an HOD'
                });
            }

            result = await client.query(
                `
                INSERT INTO hods
                    (
                        name,
                        email,
                        password_hash,
                        lecturer_id,
                        dean_id,
                        role_id,
                        registered_by
                    )
                VALUES
                    ($1, $2, $3, $4, $5, $6, $7)
                RETURNING
                    hod_id AS id,
                    name,
                    email,
                    role_id,
                    created_at
                `,
                [
                    name.trim(),
                    email.trim(),
                    passwordHash,
                    lecturer_id,
                    dean_id || null,
                    roleId,
                    registeredBy
                ]
            );
        }

        // -------------------------
        // LECTURER
        // -------------------------
        else if (role === 'Lecturer') {

            result = await client.query(
                `
                INSERT INTO lecturers
                    (
                        name,
                        email,
                        password_hash,
                        is_active,
                        department_id,
                        role_id,
                        registered_by
                    )
                VALUES
                    ($1, $2, $3, true, $4, $5, $6)
                RETURNING
                    lecturer_id AS id,
                    name,
                    email,
                    is_active,
                    department_id,
                    role_id,
                    created_at
                `,
                [
                    name.trim(),
                    email.trim(),
                    passwordHash,
                    department_id || null,
                    roleId,
                    registeredBy
                ]
            );
        }

        // -------------------------
        // STUDENT
        // -------------------------
        else if (role === 'Student') {

            result = await client.query(
                `
                INSERT INTO students
                    (
                        student_name,
                        email,
                        password_hash,
                        is_active,
                        department_id,
                        role_id,
                        registered_by
                    )
                VALUES
                    ($1, $2, $3, true, $4, $5, $6)
                RETURNING
                    student_id AS id,
                    student_name AS name,
                    email,
                    is_active,
                    department_id,
                    role_id,
                    created_at
                `,
                [
                    name.trim(),
                    email.trim(),
                    passwordHash,
                    department_id || null,
                    roleId,
                    registeredBy
                ]
            );
        }

        await client.query('COMMIT');

        return res.status(201).json({
            message: `${role} created successfully`,
            user: {
                ...result.rows[0],
                role
            }
        });

    } catch (error) {

        await client.query('ROLLBACK');

        console.error('Add user error:', error);

        // PostgreSQL unique constraint
        if (error.code === '23505') {
            return res.status(409).json({
                error: 'A user with this email already exists'
            });
        }

        // PostgreSQL foreign-key error
        if (error.code === '23503') {
            return res.status(400).json({
                error: 'Invalid department, dean, lecturer or administrator reference'
            });
        }

        return res.status(500).json({
            error: 'Internal server error'
        });

    } finally {
        client.release();
    }
};