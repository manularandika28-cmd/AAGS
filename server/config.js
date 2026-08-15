import 'dotenv/config';

export const PORT = Number(process.env.PORT || 4000);
export const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
export const JWT_SECRET = process.env.JWT_SECRET || 'aags-development-secret-change-me';
export const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
export const ATTENDANCE_THRESHOLD = Number(process.env.ATTENDANCE_THRESHOLD || 75);
export const SESSION_MINUTES = Number(process.env.SESSION_MINUTES || 30);
export const DEMO_MODE = String(process.env.DEMO_MODE || 'true').toLowerCase() === 'true';
