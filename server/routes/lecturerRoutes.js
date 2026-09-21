import express from 'express';
import {
    getLecturerDashboard,
    getLecturerSessions,
    getSessionAttendance,
    markAttendanceManually
} from '../controllers/lecturerController.js';
import { verifyToken, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get(
    '/dashboard',
    verifyToken,
    authorize('Lecturer'),
    getLecturerDashboard
);
router.get(
    '/sessions',
    verifyToken,
    authorize('Lecturer'),
    getLecturerSessions
);
router.get(
    '/sessions/:sessionId/attendance',
    verifyToken,
    authorize('Lecturer'),
    getSessionAttendance
);
router.post(
    '/sessions/:sessionId/attendance/manual',
    verifyToken,
    authorize('Lecturer'),
    markAttendanceManually
);

export default router;