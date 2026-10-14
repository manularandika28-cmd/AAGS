import { pool } from '../db.js';


const recipientConfig = {
    Student: {
        table: 'notification_students',
        idColumn: 'student_id',
    },
    Lecturer: {
        table: 'notification_lecturers',
        idColumn: 'lecturer_id',
    },
    HOD: {
        table: 'notification_hods',
        idColumn: 'hod_id',
    },
    Dean: {
        table: 'notification_deans',
        idColumn: 'dean_id',
    },
    Admin: {
        table: 'notification_admins',
        idColumn: 'admin_id',
    },
};

export const getMyNotifications = async (req, res) => {
    try {
        const { userId, role } = req.user;

        const config = recipientConfig[role];

        if (!config) {
            return res.status(400).json({
                error: 'Invalid user role',
            });
        }

        const query = `
            SELECT
                n.notification_id,
                n.title,
                n.message,
                
                n.created_at,
                r.received_at,
                r.is_read
            FROM notifications n
            INNER JOIN ${config.table} r
                ON r.notification_id = n.notification_id
            WHERE r.${config.idColumn} = $1
            ORDER BY n.created_at DESC
        `;

        const result = await pool.query(query, [userId]);

        const unreadCount = result.rows.filter(
            notification => !notification.is_read
        ).length;

        return res.status(200).json({
            notifications: result.rows,
            unreadCount,
        });

    } catch (error) {
        console.error('Get notifications error:', error);

        return res.status(500).json({
            error: 'Failed to fetch notifications',
        });
    }
};


export const markNotificationAsRead = async (req, res) => {
    try {
        const { userId, role } = req.user;
        const { notificationId } = req.params;

        const config = recipientConfig[role];

        if (!config) {
            return res.status(400).json({
                error: 'Invalid user role',
            });
        }

        const query = `
            UPDATE ${config.table}
            SET is_read = true,
                received_at = COALESCE(received_at, CURRENT_TIMESTAMP)
            WHERE notification_id = $1
              AND ${config.idColumn} = $2
            RETURNING notification_id
        `;

        const result = await pool.query(query, [
            notificationId,
            userId,
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Notification not found',
            });
        }

        return res.status(200).json({
            message: 'Notification marked as read',
        });

    } catch (error) {
        console.error('Mark notification as read error:', error);

        return res.status(500).json({
            error: 'Failed to update notification',
        });
    }
};


export const markAllNotificationsAsRead = async (req, res) => {
    try {
        const { userId, role } = req.user;

        const config = recipientConfig[role];

        if (!config) {
            return res.status(400).json({
                error: 'Invalid user role',
            });
        }

        await pool.query(
            `
            UPDATE ${config.table}
            SET is_read = true,
                received_at = COALESCE(received_at, CURRENT_TIMESTAMP)
            WHERE ${config.idColumn} = $1
              AND is_read = false
            `,
            [userId]
        );

        return res.status(200).json({
            message: 'All notifications marked as read',
        });

    } catch (error) {
        console.error('Mark all notifications error:', error);

        return res.status(500).json({
            error: 'Failed to update notifications',
        });
    }
};