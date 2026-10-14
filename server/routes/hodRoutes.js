import express from 'express';
import { verifyToken, authorize } from '../middleware/authMiddleware.js';
import {
  getHodMedicalDocument,
  getHodMedicalQueue,
  updateHodMedicalStatus
} from '../controllers/hodController.js';

const router = express.Router();

router.use(verifyToken, authorize('HOD'));
router.get('/medicals', getHodMedicalQueue);
router.patch('/medicals/:submissionId/:action', updateHodMedicalStatus);
router.get('/medicals/:submissionId/document', getHodMedicalDocument);

export default router;