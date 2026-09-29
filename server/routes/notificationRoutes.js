import express from 'express';

import {
    getMyNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from '../controllers/notificationController.js';

import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getMyNotifications);

router.patch('/read-all', verifyToken, markAllNotificationsAsRead);

router.patch('/:notificationId/read', verifyToken, markNotificationAsRead);

export default router;