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

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { 
  getStudentMedicals, 
  createMedicalSubmission 
} from '../controllers/studentcontroller.js';

import { getAcademicRecords } from '../controllers/studentcontroller.js';

// Setup file upload storage
const uploadDir = 'uploads/medicals';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `med-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const router = express.Router();

router.get('/dashboard', verifyToken, getStudentDashboardData);

router.get('/meetings/lecturers', verifyToken, getLecturersForBooking);
router.get('/meetings', verifyToken, getStudentMeetings);
router.post('/meetings', verifyToken, createMeetingRequest);
router.patch('/meetings/:requestId/cancel', verifyToken, cancelMeetingRequest);
router.get('/medicals', verifyToken, getStudentMedicals);
router.post('/medicals', verifyToken, upload.single('document'), createMedicalSubmission);
router.get('/academic-records', verifyToken, getAcademicRecords);

export default router;