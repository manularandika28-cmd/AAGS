import'dotenv/config'; // Load environment variables from .env file
import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Connection Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test the database connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
  } else {
    console.log('Successfully connected to PostgreSQL!');
  }
  if (client) release(); // Release the client back to the pool
});

// Start the server (0.0.0.0 allows your ESP32 to connect over Wi-Fi)
app.listen(port, '0.0.0.0', () => {
  console.log(`Backend server is running on port ${port}`);
});

// Export the pool so you can use it in other files (like route files) later
