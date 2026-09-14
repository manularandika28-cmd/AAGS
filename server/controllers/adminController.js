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

        const approvedUser = result.rows[0];

        await pool.query(
            `
            INSERT INTO audit_logs
                (action, target, performed_by, ip_address, role, severity, module, details)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8)
            `,
            [
                'User approved',
                role === 'Student'
                    ? approvedUser.student_name
                    : approvedUser.name,
                req.body?.userId || null,
                req.ip,
                role,
                'Info',
                'User Management',
                `${role} account approved by Admin`
            ]
        );

        return res.status(200).json({
            message: 'User approved',
            user: approvedUser
        });

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

        const result = await pool.query(
            `SELECT * FROM ${table} WHERE ${idColumn} = $1 AND is_active = false`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Pending user not found' });
        }

        const rejectedUser = result.rows[0];

        await pool.query(
            `DELETE FROM ${table} WHERE ${idColumn} = $1 AND is_active = false`,
            [id]
        );

        const userName =
            role === 'Student'
                ? rejectedUser.student_name
                : rejectedUser.name;

        await pool.query(
            `
            INSERT INTO audit_logs
                (action, target, performed_by, ip_address, role, severity, module, details)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8)
            `,
            [
                'User rejected',
                userName,
                req.body?.userId || null,
                req.ip,
                role,
                'Warning',
                'User Management',
                `${role} account rejected and removed by Admin`
            ]
        );

        return res.status(200).json({
            message: 'User rejected and removed'
        });

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
export const getRoles = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                r.role_id,
                r.role_name,
                r.description,
                r.created_at,
                CASE r.role_name
                    WHEN 'Student' THEN (SELECT COUNT(*) FROM students WHERE role_id = r.role_id)
                    WHEN 'Lecturer' THEN (SELECT COUNT(*) FROM lecturers WHERE role_id = r.role_id)
                    WHEN 'HOD' THEN (SELECT COUNT(*) FROM hods WHERE role_id = r.role_id)
                    WHEN 'Dean' THEN (SELECT COUNT(*) FROM deans WHERE role_id = r.role_id)
                    WHEN 'Admin' THEN (SELECT COUNT(*) FROM admins WHERE role_id = r.role_id)
                    ELSE 0
                END AS user_count
            FROM roles r
            ORDER BY r.role_id
        `);

        return res.status(200).json(result.rows);

    } catch (error) {
        console.error('Fetch roles error:', error);

        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const getRolePermissions = async (req, res) => {
    const { roleId } = req.params;

    try {
        const result = await pool.query(`
            SELECT
                m.module_id,
                m.module_name,
                m.description,
                COALESCE(rp.can_view, false) AS can_view,
                COALESCE(rp.can_create, false) AS can_create,
                COALESCE(rp.can_delete, false) AS can_delete,
                COALESCE(rp.can_approve, false) AS can_approve
            FROM modules m
            LEFT JOIN role_permissions rp
                ON rp.module_id = m.module_id
                AND rp.role_id = $1
            ORDER BY m.module_id
        `, [roleId]);

        return res.status(200).json({
            permissions: result.rows
        });

    } catch (error) {
        console.error('Fetch role permissions error:', error);

        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const updateRolePermissions = async (req, res) => {
    const { roleId } = req.params;
    const { permissions } = req.body;

    if (!Array.isArray(permissions)) {
        return res.status(400).json({
            error: 'Permissions must be an array'
        });
    }

    const client = await pool.connect();

    try {
        /*
         * Find the role first.
         */
        const roleResult = await client.query(
            `
            SELECT role_id, role_name
            FROM roles
            WHERE role_id = $1
            `,
            [roleId]
        );

        if (roleResult.rows.length === 0) {
            return res.status(404).json({
                error: 'Role not found'
            });
        }

        const role = roleResult.rows[0];

        /*
         * Admin is a protected system role.
         *
         * This check is intentionally performed on the backend.
         * Disabling the buttons in React alone is not sufficient.
         */
        if (role.role_name === 'Admin') {
            return res.status(403).json({
                error: 'Admin permissions are protected and cannot be modified'
            });
        }

        await client.query('BEGIN');

        /*
         * Update each module permission.
         *
         * ON CONFLICT requires the database to have a unique
         * constraint on (role_id, module_id).
         */
        for (const permission of permissions) {
            const {
                module_id,
                can_view = false,
                can_create = false,
                can_delete = false,
                can_approve = false
            } = permission;

            await client.query(
                `
                INSERT INTO role_permissions
                (
                    role_id,
                    module_id,
                    can_view,
                    can_create,
                    can_delete,
                    can_approve
                )
                VALUES ($1, $2, $3, $4, $5, $6)

                ON CONFLICT (role_id, module_id)
                DO UPDATE SET
                    can_view = EXCLUDED.can_view,
                    can_create = EXCLUDED.can_create,
                    can_delete = EXCLUDED.can_delete,
                    can_approve = EXCLUDED.can_approve
                `,
                [
                    roleId,
                    module_id,
                    Boolean(can_view),
                    Boolean(can_create),
                    Boolean(can_delete),
                    Boolean(can_approve)
                ]
            );
        }

        await client.query(
    `
    INSERT INTO audit_logs
        (action, target, performed_by, ip_address, role, severity, module, details)
    VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8)
    `,
    [
        'Permissions updated',
        role.role_name,
        req.body?.userId || null,
        req.ip,
        'Admin',
        'Info',
        'Roles & Permissions',
        `Permissions updated for role "${role.role_name}"`
    ]
);

await client.query('COMMIT');

return res.status(200).json({
    message: 'Role permissions updated successfully'
});

    } catch (error) {
        await client.query('ROLLBACK');

        console.error(
            'Update role permissions error:',
            error
        );

        return res.status(500).json({
            error: 'Internal server error'
        });

    } finally {
        client.release();
    }
};
export const addRole = async (req, res) => {
    try {
        const { role_name, description } = req.body;

        if (!role_name || !role_name.trim()) {
            return res.status(400).json({
                error: 'Role name is required'
            });
        }

        if (!description || !description.trim()) {
            return res.status(400).json({
                error: 'Role description is required'
            });
        }

        const existingRole = await pool.query(
            `
            SELECT role_id
            FROM roles
            WHERE LOWER(role_name) = LOWER($1)
            `,
            [role_name.trim()]
        );

        if (existingRole.rows.length > 0) {
            return res.status(409).json({
                error: 'A role with this name already exists'
            });
        }

        const result = await pool.query(
            `
            INSERT INTO roles
                (role_name, description)
            VALUES
                ($1, $2)
            RETURNING
                role_id,
                role_name,
                description,
                created_at
            `,
            [
                role_name.trim(),
                description.trim()
            ]
        );

        const createdRole = result.rows[0];

        await pool.query(
            `
            INSERT INTO audit_logs
                (action, target, performed_by, ip_address, role, severity, module, details)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8)
            `,
            [
                'Role created',
                createdRole.role_name,
                req.body?.userId || null,
                req.ip,
                'Admin',
                'Info',
                'Roles & Permissions',
                `Role "${createdRole.role_name}" was created`
            ]
        );

        return res.status(201).json({
            message: 'Role created successfully',
            role: createdRole
        });

    } catch (error) {
        console.error('Add role error:', error);

        if (error.code === '23505') {
            return res.status(409).json({
                error: 'A role with this name already exists'
            });
        }

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

       const createdUser = result.rows[0];

await client.query(
    `
    INSERT INTO audit_logs
        (action, target, performed_by, ip_address, role, severity, module, details)
    VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8)
    `,
    [
        'User created',
        createdUser.name,
        registeredBy,
        req.ip,
        role,
        'Info',
        'User Management',
        `${role} account created by Admin`
    ]
);

await client.query('COMMIT');

return res.status(201).json({
    message: `${role} created successfully`,
    user: {
        ...createdUser,
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

export const getAuditLogs = async (req, res) => {
    try {
        const { startDate, endDate, role, severity, action } = req.query;

        const conditions = [];
        const values = [];

        if (startDate) {
            values.push(startDate);
            conditions.push(`created_at >= $${values.length}::date`);
        }

        if (endDate) {
            values.push(endDate);
            conditions.push(
                `created_at < ($${values.length}::date + INTERVAL '1 day')`
            );
        }

        if (role) {
            values.push(role);
            conditions.push(`role = $${values.length}`);
        }

        if (severity) {
            values.push(severity);
            conditions.push(`severity = $${values.length}`);
        }

        if (action) {
            values.push(action);
            conditions.push(`action = $${values.length}`);
        }

        const whereClause =
            conditions.length > 0
                ? `WHERE ${conditions.join(' AND ')}`
                : '';

        const result = await pool.query(
            `
            SELECT
                audit_id,
                action,
                target,
                performed_by,
                ip_address,
                created_at,
                role,
                severity,
                module,
                details
            FROM audit_logs
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT 100
            `,
            values
        );

        const logs = result.rows.map((log) => ({
            audit_id: log.audit_id,
            timestamp: log.created_at,
            user_name: log.target || 'Unknown User',
            action: log.action,
            module: log.module || 'System',
            details: log.details || '-',
            ip_address: log.ip_address,
            performed_by: log.performed_by,
            role: log.role || 'Unknown',
            severity: log.severity || 'Info'
        }));

        return res.status(200).json(logs);

    } catch (error) {
        console.error('Fetch audit logs error:', error);

        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const getUsersByRole = async (req, res) => {
    const { roleName } = req.params;

    const queries = {
        Student: `SELECT student_id AS id, student_name AS name, email, is_active FROM students`,
        Lecturer: `SELECT lecturer_id AS id, name, email, is_active FROM lecturers`,
        HOD: `SELECT hod_id AS id, name, email FROM hods`,
        Dean: `SELECT dean_id AS id, name, email FROM deans`,
        Admin: `SELECT admin_id AS id, admin_name AS name, email FROM admins`,
    };

    const query = queries[roleName];
    if (!query) {
        return res.status(400).json({ error: 'Invalid role name' });
    }

    try {
        const result = await pool.query(query);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error('Get users by role error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
export const updateUserStatus = async (req, res) => {
    const { role, id } = req.params;
    const { is_active } = req.body;

    if (!['Student', 'Lecturer'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
    }

    if (typeof is_active !== 'boolean') {
        return res.status(400).json({
            error: 'is_active must be true or false'
        });
    }

    try {
        const table = role === 'Student' ? 'students' : 'lecturers';
        const idColumn = role === 'Student' ? 'student_id' : 'lecturer_id';

        const result = await pool.query(
            `
            UPDATE ${table}
            SET is_active = $1
            WHERE ${idColumn} = $2
            RETURNING *
            `,
            [is_active, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        const updatedUser = result.rows[0];

        const userName =
            role === 'Student'
                ? updatedUser.student_name
                : updatedUser.name;

        const action = is_active
            ? 'User activated'
            : 'User deactivated';

        const details = is_active
            ? `${role} account activated by Admin`
            : `${role} account deactivated by Admin`;

        await pool.query(
            `
            INSERT INTO audit_logs
                (action, target, performed_by, ip_address, role, severity, module, details)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8)
            `,
            [
                action,
                userName,
                req.body?.userId || null,
                req.ip,
                role,
                is_active ? 'Info' : 'Warning',
                'User Management',
                details
            ]
        );

        return res.status(200).json({
            message: action,
            user: updatedUser
        });

    } catch (error) {
        console.error('Update user status error:', error);

        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};


export const deleteUser = async (req, res) => {
    const { role, id } = req.params;

    if (!['Student', 'Lecturer'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
    }

    try {
        const table = role === 'Student' ? 'students' : 'lecturers';
        const idColumn = role === 'Student' ? 'student_id' : 'lecturer_id';

        const result = await pool.query(
            `
            SELECT *
            FROM ${table}
            WHERE ${idColumn} = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        const deletedUser = result.rows[0];

        const userName =
            role === 'Student'
                ? deletedUser.student_name
                : deletedUser.name;

        await pool.query(
            `
            DELETE FROM ${table}
            WHERE ${idColumn} = $1
            `,
            [id]
        );

        await pool.query(
            `
            INSERT INTO audit_logs
                (action, target, performed_by, ip_address, role, severity, module, details)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8)
            `,
            [
                'User deleted',
                userName,
                req.body?.userId || null,
                req.ip,
                role,
                'Critical',
                'User Management',
                `${role} account deleted by Admin`
            ]
        );

        return res.status(200).json({
            message: 'User deleted successfully'
        });

    } catch (error) {
        console.error('Delete user error:', error);

        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const deleteRole = async (req, res) => {
    const { roleId } = req.params;

    try {
        const roleResult = await pool.query(
            `
            SELECT role_id, role_name
            FROM roles
            WHERE role_id = $1
            `,
            [roleId]
        );

        if (roleResult.rows.length === 0) {
            return res.status(404).json({
                error: 'Role not found'
            });
        }

        const role = roleResult.rows[0];

        if (role.role_name === 'Admin') {
            return res.status(403).json({
                error: 'The Admin role cannot be deleted'
            });
        }

        await pool.query(
            `DELETE FROM roles WHERE role_id = $1`,
            [roleId]
        );

        await pool.query(
            `
            INSERT INTO audit_logs
                (action, target, performed_by, ip_address, role, severity, module, details)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8)
            `,
            [
                'Role deleted',
                role.role_name,
                req.body?.userId || null,
                req.ip,
                'Admin',
                'Critical',
                'Roles & Permissions',
                `Role "${role.role_name}" was deleted by Admin`
            ]
        );

        return res.status(200).json({
            message: 'Role deleted successfully'
        });

    } catch (error) {
        console.error('Delete role error:', error);

        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};