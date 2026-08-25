import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { pool } from './db.js';
import authRoutes from './routes/authRoutes.js';

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

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Backend server running on http://localhost:${port}`);
});