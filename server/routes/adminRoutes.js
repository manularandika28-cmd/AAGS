import express from 'express';
import { getPendingUsers, approveUser, rejectUser, getDashboardStats, addUser } from '../controllers/adminController.js';

const router = express.Router();

router.get('/users/pending', getPendingUsers);
router.patch('/users/:role/:id/approve', approveUser);
router.delete('/users/:role/:id/reject', rejectUser);
router.get('/dashboard-stats', getDashboardStats);
router.post('/users', addUser);
    
export default router;