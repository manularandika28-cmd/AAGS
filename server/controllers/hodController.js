import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { pool } from '../db.js';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const getHodDepartmentId = async (hodId) => {
  const result = await pool.query(
    `SELECT COALESCE(h.department_id, l.department_id) AS department_id
     FROM hods h
     LEFT JOIN lecturers l ON l.lecturer_id = h.lecturer_id
     WHERE h.hod_id = $1`,
    [hodId]
  );

  return result.rows[0]?.department_id ?? null;
};

export const getHodMedicalQueue = async (req, res) => {
  try {
    const departmentId = await getHodDepartmentId(req.user.userId);
    if (!departmentId) {
      return res.status(403).json({ error: 'Your HOD account is not assigned to a department' });
    }

    const [medicalResult, statsResult] = await Promise.all([
      pool.query(
        `SELECT
           m.submission_id,
           m.student_id,
           s.student_name,
           s.academic_level,
           s.semester,
           d.dep_name,
           m.description,
           TO_CHAR(m.date_from, 'YYYY-MM-DD') AS date_from,
           TO_CHAR(m.date_to, 'YYYY-MM-DD') AS date_to,
           m.file_path,
           m.status,
           m.submitted_at,
           m.reviewed_at
         FROM medical_submissions m
         JOIN students s ON s.student_id = m.student_id
         LEFT JOIN departments d ON d.department_id = m.department_id
         WHERE m.department_id = $1
         ORDER BY
           CASE WHEN m.status = 'pending' THEN 0 ELSE 1 END,
           m.submitted_at DESC`,
        [departmentId]
      ),
      pool.query(
        `SELECT
           COUNT(*) FILTER (WHERE status = 'pending') AS pending_count,
           COUNT(*) FILTER (
             WHERE status = 'approved'
               AND reviewed_at >= date_trunc('month', CURRENT_DATE)
           ) AS approved_this_month
         FROM medical_submissions
         WHERE department_id = $1`,
        [departmentId]
      )
    ]);

    return res.json({
      medicals: medicalResult.rows,
      stats: {
        pending: Number(statsResult.rows[0].pending_count),
        approvedThisMonth: Number(statsResult.rows[0].approved_this_month)
      }
    });
  } catch (error) {
    console.error('Error fetching HOD medical queue:', error);
    return res.status(500).json({ error: 'Failed to load medical submissions' });
  }
};

export const updateHodMedicalStatus = async (req, res) => {
  const statusByAction = {
    approve: 'approved',
    reject: 'rejected',
    forward: 'forwarded_to_dean'
  };
  const status = statusByAction[req.params.action];

  if (!status) {
    return res.status(400).json({ error: 'Action must be approve, reject, or forward' });
  }

  try {
    const departmentId = await getHodDepartmentId(req.user.userId);
    if (!departmentId) {
      return res.status(403).json({ error: 'Your HOD account is not assigned to a department' });
    }

    const result = await pool.query(
      `UPDATE medical_submissions
       SET status = $1, reviewed_hod = $2, reviewed_at = NOW()
       WHERE submission_id = $3
         AND department_id = $4
         AND status = 'pending'
       RETURNING submission_id, status, reviewed_at`,
      [status, req.user.userId, req.params.submissionId, departmentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Pending medical submission not found in your department'
      });
    }

    return res.json({ message: 'Medical submission updated', submission: result.rows[0] });
  } catch (error) {
    console.error('Error updating HOD medical submission:', error);
    return res.status(500).json({ error: 'Failed to update medical submission' });
  }
};

export const getHodMedicalDocument = async (req, res) => {
  try {
    const departmentId = await getHodDepartmentId(req.user.userId);
    if (!departmentId) {
      return res.status(403).json({ error: 'Your HOD account is not assigned to a department' });
    }

    const result = await pool.query(
      `SELECT file_path
       FROM medical_submissions
       WHERE submission_id = $1 AND department_id = $2`,
      [req.params.submissionId, departmentId]
    );
    const storedPath = result.rows[0]?.file_path;

    if (!storedPath) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    const fileName = path.basename(storedPath);
    const filePath = path.resolve(serverRoot, 'uploads', 'medicals', fileName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: 'Certificate file is missing from server storage. Ask the student to resubmit it.'
      });
    }

    return res.sendFile(filePath, (error) => {
      if (error && !res.headersSent) {
        res.status(error.statusCode === 404 ? 404 : 500).json({ error: 'Unable to open certificate' });
      }
    });
  } catch (error) {
    console.error('Error opening HOD medical document:', error);
    return res.status(500).json({ error: 'Failed to open certificate' });
  }
};