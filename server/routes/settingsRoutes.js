import express from 'express';

import {
    getProfile,
    updateProfile,
    updatePreferences,
    changePassword,
    updateProfilePicture,
} from '../controllers/settingsController.js';

import { verifyToken } from '../middleware/authMiddleware.js';
import { uploadProfilePicture } from '../middleware/uploadMiddleware.js';

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

router.patch(
    '/profile-picture',
    verifyToken,
    uploadProfilePicture.single('profilePicture'),
    updateProfilePicture
);

export default router;