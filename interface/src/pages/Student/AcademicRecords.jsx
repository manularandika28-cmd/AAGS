import React, { useState, useEffect, useMemo } from 'react';
import Sidenavbar from '../../components/Sidenavbar';
import Topnavbar from '../../components/Topnavbar';
import API from '../../lib/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Download,
  AlertTriangle,
  FileText,
  Filter,
  Loader2,
  CheckCircle2,
  Info,
  Clock,
  BookOpen
} from 'lucide-react';

const AcademicRecords = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [selectedLevel, setSelectedLevel] = useState('Level 2');
  const [selectedSemester, setSelectedSemester] = useState('Semester 1');

  const fetchRecords = async (level, semester) => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (level) params.level = level;
      if (semester) params.semester = semester;

      const res = await API.get('/student/academic-records', { params });
      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching academic records:', err);
      setError('Unable to fetch academic attendance records. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords(selectedLevel, selectedSemester);
  }, [selectedLevel, selectedSemester]);

  const student = data?.student;
  const records = data?.records || [];
  const alerts = data?.academicAlerts || [];

  // Summary Metrics
  const averageAttendance = useMemo(() => {
    if (records.length === 0) return 100;
    const total = records.reduce((acc, curr) => acc + (parseFloat(curr.attendance_pct) || 0), 0);
    return Math.round(total / records.length);
  }, [records]);

  // PDF Export Generator
  const handleDownloadPDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');

    // Header Branding
    doc.setFillColor(5, 30, 61); // #051E3D
    doc.rect(0, 0, 210, 32, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('FACULTY OF TECHNOLOGY - UNIVERSITY OF COLOMBO', 14, 14);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(200, 215, 235);
    doc.text('Official Academic Course Attendance Record', 14, 22);

    // Student Info Block
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.text(`Student Name: ${student?.student_name || 'N/A'}`, 14, 42);
    doc.text(`Student Email: ${student?.email || 'N/A'}`, 14, 48);
    doc.text(`Department: ${student?.dep_name || 'ICT'}`, 14, 54);

    doc.text(`Academic Level: ${selectedLevel === 'all' ? 'All Levels' : selectedLevel}`, 125, 42);
    doc.text(`Semester: ${selectedSemester === 'all' ? 'All Semesters' : selectedSemester}`, 125, 48);
    doc.text(`Generated On: ${new Date().toLocaleDateString()}`, 125, 54);

    // Table Data Formatting
    const tableData = records.map((r) => [
      r.course_code,
      r.course_name,
      `${r.attended || 0} / ${r.total_sessions || 0}`,
      `${r.attendance_pct ?? 0}%`,
      parseFloat(r.attendance_pct) >= 80 ? 'Eligible' : 'At Risk (< 80%)'
    ]);

    autoTable(doc, {
      startY: 62,
      head: [['Course Code', 'Course Title', 'Attended / Sessions', 'Attendance %', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [5, 30, 61],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 8.5,
        textColor: [40, 40, 40]
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      columnStyles: {
        0: { cellWidth: 26, fontStyle: 'bold' },
        1: { cellWidth: 78 },
        2: { cellWidth: 32, halign: 'center' },
        3: { cellWidth: 24, halign: 'center', fontStyle: 'bold' },
        4: { cellWidth: 30, halign: 'center' }
      },
      didParseCell: (hookData) => {
        if (hookData.section === 'body' && hookData.column.index === 4) {
          if (hookData.cell.raw.includes('At Risk')) {
            hookData.cell.styles.textColor = [220, 38, 38];
            hookData.cell.styles.fontStyle = 'bold';
          } else {
            hookData.cell.styles.textColor = [16, 149, 106];
            hookData.cell.styles.fontStyle = 'bold';
          }
        }
      }
    });

    // Save File
    const filename = `Attendance_Record_${student?.student_name?.replace(/\s+/g, '_') || 'Student'}.pdf`;
    doc.save(filename);
  };

  return (
    <div className="flex min-h-screen text-slate-800 font-sans antialiased">
      <Sidenavbar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Topnavbar />

        <main className="p-8 max-w-7xl w-full mx-auto space-y-6 flex-1">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Academic Profile & Attendance
              </h2>
              <p className="text-sm text-slate-300 mt-1 font-medium">
                Student ID: #{student?.student_id || '1'} &bull; {student?.student_name} ({student?.dep_name || 'Faculty of Technology'})
              </p>
            </div>

            <button
              onClick={handleDownloadPDF}
              disabled={records.length === 0}
              className="inline-flex items-center gap-2 bg-[#051E3D] hover:bg-[#072852] border border-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" /> Download Academic Report (PDF)
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* LEFT 2 COLUMNS: Semester Progress Table & Filters */}
            <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-5">
              {/* Filter Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-slate-700" />
                  <h3 className="font-extrabold text-sm text-slate-900">Module Attendance Breakdown</h3>
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />

                  {/* Level Selector */}
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10"
                  >
                    <option value="all">All Levels</option>
                    <option value="Level 1">Level 1</option>
                    <option value="Level 2">Level 2</option>
                    <option value="Level 3">Level 3</option>
                    <option value="Level 4">Level 4</option>
                  </select>

                  {/* Semester Selector */}
                  <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10"
                  >
                    <option value="all">All Semesters</option>
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              {loading ? (
                <div className="py-16 flex flex-col items-center justify-center space-y-3">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  <p className="text-xs text-slate-400 font-medium">Loading module attendance records...</p>
                </div>
              ) : records.length === 0 ? (
                <div className="py-16 text-center text-slate-400 space-y-2">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-semibold">No registered courses found for the selected semester/level.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-3">MODULE</th>
                        <th className="py-3 px-3">NAME</th>
                        <th className="py-3 px-3 text-center">ATTENDANCE</th>
                        <th className="py-3 px-3 text-right">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {records.map((c) => {
                        const pct = parseFloat(c.attendance_pct) || 0;
                        const isLow = pct < 80;

                        return (
                          <tr key={c.course_id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3 px-3 font-extrabold text-slate-900 whitespace-nowrap">
                              {c.course_code}
                            </td>
                            <td className="py-3 px-3 font-medium text-slate-800">
                              <div>{c.course_name}</div>
                              <span className="text-[10px] text-slate-400 font-normal">
                                {c.attended ?? 0} / {c.total_sessions ?? 0} sessions
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <div className="inline-flex flex-col items-center">
                                <span className={`font-black ${isLow ? 'text-rose-600' : 'text-emerald-600'}`}>
                                  {pct}%
                                </span>
                                <div className="w-20 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${isLow ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                    style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-right">
                              {isLow ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                                  <AlertTriangle className="w-3 h-3" /> Below 80%
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                  <CheckCircle2 className="w-3 h-3" /> Eligible
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Footnote */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>Average: <strong className="text-slate-700">{averageAttendance}%</strong></span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span> 80% Mandatory Exam Eligibility Threshold
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Academic Alerts Feed */}
            <div className="space-y-6">
              <div className="bg-rose-900/10 border border-rose-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-rose-200/40">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <h3 className="font-extrabold text-sm text-rose-950">Academic Alerts</h3>
                </div>

                {alerts.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 space-y-1 bg-white rounded-2xl p-4">
                    <Info className="w-6 h-6 mx-auto text-slate-300" />
                    <p className="text-xs">No active academic notices.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <div
                        key={alert.notification_id}
                        className="bg-white border border-rose-100 rounded-2xl p-4 space-y-2 shadow-2xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                          <h4 className="font-extrabold text-xs text-slate-900">{alert.title}</h4>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{alert.message}</p>
                        <div className="flex items-center justify-between pt-1">
                          <a
                            href="/student/meeting-scheduler"
                            className="text-[11px] font-bold text-blue-600 hover:underline"
                          >
                            Contact Coordinator &rarr;
                          </a>
                          <span className="text-[10px] text-slate-400">
                            {new Date(alert.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AcademicRecords;