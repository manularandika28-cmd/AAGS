// mailer.js
//
// Uses SMTP credentials from environment variables — add these to
// your .env (never hardcode credentials):
//
//   SMTP_HOST=smtp.gmail.com          (or your provider)
//   SMTP_PORT=587
//   SMTP_USER=your-sending-address@example.com
//   SMTP_PASS=your-app-password
//   MAIL_FROM="AAGS - University of Colombo <no-reply@aags.lk>"
//   FRONTEND_URL=http://localhost:5173

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465, // true only for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendPasswordResetEmail(toEmail, resetUrl) {
  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: toEmail,
    subject: 'Reset your AAGS password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color:#071B38;">Reset your password</h2>
        <p>We received a request to reset the password for this account.
           This link expires in <strong>20 minutes</strong>.</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}"
             style="background:#071B38;color:#fff;padding:12px 24px;
                    border-radius:6px;text-decoration:none;font-weight:bold;">
            Reset Password
          </a>
        </p>
        <p style="color:#64748b;font-size:12px;">
          If you didn't request this, you can safely ignore this email —
          your password will remain unchanged.
        </p>
      </div>
    `
  });
}
