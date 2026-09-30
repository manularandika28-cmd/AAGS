import express from 'express';

import {
    getHODDashboard,
    getHODMedicalReview,
    approveMedicalSubmission,
    rejectMedicalSubmission,
    getHODMeetings,
    createHODMeeting,
    updateHODMeeting
} from '../controllers/hodController.js';

import {
    verifyToken,
    authorize
} from '../middleware/authMiddleware.js';

const router = express.Router();

// ============================================================
// HOD DASHBOARD
// ============================================================

router.get(
    '/dashboard',
    verifyToken,
    authorize('HOD'),
    getHODDashboard
);

// ============================================================
// HOD MEDICAL REVIEW
// ============================================================

router.get(
    '/medical-review',
    verifyToken,
    authorize('HOD'),
    getHODMedicalReview
);

router.put(
    '/medical-review/:id/approve',
    verifyToken,
    authorize('HOD'),
    approveMedicalSubmission
);

router.put(
    '/medical-review/:id/reject',
    verifyToken,
    authorize('HOD'),
    rejectMedicalSubmission
);

// ============================================================
// HOD MEETINGS
// ============================================================

router.get(
    '/meetings',
    verifyToken,
    authorize('HOD'),
    getHODMeetings
);

router.post(
    '/meetings',
    verifyToken,
    authorize('HOD'),
    createHODMeeting
);

router.patch(
    '/meetings/:requestId',
    verifyToken,
    authorize('HOD'),
    updateHODMeeting
);

export default router;