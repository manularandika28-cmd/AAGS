import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { pool } from './db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import passwordResetRoutes from './routes/passwordResetRoutes.js';
import hodRoutes from './routes/hodRoutes.js';
import lecturerRoutes from './routes/lecturerRoutes.js';
import deanRoutes from './routes/deanRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
];

// Middleware
app.use(cookieParser());
app.use(express.json());

// CORS configuration supporting credentials
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy'));
      }
    },
    credentials: true,
  })
);

// Test database connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err.stack);
  } else {
    console.log('Successfully connected to PostgreSQL!');
  }
  if (client) release();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/auth', passwordResetRoutes);
app.use('/api/lecturer', lecturerRoutes);
app.use('/api/dean', deanRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/hod', hodRoutes);

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Backend server running on http://localhost:${port}`);
});