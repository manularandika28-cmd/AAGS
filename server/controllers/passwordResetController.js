// server/controllers/passwordResetController.js
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { pool } from '../db.js';
import { sendPasswordResetEmail } from '../utils/mailer.js';
 
const TOKEN_TTL_MINUTES = 20;
 
// Every role that can log in, and where its email/password_hash live.
const ROLE_TABLES = [
  { role: 'student', table: 'students', pk: 'student_id' },
  { role: 'lecturer', table: 'lecturers', pk: 'lecturer_id' },
  { role: 'hod', table: 'hods', pk: 'hod_id' },
  { role: 'admin', table: 'admins', pk: 'admin_id' },
  { role: 'dean', table: 'deans', pk: 'dean_id' }
];
 
const findUserByEmail = async (email) => {
  for (const { role, table, pk } of ROLE_TABLES) {
    const { rows } = await pool.query(
      `SELECT ${pk} AS user_id, email FROM ${table} WHERE LOWER(email) = LOWER($1) LIMIT 1`,
      [email]
    );
    if (rows.length > 0) {
      return { role, table, pk, userId: rows[0].user_id, email: rows[0].email };
    }
  }
  return null;
};
 
/**
 * POST /api/auth/forgot-password
 * body: { email }
 */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }
 
  const GENERIC_MESSAGE = {
    message: 'If an account with that email exists, a reset link has been sent.'
  };
 
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(200).json(GENERIC_MESSAGE);
    }
 
    // Invalidate any earlier unused tokens for this user before issuing a new one
    await pool.query(
      `UPDATE password_resets 
       SET used = true
       WHERE role = $1 AND user_id = $2 AND used = false`,
      [user.role, user.userId]
    );
 
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MINUTES * 60 * 1000);
 
    await pool.query(
      `INSERT INTO password_resets (role, user_id, token_hash, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [user.role, user.userId, tokenHash, expiresAt]
    );
 
    const clientUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password?token=${rawToken}&email=${encodeURIComponent(user.email)}`;
 
    if (typeof sendPasswordResetEmail === 'function') {
      await sendPasswordResetEmail(user.email, resetUrl);
    } else {
      console.log('--------------------------------------------------');
      console.log('🔑 [AAGS RESET LINK]:', resetUrl);
      console.log('--------------------------------------------------');
    }
 
    return res.status(200).json(GENERIC_MESSAGE);
  } catch (err) {
    console.error('forgotPassword error:', err.message);
    return res.status(200).json(GENERIC_MESSAGE);
  }
};
 
/**
 * POST /api/auth/reset-password
 * body: { email, token, newPassword }
 */
export const resetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;
 
  if (!email || !token || !newPassword) {
    return res.status(400).json({ error: 'Email, token and new password are required.' });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }
 
  try {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
 
    const { rows } = await pool.query(
      `SELECT reset_id, role, user_id, expires_at, used
       FROM password_resets
       WHERE token_hash = $1
       LIMIT 1`,
      [tokenHash]
    );
 
    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired reset link.' });
    }
 
    const resetRow = rows[0];
    if (resetRow.used || new Date(resetRow.expires_at) < new Date()) {
      return res.status(400).json({ error: 'This reset link has expired or already been used.' });
    }
 
    const roleConfig = ROLE_TABLES.find((r) => r.role === resetRow.role);
    if (!roleConfig) {
      return res.status(400).json({ error: 'Invalid reset link.' });
    }
 
    // Defense-in-depth: confirm the email in the link still matches this user
    const { rows: userRows } = await pool.query(
      `SELECT ${roleConfig.pk} AS user_id 
       FROM ${roleConfig.table}
       WHERE ${roleConfig.pk} = $1 AND LOWER(email) = LOWER($2) 
       LIMIT 1`,
      [resetRow.user_id, email]
    );
 
    if (userRows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired reset link.' });
    }
 
    const passwordHash = await bcrypt.hash(newPassword, 10);
 
    await pool.query(
      `UPDATE ${roleConfig.table} SET password_hash = $1 WHERE ${roleConfig.pk} = $2`,
      [passwordHash, resetRow.user_id]
    );
 
    await pool.query(
      `UPDATE password_resets SET used = true WHERE reset_id = $1`,
      [resetRow.reset_id]
    );
 
    return res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    console.error('resetPassword error:', err.message);
    return res.status(500).json({ error: 'Server error resetting password.' });
  }
};
 
// Aliases and default export for flexibility
export const requestPasswordReset = forgotPassword;
 
export default {
  forgotPassword,
  requestPasswordReset,
  resetPassword
};