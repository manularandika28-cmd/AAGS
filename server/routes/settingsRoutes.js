import express from 'express';

import {
    getProfile,
    updateProfile,
    updatePreferences,
    changePassword,
} from '../controllers/settingsController.js';

import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get(
    '/profile',
    verifyToken,
    getProfile
);

router.patch(
    '/profile',
    verifyToken,
    updateProfile
);

router.patch(
    '/preferences',
    verifyToken,
    updatePreferences
);

router.patch(
    '/password',
    verifyToken,
    changePassword
);

export default router;