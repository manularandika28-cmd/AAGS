import mysql from 'mysql2/promise';

let pool;

export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || 3307),
      user: process.env.DB_USER || 'aags',
      password: process.env.DB_PASSWORD || 'aags',
      database: process.env.DB_NAME || 'aags',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

export async function dbAvailable() {
  try {
    await getPool().query('SELECT 1');
    return true;
  } catch {
    return false;
  }
}
