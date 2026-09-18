// server/routes/studentRoutes.js
import express from 'express';
import { getStudentDashboardData } from '../controllers/studentController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
  getLecturersForBooking,
  getStudentMeetings,
  createMeetingRequest,
  cancelMeetingRequest
} from '../controllers/studentcontroller.js';

const router = express.Router();

router.get('/dashboard', verifyToken, getStudentDashboardData);

router.get('/meetings/lecturers', verifyToken, getLecturersForBooking);
router.get('/meetings', verifyToken, getStudentMeetings);
router.post('/meetings', verifyToken, createMeetingRequest);
router.patch('/meetings/:requestId/cancel', verifyToken, cancelMeetingRequest);

export default router;