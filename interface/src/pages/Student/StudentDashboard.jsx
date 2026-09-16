import React, { useState, useEffect } from 'react';
import Sidenavbar from '../../components/Sidenavbar';
import Topnavbar from '../../components/Topnavbar';
import { useAuth } from '../../context/AuthContext';
import API from '../../lib/api';
import {
  AlertTriangle,
  Calendar,
  ShieldCheck,
  ArrowRight,
  ChevronDown,
  BellRing,
  Info,
  UserCheck,
  Users,
  Shield,
  Loader2,
  CheckCircle2,
  Clock,
  BookOpen
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Controls whether the low-attendance course list is expanded
  const [showLowAttendance, setShowLowAttendance] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    API.get('/student/dashboard')
      .then((res) => {
        if (isMounted) {
          setDashboardData(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load student dashboard:', err);
        if (isMounted) {
          const errMsg = err.response?.data?.error || err.response?.data?.message || err.message;
          if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
            setError('Backend server is disconnected. Please start the backend server on http://localhost:3000');
          } else {
            setError(errMsg || 'Could not fetch dashboard data. Please try again.');
          }
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const studentName = dashboardData?.student?.student_name || user?.name || 'Student';
  const attendanceRate = dashboardData?.attendanceRate ?? 100;

  // Courses returned by studentcontroller.js with attendance_pct < 80,
  // pre-sorted ascending (lowest attendance first) by the SQL query.
  const lowAttendanceModules = dashboardData?.lowAttendanceModules || [];
  const hasLowAttendance = lowAttendanceModules.length > 0;
  const isAttendanceLow = attendanceRate < 75;

  const upcomingMeetings = dashboardData?.upcomingMeetings ?? 0;
  const medicalStatusObj = dashboardData?.medicalStatus || { status: 'Cleared' };
  const medicalStatusText = medicalStatusObj.status || 'Cleared';
  const timetable = dashboardData?.timetable || [];
  const alerts = dashboardData?.alerts || [];

  // Group timetable by day and time slot
  const hasSaturday = timetable.some((s) => s.day_of_week?.toLowerCase() === 'saturday');
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', ...(hasSaturday ? ['Saturday'] : [])];

  // Fixed timetable rows — always these four 2-hour blocks, regardless
  // of what's in the data. The lunch gap (12:00-13:00) is intentionally
  // not its own row.
  const SEGMENTS = [
    { label: '08:00 - 10:00', start: 480, end: 600 },   // 08:00-10:00
    { label: '10:00 - 12:00', start: 600, end: 720 },   // 10:00-12:00
    { label: '13:00 - 15:00', start: 780, end: 900 },   // 13:00-15:00
    { label: '15:00 - 17:00', start: 900, end: 1020 }   // 15:00-17:00
  ];
  const ROW_HEIGHT_PX = 80;
  const TOTAL_HEIGHT_PX = ROW_HEIGHT_PX * SEGMENTS.length;
  // Virtual timeline length with the lunch gap compressed out, so every
  // row above contributes the same "weight" to position math.
  const TOTAL_VIRTUAL_MIN = SEGMENTS.reduce((sum, s) => sum + (s.end - s.start), 0);

  const timeToMinutes = (label) => {
    const [h, m] = label.split(':').map(Number);
    return h * 60 + m;
  };

  // Maps a real clock-time (in minutes) onto the virtual, gap-compressed
  // timeline above, so a class's on-screen position/height is
  // proportional to how much of the fixed rows it actually covers —
  // e.g. 13:00-17:00 fills both the 13-15 and 15-17 rows completely,
  // while 14:00-16:00 fills only the bottom half of 13-15 and the top
  // half of 15-17.
  const toVirtualOffset = (mins) => {
    let offset = 0;
    for (const seg of SEGMENTS) {
      if (mins <= seg.start) return offset;
      if (mins <= seg.end) return offset + (mins - seg.start);
      offset += seg.end - seg.start;
    }
    return offset;
  };

  const colorStyles = [
    { bg: 'bg-[#EBF3FC]', border: 'border-[#2563EB]', text: 'text-[#1E3A8A]' },
    { bg: 'bg-[#FEF2F2]', border: 'border-[#EF4444]', text: 'text-[#B91C1C]' },
    { bg: 'bg-[#F8F4EA]', border: 'border-[#854D0E]', text: 'text-[#713F12]' },
    { bg: 'bg-[#ECFDF5]', border: 'border-[#10B981]', text: 'text-[#065F46]' },
    { bg: 'bg-[#F3E8FF]', border: 'border-[#9333EA]', text: 'text-[#581C87]' }
  ];

  const formatAlertTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  // Colour tier for an individual course's attendance percentage
  const getPctStyle = (pct) => {
    if (pct < 60) return { bar: 'bg-rose-500', text: 'text-rose-600', chip: 'bg-rose-50 border-rose-200' };
    if (pct < 70) return { bar: 'bg-amber-500', text: 'text-amber-600', chip: 'bg-amber-50 border-amber-200' };
    return { bar: 'bg-yellow-500', text: 'text-yellow-700', chip: 'bg-yellow-50 border-yellow-200' };
  };

  return (
    <div className="flex min-h-screen text-slate-800 font-sans antialiased">
      {/* Sidenavbar */}
      <Sidenavbar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Topnavbar */}
        <Topnavbar />

        {/* Dashboard Content */}
        <main className="p-8 max-w-7xl w-full mx-auto space-y-6 flex-1">
          {/* Welcome Header */}
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {studentName}
            </h2>
            <p className="text-sm text-slate-300 mt-1 font-medium">
              Here is your academic overview for the week.
            </p>
          </div>

          {loading ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center space-y-3 shadow-xs">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm text-slate-500 font-medium">Loading your dashboard data...</p>
            </div>
          ) : error ? (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-rose-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Top 3 Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: Attendance */}
                <div className="relative bg-white border border-slate-200 rounded-2xl p-5 shadow-xs overflow-hidden flex flex-col justify-between">
                  <div className="absolute right-4 top-4 text-slate-100 pointer-events-none">
                    <UserCheck className="w-20 h-20 opacity-40" />
                  </div>
                  <div>
                    <div className={`flex items-center space-x-1.5 font-bold text-xs tracking-wider ${isAttendanceLow ? 'text-amber-500' : 'text-emerald-600'}`}>
                      {isAttendanceLow ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      <span>ATTENDANCE</span>
                    </div>
                    <div className="text-3xl font-black text-slate-900 mt-3">{attendanceRate}%</div>
                    <p className="text-xs text-slate-600 mt-1 max-w-[200px]">
                      {hasLowAttendance
                        ? `Below 80% threshold. Action required for ${lowAttendanceModules.length} module${lowAttendanceModules.length > 1 ? 's' : ''}.`
                        : 'Good standing. Meets attendance target.'}
                    </p>
                  </div>

                  {/* Attendance Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2 mt-5 overflow-hidden flex">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isAttendanceLow ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(100, Math.max(0, attendanceRate))}%` }}
                    />
                  </div>

                  {/* Low Attendance Courses Dropdown Toggle */}
                  {hasLowAttendance && (
                    <div className="mt-4 relative z-10">
                      <button
                        type="button"
                        onClick={() => setShowLowAttendance((prev) => !prev)}
                        aria-expanded={showLowAttendance}
                        className="w-full flex items-center justify-between text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 hover:bg-amber-100 transition-colors"
                      >
                        <span className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" />
                          {lowAttendanceModules.length} course{lowAttendanceModules.length > 1 ? 's' : ''} below 80%
                        </span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${showLowAttendance ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {showLowAttendance && (
                        <ul className="mt-2 space-y-1.5 max-h-56 overflow-y-auto pr-1">
                          {lowAttendanceModules.map((course) => {
                            const totalSessions = Number(course.total_sessions ?? 0);
                            const hasSessions = totalSessions > 0;
                            const rawPct = Number(course.attendance_pct);
                            const pct = Number.isFinite(rawPct) ? rawPct : 0;
                            const style = getPctStyle(pct);
                            return (
                              <li
                                key={course.course_id ?? course.course_code}
                                className={`flex items-center justify-between gap-2 border rounded-lg px-3 py-2 ${
                                  hasSessions ? style.chip : 'bg-slate-50 border-slate-200'
                                }`}
                              >
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-slate-900 truncate">
                                    {course.course_name}
                                  </p>
                                  <p className="text-[10px] text-slate-500 font-medium">
                                    {course.course_code}
                                    {hasSessions && course.attended != null && (
                                      <span> &middot; {course.attended}/{totalSessions} sessions</span>
                                    )}
                                  </p>
                                </div>
                                <span className={`text-xs font-black shrink-0 ${hasSessions ? style.text : 'text-slate-400'}`}>
                                  {hasSessions ? `${pct}%` : 'No sessions yet'}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  )}
                </div>

                {/* Card 2: Upcoming Meetings */}
                <div className="relative bg-white border border-slate-200 rounded-2xl p-5 shadow-xs overflow-hidden flex flex-col justify-between">
                  <div className="absolute right-4 top-4 text-slate-200 pointer-events-none">
                    <Users className="w-20 h-20 opacity-50" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5 text-[#051E3D] font-bold text-xs tracking-wider">
                      <Calendar className="w-4 h-4" />
                      <span>UPCOMING MEETINGS</span>
                    </div>
                    <div className="text-3xl font-black text-slate-900 mt-3">{upcomingMeetings}</div>
                    <p className="text-xs text-slate-600 mt-1">
                      {upcomingMeetings === 1 ? '1 meeting scheduled for this week.' : `${upcomingMeetings} meetings scheduled for this week.`}
                    </p>
                  </div>

                  <a
                    href="/student/meeting-scheduler"
                    className="text-xs font-semibold text-slate-800 hover:text-blue-600 flex items-center space-x-1 mt-5 group"
                  >
                    <span>View Schedule</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>

                {/* Card 3: Medical Status */}
                <div className="relative bg-white border border-slate-200 rounded-2xl p-5 shadow-xs overflow-hidden flex flex-col justify-between">
                  <div className="absolute right-4 top-4 text-emerald-100 pointer-events-none">
                    <Shield className="w-20 h-20 opacity-30" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5 text-emerald-600 font-bold text-xs tracking-wider">
                      <ShieldCheck className="w-4 h-4" />
                      <span>MEDICAL STATUS</span>
                    </div>
                    <div className="text-2xl font-black text-slate-900 mt-3 capitalize">{medicalStatusText}</div>
                    <p className="text-xs text-slate-600 mt-1">
                      {medicalStatusText.toLowerCase() === 'cleared' ? 'All documents up to date.' : 'Medical submission pending review.'}
                    </p>
                  </div>

                  <div className="mt-5">
                    <span className="inline-block bg-emerald-50 text-emerald-600 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-emerald-100">
                      {medicalStatusObj.date_to
                        ? `Valid until ${new Date(medicalStatusObj.date_to).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
                        : 'Status Active'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lower Grid: Weekly Timetable & Recent Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Weekly Timetable */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <h3 className="font-bold text-base text-slate-900">Weekly Timetable</h3>
                    <button className="flex items-center space-x-1 text-xs font-semibold text-slate-700 hover:text-slate-900">
                      <span>Current Week</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="overflow-x-auto pt-4">
                    {timetable.length === 0 ? (
                      <div className="py-12 text-center text-slate-500 space-y-2">
                        <Clock className="w-8 h-8 text-slate-300 mx-auto" />
                        <p className="text-xs font-medium">No scheduled classes found for your enrolled courses.</p>
                      </div>
                    ) : (
                      <div className="min-w-[640px]">
                        {/* Header row */}
                        <div
                          className="grid"
                          style={{ gridTemplateColumns: `90px repeat(${daysOfWeek.length}, 1fr)` }}
                        >
                          <div className="py-2.5 px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-200">
                            Time
                          </div>
                          {daysOfWeek.map((day) => (
                            <div
                              key={day}
                              className="py-2.5 px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-l border-slate-200 text-center"
                            >
                              {day.toUpperCase()}
                            </div>
                          ))}
                        </div>

                        {/* Body: fixed time-row labels + a proportionally-positioned canvas per day */}
                        <div
                          className="grid"
                          style={{ gridTemplateColumns: `90px repeat(${daysOfWeek.length}, 1fr)` }}
                        >
                          <div className="flex flex-col divide-y divide-slate-100">
                            {SEGMENTS.map((seg) => (
                              <div
                                key={seg.label}
                                className="h-20 flex items-center px-3 text-[11px] font-semibold text-slate-600 bg-slate-50/50 whitespace-nowrap"
                              >
                                {seg.label}
                              </div>
                            ))}
                          </div>

                          {daysOfWeek.map((day) => {
                            const daySessions = timetable.filter(
                              (s) => s.day_of_week?.toLowerCase() === day.toLowerCase() && s.start_time && s.end_time
                            );

                            return (
                              <div
                                key={day}
                                className="relative border-l border-slate-100"
                                style={{ height: TOTAL_HEIGHT_PX }}
                              >
                                {/* Reference lines matching the fixed rows on the left */}
                                {SEGMENTS.map((seg, i) => (
                                  <div
                                    key={seg.label}
                                    className="absolute left-0 right-0 border-t border-slate-100"
                                    style={{ top: i * ROW_HEIGHT_PX }}
                                  />
                                ))}

                                {daySessions.map((session, idx) => {
                                  const startMin = timeToMinutes(session.start_time.slice(0, 5));
                                  const endMin = Math.max(
                                    timeToMinutes(session.end_time.slice(0, 5)),
                                    startMin + 1
                                  );
                                  const vStart = toVirtualOffset(startMin);
                                  const vEnd = toVirtualOffset(endMin);
                                  const topPct = (vStart / TOTAL_VIRTUAL_MIN) * 100;
                                  const heightPct = Math.max(((vEnd - vStart) / TOTAL_VIRTUAL_MIN) * 100, 6);
                                  const styleIndex = (session.timetable_id ?? idx) % colorStyles.length;
                                  const style = colorStyles[styleIndex] || colorStyles[0];

                                  return (
                                    <div
                                      key={session.timetable_id ?? `${day}-${idx}`}
                                      className={`absolute left-1 right-1 ${style.bg} border-l-4 ${style.border} rounded-r-lg shadow-xs px-2 py-1 overflow-hidden transition-transform hover:-translate-y-0.5 hover:z-10`}
                                      style={{ top: `${topPct}%`, height: `${heightPct}%` }}
                                    >
                                      <div className="flex items-center justify-between gap-1">
                                        <span className="font-extrabold text-[10px] tracking-wide text-slate-600 uppercase truncate">
                                          {session.course_code}
                                        </span>
                                        {session.lecturer_abbr && (
                                          <span className="text-[9px] font-bold bg-white/90 text-slate-700 px-1 py-0.5 rounded border border-slate-200 shrink-0">
                                            {session.lecturer_abbr}
                                          </span>
                                        )}
                                      </div>
                                      <p className={`font-bold ${style.text} text-xs leading-snug truncate`}>
                                        {session.course_name}
                                      </p>
                                      <p className="text-[10px] text-slate-500 font-medium truncate">
                                        📍 {session.location || 'Lecture Hall'}
                                      </p>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Alerts */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center space-x-2 font-bold text-base text-slate-900 pb-1 border-b border-slate-100">
                    <BellRing className="w-4 h-4 text-slate-800" />
                    <h3>Recent Alerts</h3>
                  </div>

                  {alerts.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 space-y-1">
                      <Info className="w-6 h-6 mx-auto text-slate-300" />
                      <p className="text-xs">No recent notifications</p>
                    </div>
                  ) : (
                    alerts.map((alert, idx) => (
                      <div key={alert.notification_id || idx} className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${idx % 2 === 0 ? 'bg-amber-100 text-amber-600' : 'bg-[#051E3D] text-white'}`}>
                          {idx % 2 === 0 ? <AlertTriangle className="w-3.5 h-3.5" /> : <Info className="w-3.5 h-3.5" />}
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-xs text-slate-900">{alert.title}</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {alert.message}
                          </p>
                          <span className="text-[10px] text-slate-400 block pt-1">
                            {formatAlertTime(alert.created_at)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
