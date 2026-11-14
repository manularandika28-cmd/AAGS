import express from 'express';
import { verifyToken, authorize } from '../middleware/authMiddleware.js';
import {
  getHodMedicalQueue,
  updateHodMedicalStatus,
  getHodMedicalDocument,
  getHODDashboard,
  getHODMedicalReview,
  approveMedicalSubmission,
  rejectMedicalSubmission,
  getHODMeetings,
  createHODMeeting,
  updateHODMeeting
} from '../controllers/hodController.js';

const router = express.Router();

router.use(verifyToken, authorize('HOD'));

router.get('/dashboard', getHODDashboard);
router.get('/medicals', getHodMedicalQueue);
router.patch('/medicals/:submissionId/:action', updateHodMedicalStatus);
router.get('/medicals/:submissionId/document', getHodMedicalDocument);
router.get('/medical-review', getHODMedicalReview);
router.put('/medical-review/:id/approve', approveMedicalSubmission);
router.put('/medical-review/:id/reject', rejectMedicalSubmission);
router.get('/meetings', getHODMeetings);
router.post('/meetings', createHODMeeting);
router.patch('/meetings/:requestId', updateHODMeeting);

export default router;
