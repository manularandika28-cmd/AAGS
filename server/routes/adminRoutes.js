import express from 'express';
import { getPendingUsers, approveUser, rejectUser } from '../controllers/adminController.js';

const router = express.Router();

router.get('/users/pending', getPendingUsers);
router.patch('/users/:role/:id/approve', approveUser);
router.delete('/users/:role/:id/reject', rejectUser);

export default router;