import express from 'express';
import { login, refreshToken, register, logout } from '../controllers/authController.js';
import { forgotPassword, resetPassword } from '../controllers/passwordResetController.js';

const router = express.Router();

router.post('/login', login);
router.get('/refresh', refreshToken);
router.post('/register', register);
router.post('/logout', logout);



export default router;