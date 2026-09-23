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
                    WHEN 'Student' THEN (SELECT COUNT(*) FROM students)
                    WHEN 'Lecturer' THEN (SELECT COUNT(*) FROM lecturers)
                    WHEN 'HOD' THEN (SELECT COUNT(*) FROM hods)
                    WHEN 'Dean' THEN (SELECT COUNT(*) FROM deans)
                    WHEN 'Admin' THEN (SELECT COUNT(*) FROM admins)
                    ELSE 0 
                END AS user_count 
            FROM roles r 
            ORDER BY r.role_id 
        `);

        return res.status(200).json(result.rows);
    } catch (error) {
        console.error('Get roles error:', error);
        return res.status(500).json({ error: 'Internal server error' });
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
    HOD: `SELECT hod_id AS id, name, email, is_active FROM hods`,
    Dean: `SELECT dean_id AS id, name, email, is_active FROM deans`,
    Admin: `SELECT admin_id AS id, admin_name AS name, email, is_active FROM admins`,
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

    if (!['Student', 'Lecturer', 'HOD', 'Dean', 'Admin'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
    }

    if (typeof is_active !== 'boolean') {
        return res.status(400).json({
            error: 'is_active must be true or false'
        });
    }

    try {
        const tableMap = {
    Student: 'students',
    Lecturer: 'lecturers',
    HOD: 'hods',
    Dean: 'deans',
    Admin: 'admins',
};

const idColumnMap = {
    Student: 'student_id',
    Lecturer: 'lecturer_id',
    HOD: 'hod_id',
    Dean: 'dean_id',
    Admin: 'admin_id',
};

const table = tableMap[role];
const idColumn = idColumnMap[role];

if (role === 'Admin') {
    const currentAdminId = req.user?.userId;

    // Prevent an Admin from deactivating their own account
    if (String(id) === String(currentAdminId)) {
        return res.status(403).json({
            error: 'You cannot deactivate your own Admin account'
        });
    }

    // Prevent the last active Admin from being deactivated
    if (is_active === false) {
        const adminCountResult = await pool.query(
            `
            SELECT COUNT(*) AS count
            FROM admins
            WHERE is_active = TRUE
            `
        );

        const activeAdminCount = Number(adminCountResult.rows[0].count);

        if (activeAdminCount <= 1) {
            return res.status(403).json({
                error: 'The last active Admin cannot be deactivated'
            });
        }
    }
}if (role === 'Admin' && is_active === false) {
    const adminCountResult = await pool.query(
        `
        SELECT COUNT(*) AS count
        FROM admins
        WHERE is_active = TRUE
        `
    );

    const activeAdminCount = Number(adminCountResult.rows[0].count);

    if (activeAdminCount <= 1) {
        return res.status(403).json({
            error: 'The last active Admin cannot be deactivated'
        });
    }
}

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

    if (!['Student', 'Lecturer', 'HOD', 'Dean', 'Admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
}


    try {
        const tableMap = {
    Student: 'students',
    Lecturer: 'lecturers',
    HOD: 'hods',
    Dean: 'deans',
    Admin: 'admins',
};

const idColumnMap = {
    Student: 'student_id',
    Lecturer: 'lecturer_id',
    HOD: 'hod_id',
    Dean: 'dean_id',
    Admin: 'admin_id',
};

const table = tableMap[role];
const idColumn = idColumnMap[role];

if (role === 'Admin') {
    const currentAdminId = req.user?.userId;

    // Prevent an Admin from deleting their own account
    if (String(id) === String(currentAdminId)) {
        return res.status(403).json({
            error: 'You cannot delete your own Admin account'
        });
    }

    // Prevent deletion of the last active Admin
    const adminCountResult = await pool.query(
        `
        SELECT COUNT(*) AS count
        FROM admins
        WHERE is_active = TRUE
        `
    );

    const activeAdminCount = Number(adminCountResult.rows[0].count);

    if (activeAdminCount <= 1) {
        return res.status(403).json({
            error: 'The last active Admin cannot be deleted'
        });
    }
}

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
        : role === 'Admin'
            ? deletedUser.admin_name
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

export const getSystemConfiguration = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT config_id, config_value, description
            FROM system_configs
            ORDER BY config_id
        `);

        const settings = {
            minimumAttendance: '80',
            meetingDuration: '30',
            maxFileSize: '10',

            academicYear: '2026',
            semester: 'Semester 2',
            warningAttendance: '85',
            maximumLeave: '4',

            bookingNotice: '2',
            advanceBooking: '30',
            meetingReminder: '24',

            medicalExpiryReminder: '30',
            requireVerification: true,

            sessionTimeout: '30',
            maxLoginAttempts: '5',
            lockoutDuration: '15',
            mfaAdmins: true,

            emailNotifications: true,
            meetingNotifications: true,
            attendanceNotifications: true,
            medicalNotifications: true,

            systemName: 'Faculty Student Management System',
            timezone: 'Asia/Colombo',
            dateFormat: 'DD/MM/YYYY',
            maintenanceMode: false
        };

        result.rows.forEach((config) => {
            switch (config.config_id) {
                case 1:
                    settings.minimumAttendance = config.config_value;
                    break;
                case 4:
                    settings.academicYear = config.config_value;
                    break;
                case 5:
                    settings.semester = config.config_value;
                    break;
                case 6:
                    settings.warningAttendance = config.config_value;
                    break;
                case 7:
                    settings.maximumLeave = config.config_value;
                    break;
                case 8:
                    settings.bookingNotice = config.config_value;
                    break;
                case 9:
                    settings.advanceBooking = config.config_value;
                    break;
                case 10:
                    settings.meetingReminder = config.config_value;
                    break;
                case 11:
                    settings.medicalExpiryReminder = config.config_value;
                    break;
                case 12:
                    settings.requireVerification = config.config_value === 'true';
                    break;
                case 13:
                    settings.sessionTimeout = config.config_value;
                    break;
                case 14:
                    settings.maxLoginAttempts = config.config_value;
                    break;
                case 15:
                    settings.lockoutDuration = config.config_value;
                    break;
                case 16:
                    settings.mfaAdmins = config.config_value === 'true';
                    break;
                case 17:
                    settings.emailNotifications = config.config_value === 'true';
                    break;
                case 18:
                    settings.meetingNotifications = config.config_value === 'true';
                    break;
                case 19:
                    settings.attendanceNotifications = config.config_value === 'true';
                    break;
                case 20:
                    settings.medicalNotifications = config.config_value === 'true';
                    break;
                case 21:
                    settings.systemName = config.config_value;
                    break;
                case 22:
                    settings.timezone = config.config_value;
                    break;
                case 23:
                    settings.dateFormat = config.config_value;
                    break;
                case 24:
                    settings.maintenanceMode = config.config_value === 'true';
                    break;
                case 25:
                    settings.meetingDuration = config.config_value;
                    break;
            }
        });

        return res.status(200).json(settings);

    } catch (error) {
        console.error('Get system configuration error:', error);

        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};


export const updateSystemConfiguration = async (req, res) => {
    try {
        const settings = {
            1: req.body.minimumAttendance,
            4: req.body.academicYear,
            5: req.body.semester,
            6: req.body.warningAttendance,
            7: req.body.maximumLeave,

            8: req.body.bookingNotice,
            9: req.body.advanceBooking,
            10: req.body.meetingReminder,

            11: req.body.medicalExpiryReminder,
            12: req.body.requireVerification,

            13: req.body.sessionTimeout,
            14: req.body.maxLoginAttempts,
            15: req.body.lockoutDuration,
            16: req.body.mfaAdmins,

            17: req.body.emailNotifications,
            18: req.body.meetingNotifications,
            19: req.body.attendanceNotifications,
            20: req.body.medicalNotifications,

            21: req.body.systemName,
            22: req.body.timezone,
            23: req.body.dateFormat,
            24: req.body.maintenanceMode,

            25: req.body.meetingDuration
        };

        for (const [configId, value] of Object.entries(settings)) {
            await pool.query(
                `
                UPDATE system_configs
                SET
                    config_value = $1,
                    updated_by = $2,
                    updated_at = CURRENT_TIMESTAMP
                WHERE config_id = $3
                `,
                [
                    String(value),
                    req.user?.userId || req.user?.id || 1,
                    configId
                ]
            );
        }

        await pool.query(
            `
            INSERT INTO audit_logs
                (action, target, performed_by, ip_address, role, severity, module, details)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8)
            `,
            [
                'System configuration updated',
                'System Configuration',
                req.user?.userId || req.body?.userId || null,
                req.ip,
                'Admin',
                'Info',
                'System Configuration',
                'Global system configuration updated by Admin'
            ]
        );

        return res.status(200).json({
            message: 'System configuration updated successfully'
        });

    } catch (error) {
        console.error('Update system configuration error:', error);

        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};

