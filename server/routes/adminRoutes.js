import express from 'express';
import { getPendingUsers, 
    approveUser,
     rejectUser, 
     getDashboardStats, 
     addUser, 
     getRoles, 
     addRole,
     getAuditLogs,
     getUsersByRole,
     getRolePermissions,
     updateRolePermissions

      
    } from '../controllers/adminController.js';

const router = express.Router();

router.get('/users/pending', getPendingUsers);
router.patch('/users/:role/:id/approve', approveUser);
router.delete('/users/:role/:id/reject', rejectUser);
router.get('/dashboard-stats', getDashboardStats);
router.post('/users', addUser);
router.get('/roles', getRoles);
router.post('/roles', addRole);
router.get('/roles/:roleId/permissions', getRolePermissions);
router.get('/audit-logs', getAuditLogs);
router.get('/users/role/:roleName', getUsersByRole);
router.get('/roles/:roleId/permissions', getRolePermissions);
router.put('/roles/:roleId/permissions', updateRolePermissions);

export default router;