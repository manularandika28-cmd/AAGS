import express from 'express';
import {
    getLecturerDashboard,
    getLecturerSessions,
    getSessionAttendance,
    markAttendanceManually,
    markAttendanceByFingerprint,
    startAttendanceSession,
    endAttendanceSession
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
router.post(
    '/sessions/:sessionId/attendance/fingerprint',
    verifyToken,
    authorize('Lecturer'),
    markAttendanceByFingerprint
);
router.post(
    '/sessions/:sessionId/start',
    verifyToken,
    authorize('Lecturer'),
    startAttendanceSession
);
router.post(
    '/sessions/:sessionId/end',
    verifyToken,
    authorize('Lecturer'),
    endAttendanceSession
);

export default router;