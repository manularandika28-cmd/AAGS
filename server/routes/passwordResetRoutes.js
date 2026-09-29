// passwordResetRoutes.js
import express from 'express';
import { requestPasswordReset, resetPassword } from '../controllers/passwordResetController.js';
const router = express.Router();

router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

export default router;

// In your main app.js / server.js, mount alongside your existing auth routes:
//
//   const passwordResetRoutes = require('./routes/passwordResetRoutes');
//   app.use('/api/auth', passwordResetRoutes);
//
// This gives you:
//   POST /api/auth/forgot-password
//   POST /api/auth/reset-password
