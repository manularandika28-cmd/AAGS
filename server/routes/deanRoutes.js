import express from 'express';

import {
    verifyToken,
    authorize
} from '../middleware/authMiddleware.js';

import {
    getDeanDashboardStats,
    getDeanMeetingRequests,
    updateDeanMeetingRequest
} from '../controllers/deanController.js';

const router = express.Router();


// ============================================================
// DEAN DASHBOARD STATISTICS
// ============================================================
router.get(
    '/dashboard-stats',
    verifyToken,
    authorize('Dean'),
    getDeanDashboardStats
);


// ============================================================
// DEAN MEETING REQUESTS
// ============================================================
router.get(
    '/meeting-requests',
    verifyToken,
    authorize('Dean'),
    getDeanMeetingRequests
);


// ============================================================
// APPROVE / REJECT MEETING REQUEST
// ============================================================
router.patch(
    '/meeting-requests/:requestId/:status',
    verifyToken,
    authorize('Dean'),
    updateDeanMeetingRequest
);


export default router;