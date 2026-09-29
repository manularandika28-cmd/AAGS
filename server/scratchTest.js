import 'dotenv/config';
import { pool } from './db.js';
import { getStudentDashboardData } from './controllers/studentcontroller.js';

async function test() {
  try {
    console.log('Testing DB connection...');
    const res = await pool.query('SELECT student_id, student_name, email FROM students LIMIT 5');
    console.log('Students in DB:', res.rows);

    if (res.rows.length > 0) {
      const studentId = res.rows[0].student_id;
      console.log('Testing dashboard query for student_id:', studentId);
      const req = { user: { userId: studentId, name: res.rows[0].student_name, email: res.rows[0].email } };
      const mockRes = {
        json: (data) => {
          console.log('Dashboard data response SUCCESS:\n', JSON.stringify(data, null, 2));
        },
        status: (code) => {
          console.log('Status code:', code);
          return mockRes;
        }
      };
      await getStudentDashboardData(req, mockRes);
    } else {
      console.log('No students found in DB table.');
    }
  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    await pool.end();
  }
}

test();
