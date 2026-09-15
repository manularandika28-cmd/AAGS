// server/routes/studentRoutes.js
import express from 'express';
import { getStudentDashboardData } from '../controllers/studentController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', verifyToken, getStudentDashboardData);

export default router;