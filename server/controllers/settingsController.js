import bcrypt from 'bcrypt';
import { pool } from '../db.js';
import { supabase } from '../config/supabase.js';

/*
 * Get the table/key/name column belonging to the authenticated role.
 */
const getUserTable = (role) => {
    switch (role) {
        case 'Student':
            return {
                table: 'students',
                idColumn: 'student_id',
                nameColumn: 'student_name',
            };

        case 'Lecturer':
            return {
                table: 'lecturers',
                idColumn: 'lecturer_id',
                nameColumn: 'name',
            };

        case 'HOD':
            return {
                table: 'hods',
                idColumn: 'hod_id',
                nameColumn: 'name',
            };

        case 'Dean':
            return {
                table: 'deans',
                idColumn: 'dean_id',
                nameColumn: 'name',
            };

        case 'Admin':
            return {
                table: 'admins',
                idColumn: 'admin_id',
                nameColumn: 'admin_name',
            };

        default:
            return null;
    }
};


/*
 * GET /api/settings/profile
 */
export const getProfile = async (req, res) => {
    try {
        const config = getUserTable(req.user.role);

        if (!config) {
            return res.status(400).json({
                error: 'Unsupported user role',
            });
        }

        const { table, idColumn, nameColumn } = config;

        let query;
        const params = [req.user.userId];

        /*
         * Students have department information.
         */
        if (req.user.role === 'Student') {
            query = `
                SELECT
                    s.student_id AS user_id,
                    s.student_name AS name,
                    s.email,
                    s.profile_picture_url,
                    s.is_active,
                    s.created_at,
                    s.department_id,
                    d.dep_name AS department_name
                FROM ${table} s
                LEFT JOIN departments d
                    ON s.department_id = d.department_id
                WHERE s.${idColumn} = $1
            `;
        }

        /*
         * Lecturers have department information.
         */
        else if (req.user.role === 'Lecturer') {
            query = `
                SELECT
                    l.lecturer_id AS user_id,
                    l.name,
                    l.email,
                    l.profile_picture_url,
                    l.is_active,
                    l.created_at,
                    l.department_id,
                    d.dep_name AS department_name
                FROM ${table} l
                LEFT JOIN departments d
                    ON l.department_id = d.department_id
                WHERE l.${idColumn} = $1
            `;
        }

        /*
         * HOD / Dean / Admin.
         */
        else {
            query = `
                SELECT
                    ${idColumn} AS user_id,
                    ${nameColumn} AS name,
                    email,
                    profile_picture_url,
                    is_active,
                    created_at
                FROM ${table}
                WHERE ${idColumn} = $1
            `;
        }

        const result = await pool.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'User profile not found',
            });
        }

        const profile = result.rows[0];

        /*
         * Student academic information.
         */
        if (req.user.role === 'Student') {
            const academicResult = await pool.query(
                `
                SELECT
                    c.course_id,
                    c.course_code,
                    c.course_name,
                    c.credit,
                    c.semester,
                    c.academic_year
                FROM enrollments e
                INNER JOIN courses c
                    ON e.course_id = c.course_id
                WHERE e.student_id = $1
                ORDER BY
                    c.academic_year,
                    c.semester,
                    c.course_code
                `,
                [req.user.userId]
            );

            profile.courses = academicResult.rows;
        }

        /*
         * Preferences.
         */
        const preferencesResult = await pool.query(
            `
            SELECT
                notifications_enabled,
                theme,
                language,
                timezone
            FROM user_preferences
            WHERE role = $1
              AND user_id = $2
            `,
            [req.user.role, req.user.userId]
        );

        if (preferencesResult.rows.length === 0) {
            await pool.query(
                `
                INSERT INTO user_preferences
                    (role, user_id)
                VALUES
                    ($1, $2)
                ON CONFLICT (role, user_id)
                DO NOTHING
                `,
                [req.user.role, req.user.userId]
            );

            profile.preferences = {
                notifications_enabled: true,
                theme: 'dark',
                language: 'English',
                timezone: 'Asia/Colombo',
            };
        } else {
            profile.preferences = preferencesResult.rows[0];
        }

        profile.role = req.user.role;

        return res.json(profile);

    } catch (error) {
        console.error('Get profile error:', error);

        return res.status(500).json({
            error: 'Failed to load profile',
        });
    }
};


/*
 * PATCH /api/settings/profile
 */
export const updateProfile = async (req, res) => {
    try {
        const config = getUserTable(req.user.role);

        if (!config) {
            return res.status(400).json({
                error: 'Unsupported user role',
            });
        }

        const { table, idColumn, nameColumn } = config;

        const { name, email } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                error: 'Name is required',
            });
        }

        if (!email || !email.trim()) {
            return res.status(400).json({
                error: 'Email is required',
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        /*
         * Check whether another account already uses the email.
         */
        const emailCheck = await pool.query(
            `
            SELECT ${idColumn}
            FROM ${table}
            WHERE LOWER(email) = LOWER($1)
              AND ${idColumn} <> $2
            LIMIT 1
            `,
            [
                normalizedEmail,
                req.user.userId,
            ]
        );

        if (emailCheck.rows.length > 0) {
            return res.status(409).json({
                error: 'This email address is already in use',
            });
        }

        const result = await pool.query(
            `
            UPDATE ${table}
            SET
                ${nameColumn} = $1,
                email = $2
            WHERE ${idColumn} = $3
            RETURNING
                ${idColumn} AS user_id,
                ${nameColumn} AS name,
                email
            `,
            [
                name.trim(),
                normalizedEmail,
                req.user.userId,
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'User not found',
            });
        }

        return res.json({
            message: 'Profile updated successfully',
            profile: {
                ...result.rows[0],
                role: req.user.role,
            },
        });

    } catch (error) {
        console.error('Update profile error:', error);

        return res.status(500).json({
            error: 'Failed to update profile',
        });
    }
};


/*
 * PATCH /api/settings/profile-picture
 *
 * Uploads/replaces the authenticated user's profile picture.
 *
 * Storage structure:
 *
 * profile-pictures/
 *     student/
 *         123
 *     lecturer/
 *         456
 *     hod/
 *         789
 *     dean/
 *         10
 *     admin/
 *         20
 *
 * The same path is reused for the same user.
 * upsert: true means a new picture replaces the old one.
 */
export const updateProfilePicture = async (req, res) => {
    try {
        const config = getUserTable(req.user.role);

        if (!config) {
            return res.status(400).json({
                error: 'Unsupported user role',
            });
        }

        if (!req.file) {
            return res.status(400).json({
                error: 'Profile picture is required',
            });
        }

        const userId = req.user.userId;

        /*
         * Determine the correct extension.
         */
        const extensionMap = {
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/webp': 'webp',
        };

        const extension =
            extensionMap[req.file.mimetype];

        if (!extension) {
            return res.status(400).json({
                error:
                    'Only JPEG, PNG and WebP images are allowed',
            });
        }

        const folder =
            req.user.role.toLowerCase();

        /*
         * New fixed path WITH extension.
         *
         * Example:
         *
         * profile-pictures/
         * └── admin/
         *     └── 1.jpg
         */
        const filePath =
            `${folder}/${userId}.${extension}`;

        console.log('\n================================');
        console.log('PROFILE PICTURE UPDATE');
        console.log('Role:', req.user.role);
        console.log('User ID:', userId);
        console.log('Original file:', req.file.originalname);
        console.log('MIME:', req.file.mimetype);
        console.log('Size:', req.file.size);
        console.log('New path:', filePath);
        console.log('================================');

        /*
         * Remove old possible files.
         *
         * This removes:
         *
         * admin/1
         * admin/1.jpg
         * admin/1.png
         * admin/1.webp
         *
         * This makes sure only the latest picture remains.
         */
        const oldPaths = [
            `${folder}/${userId}`,
            `${folder}/${userId}.jpg`,
            `${folder}/${userId}.png`,
            `${folder}/${userId}.webp`,
        ];

        const {
            error: removeError,
        } = await supabase.storage
            .from('profile-pictures')
            .remove(oldPaths);

        if (removeError) {
            console.warn(
                'Old profile picture removal warning:',
                removeError
            );
        } else {
            console.log(
                'Old profile picture objects removed.'
            );
        }

        /*
         * Upload the new image.
         */
        const {
            data: uploadData,
            error: uploadError,
        } = await supabase.storage
            .from('profile-pictures')
            .upload(
                filePath,
                req.file.buffer,
                {
                    contentType: req.file.mimetype,
                    cacheControl: '0',
                    upsert: false,
                }
            );

        if (uploadError) {
            console.error(
                'SUPABASE UPLOAD ERROR:',
                uploadError
            );

            return res.status(500).json({
                error:
                    uploadError.message ||
                    'Failed to upload profile picture',
            });
        }

        console.log(
            'NEW SUPABASE OBJECT:',
            uploadData
        );

        /*
         * Generate public URL.
         */
        const {
            data: publicUrlData,
        } = supabase.storage
            .from('profile-pictures')
            .getPublicUrl(filePath);

        const profilePictureUrl =
            publicUrlData.publicUrl;

        console.log(
            'NEW PUBLIC URL:',
            profilePictureUrl
        );

        /*
         * Save new URL to PostgreSQL.
         */
        const result = await pool.query(
            `
            UPDATE ${config.table}
            SET profile_picture_url = $1
            WHERE ${config.idColumn} = $2
            RETURNING profile_picture_url
            `,
            [
                profilePictureUrl,
                userId,
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'User not found',
            });
        }

        console.log(
            'DATABASE UPDATED:',
            result.rows[0].profile_picture_url
        );

        return res.json({
            message:
                'Profile picture updated successfully',

            profile_picture_url:
                result.rows[0].profile_picture_url,
        });

    } catch (error) {
        console.error(
            'PROFILE PICTURE UPDATE ERROR:',
            error
        );

        return res.status(500).json({
            error:
                error.message ||
                'Failed to update profile picture',
        });
    }
};


/*
 * PATCH /api/settings/preferences
 */
export const updatePreferences = async (req, res) => {
    try {
        const {
            notifications_enabled,
            theme,
            language,
            timezone,
        } = req.body;

        const validThemes = [
            'dark',
            'light',
            'system',
        ];

        const validLanguages = [
            'English',
            'Sinhala',
            'Tamil',
        ];

        if (
            theme !== undefined &&
            !validThemes.includes(theme)
        ) {
            return res.status(400).json({
                error: 'Invalid theme',
            });
        }

        if (
            language !== undefined &&
            !validLanguages.includes(language)
        ) {
            return res.status(400).json({
                error: 'Invalid language',
            });
        }

        await pool.query(
            `
            INSERT INTO user_preferences (
                role,
                user_id,
                notifications_enabled,
                theme,
                language,
                timezone
            )
            VALUES ($1, $2, $3, $4, $5, $6)

            ON CONFLICT (role, user_id)
            DO UPDATE SET

                notifications_enabled =
                    COALESCE(
                        EXCLUDED.notifications_enabled,
                        user_preferences.notifications_enabled
                    ),

                theme =
                    COALESCE(
                        EXCLUDED.theme,
                        user_preferences.theme
                    ),

                language =
                    COALESCE(
                        EXCLUDED.language,
                        user_preferences.language
                    ),

                timezone =
                    COALESCE(
                        EXCLUDED.timezone,
                        user_preferences.timezone
                    ),

                updated_at = now()
            `,
            [
                req.user.role,
                req.user.userId,
                notifications_enabled ?? true,
                theme ?? 'dark',
                language ?? 'English',
                timezone ?? 'Asia/Colombo',
            ]
        );

        const result = await pool.query(
            `
            SELECT
                notifications_enabled,
                theme,
                language,
                timezone
            FROM user_preferences
            WHERE role = $1
              AND user_id = $2
            `,
            [
                req.user.role,
                req.user.userId,
            ]
        );

        return res.json({
            message:
                'Preferences updated successfully',

            preferences:
                result.rows[0],
        });

    } catch (error) {
        console.error(
            'Update preferences error:',
            error
        );

        return res.status(500).json({
            error:
                'Failed to update preferences',
        });
    }
};


/*
 * PATCH /api/settings/password
 */
export const changePassword = async (req, res) => {
    try {
        const config = getUserTable(req.user.role);

        if (!config) {
            return res.status(400).json({
                error: 'Unsupported user role',
            });
        }

        const {
            currentPassword,
            newPassword,
        } = req.body;

        if (
            !currentPassword ||
            !newPassword
        ) {
            return res.status(400).json({
                error:
                    'Current password and new password are required',
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                error:
                    'New password must be at least 8 characters',
            });
        }

        const result = await pool.query(
            `
            SELECT password_hash
            FROM ${config.table}
            WHERE ${config.idColumn} = $1
            `,
            [req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'User not found',
            });
        }

        const passwordMatches =
            await bcrypt.compare(
                currentPassword,
                result.rows[0].password_hash
            );

        if (!passwordMatches) {
            return res.status(401).json({
                error:
                    'Current password is incorrect',
            });
        }

        const newHash =
            await bcrypt.hash(
                newPassword,
                10
            );

        await pool.query(
            `
            UPDATE ${config.table}
            SET password_hash = $1
            WHERE ${config.idColumn} = $2
            `,
            [
                newHash,
                req.user.userId,
            ]
        );

        return res.json({
            message:
                'Password changed successfully',
        });

    } catch (error) {
        console.error(
            'Change password error:',
            error
        );

        return res.status(500).json({
            error:
                'Failed to change password',
        });
    }
};