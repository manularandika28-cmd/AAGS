import express from 'express';
import { getLecturerDashboard } from '../controllers/lecturerController.js';
import { verifyToken, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get(
    '/dashboard',
    verifyToken,
    authorize('Lecturer'),
    getLecturerDashboard
);

export default router;