import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidenavbar from '../../components/Sidenavbar';
import Topnavbar from '../../components/Topnavbar';
import { useAuth } from '../../context/AuthContext';
import { getHodDashboard } from '../../lib/api';

import {
  PlusSquare,
  UserCheck,
  Clock,
  Activity,
  CalendarOff,
  TrendingUp,
  TrendingDown,
  Minus,
  Download,
  ArrowRight
} from 'lucide-react';

export default function HODDashboard() {
  const { accessToken, loading: authLoading } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (authLoading) return undefined;

    if (!accessToken) {
      setError('You must be signed in to view the HOD dashboard.');
      setLoading(false);
      return undefined;
    }

    let isCurrent = true;
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getHodDashboard();
        if (isCurrent) setDashboard(data);
      } catch (err) {
        console.error('HOD dashboard error:', err);
        if (isCurrent) setError(err.message || 'Failed to load HOD dashboard');
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    fetchDashboard();
    return () => { isCurrent = false; };
  }, [accessToken, authLoading, refreshKey]);

  const exportDashboard = () => {
    const rows = [
      ['Department', dashboard?.department?.name || 'Department'],
      ['Attendance Average', `${dashboard?.metrics?.attendanceAverage ?? 0}%`],
      ['Pending Medicals', dashboard?.metrics?.pendingMedicals ?? 0],
      ['Active Sessions Today', dashboard?.metrics?.activeSessionsToday ?? 0],
      ['Staff On Leave', dashboard?.metrics?.staffOnLeave ?? '—'],
      [],
      ['Module Code', 'Lecturer', 'Students', 'Average Attendance'],
      ...(dashboard?.modules || []).map((module) => [
        module.code,
        module.lecturer,
        module.students,
        `${module.avgAttendance}%`
      ])
    ];
    const csv = rows.map((row) => row.map((value) =>
      `"${String(value ?? '').replace(/"/g, '""')}"`
    ).join(',')).join('\r\n');
    const fileUrl = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'hod-department-report.csv';
    link.click();
    URL.revokeObjectURL(fileUrl);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen text-slate-800 font-sans antialiased">
        <Sidenavbar />

        <div className="flex-1 flex flex-col min-h-screen">
          <Topnavbar />

          <main className="p-8 flex-1 flex items-center justify-center">
            <p className="text-sm font-semibold text-slate-500">
              Loading dashboard...
            </p>
          </main>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen text-slate-800 font-sans antialiased">
        <Sidenavbar />

        <div className="flex-1 flex flex-col min-h-screen">
          <Topnavbar />

          <main className="p-8 flex-1 flex items-center justify-center">
            <div className="bg-white border border-rose-200 rounded-xl p-6 text-center">
              <p className="text-sm font-bold text-rose-600">
                Failed to load dashboard
              </p>

              <p className="text-xs text-slate-500 mt-2">
                {error}
              </p>
              <button
                type="button"
                onClick={() => setRefreshKey((key) => key + 1)}
                className="mt-4 px-4 py-2 rounded-lg bg-[#051E3D] text-white text-xs font-semibold hover:bg-slate-800"
              >
                Try Again
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const metrics = dashboard?.metrics || {};
  const modules = dashboard?.modules || [];
  const medicalQueue = dashboard?.medicalQueue || [];

  return (
    <div className="flex min-h-screen text-slate-800 font-sans antialiased">

      {/* Sidebar */}
      <Sidenavbar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* Top Header */}
        <Topnavbar />

        {/* Dashboard Body */}
        <main className="p-8 space-y-6 flex-1">

          {/* Header Bar */}
          <div className="flex items-center justify-between">

            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">
                Department Overview
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                {dashboard?.department?.name || 'Department'} Department
              </p>
            </div>

            <button
              type="button"
              onClick={exportDashboard}
              className="flex items-center gap-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export Report
            </button>

          </div>


          {/* Metric Cards Row */}
          <div className="grid grid-cols-4 gap-5">

            {/* Dept Attendance Avg */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">

              <div className="flex items-start justify-between">

                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                  <UserCheck className="w-5 h-5" />
                </div>

                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  Live
                </span>

              </div>

              <div className="mt-4">

                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Dept Attendance Avg
                </span>

                <span className="text-3xl font-black text-slate-900 mt-1 block">
                  {metrics.attendanceAverage ?? 0}%
                </span>

              </div>

            </div>


            {/* Pending Medicals */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">

              <div className="flex items-start justify-between">

                <div className="p-2.5 bg-amber-50 text-amber-500 rounded-xl">
                  <Clock className="w-5 h-5" />
                </div>

              </div>

              <div className="mt-4">

                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Pending Medicals
                </span>

                <div className="flex items-baseline gap-2 mt-1">

                  <span className="text-3xl font-black text-slate-900">
                    {metrics.pendingMedicals ?? 0}
                  </span>

                  <span className="text-xs text-slate-400 font-medium">
                    awaiting review
                  </span>

                </div>

              </div>

            </div>


            {/* Active Sessions Today */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">

              <div className="flex items-start justify-between">

                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <Activity className="w-5 h-5" />
                </div>

              </div>

              <div className="mt-4">

                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Active Sessions Today
                </span>

                <span className="text-3xl font-black text-slate-900 mt-1 block">
                  {metrics.activeSessionsToday ?? 0}
                </span>

              </div>

            </div>


            {/* Staff On Leave */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">

              <div className="flex items-start justify-between">

                <div className="p-2.5 bg-rose-50 text-rose-500 rounded-xl">
                  <CalendarOff className="w-5 h-5" />
                </div>

              </div>

              <div className="mt-4">

                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Staff On Leave
                </span>

                <span className="text-3xl font-black text-slate-900 mt-1 block">
                  {metrics.staffOnLeave ?? '—'}
                </span>

              </div>

            </div>

          </div>


          {/* Attendance Table + Medical Queue */}
          <div className="grid grid-cols-12 gap-6 items-start">

            {/* Attendance Overview */}
            <div className="col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">

              <div className="p-5 border-b border-slate-100 flex items-center justify-between">

                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-600" />
                  Attendance Overview by Module
                </h3>

              </div>


              <div className="p-4">

                <table className="w-full text-left text-xs">

                  <thead className="text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-100">

                    <tr>

                      <th className="pb-3 font-semibold">
                        Module Code
                      </th>

                      <th className="pb-3 font-semibold">
                        Lecturer
                      </th>

                      <th className="pb-3 font-semibold">
                        Total Students
                      </th>

                      <th className="pb-3 font-semibold">
                        Avg Attendance
                      </th>

                      <th className="pb-3 font-semibold text-right">
                        Trend
                      </th>

                    </tr>

                  </thead>


                  <tbody className="divide-y divide-slate-100">

                    {modules.length === 0 ? (

                      <tr>
                        <td
                          colSpan="5"
                          className="py-8 text-center text-slate-400"
                        >
                          No module data available
                        </td>
                      </tr>

                    ) : (

                      modules.map((module, index) => (

                        <tr
                          key={module.courseId || module.code || index}
                          className="hover:bg-slate-50/50"
                        >

                          {/* Module Code */}
                          <td className="py-4 font-bold text-slate-900">
                            {module.code}
                          </td>


                          {/* Lecturer */}
                          <td className="py-4">

                            <div className="flex items-center gap-2.5">

                              <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                {module.lecturer
                                  ? module.lecturer.charAt(0).toUpperCase()
                                  : 'L'}
                              </div>

                              <span className="font-semibold text-slate-700">
                                {module.lecturer}
                              </span>

                            </div>

                          </td>


                          {/* Total Students */}
                          <td className="py-4 font-medium text-slate-600">
                            {module.students}
                          </td>


                          {/* Average Attendance */}
                          <td className="py-4">

                            <div className="flex items-center gap-3">

                              <span className="font-bold text-slate-800 w-8">
                                {module.avgAttendance}%
                              </span>

                              <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">

                                <div
                                  className={`h-full rounded-full ${
                                    module.avgAttendance >= 80
                                      ? 'bg-emerald-500'
                                      : module.avgAttendance >= 70
                                      ? 'bg-amber-500'
                                      : 'bg-rose-500'
                                  }`}
                                  style={{
                                    width: `${module.avgAttendance}%`
                                  }}
                                />

                              </div>

                            </div>

                          </td>


                          {/* Trend */}
                          <td className="py-4 text-right">

                            {module.status === 'up' && (
                              <TrendingUp className="w-4 h-4 text-emerald-500 inline-block" />
                            )}

                            {module.status === 'stable' && (
                              <Minus className="w-4 h-4 text-amber-500 inline-block" />
                            )}

                            {module.status === 'down' && (
                              <TrendingDown className="w-4 h-4 text-rose-500 inline-block" />
                            )}

                          </td>

                        </tr>

                      ))

                    )}

                  </tbody>

                </table>

              </div>

            </div>


            {/* Medical Queue */}
            <div className="col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between min-h-[400px]">

              <div>

                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">

                  <div className="flex items-center gap-2">

                    <PlusSquare className="w-4 h-4 text-amber-500" />

                    <h3 className="font-bold text-slate-800 text-sm">
                      Medical Queue
                    </h3>

                  </div>

                  <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {metrics.pendingMedicals ?? 0} Pending
                  </span>

                </div>


                <div className="space-y-3">

                  {medicalQueue.length === 0 ? (

                    <div className="p-5 text-center text-xs text-slate-400">
                      No pending medical submissions
                    </div>

                  ) : (

                    medicalQueue.map((medical, index) => (

                      <div
                        key={medical.id || index}
                        className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2"
                      >

                        <div className="flex items-center justify-between">

                          <span className="font-mono font-bold text-xs text-slate-800">
                            {medical.studentId}
                          </span>

                          <span className="bg-indigo-50 text-indigo-600 text-[9px] font-bold px-2 py-0.5 rounded">
                            REVIEW REQUIRED
                          </span>

                        </div>


                        <p className="text-[11px] text-slate-500">
                          Forwarded by {medical.lecturer}
                          {medical.courseCode
                            ? ` - ${medical.courseCode}`
                            : ''}
                        </p>


                        <div className="flex items-center justify-end gap-2 pt-1">
                          <Link to="/hod/medical" className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-[11px] font-semibold rounded-md hover:bg-slate-100">
                            Review
                          </Link>
                        </div>

                      </div>

                    ))

                  )}

                </div>

              </div>


              <Link to="/hod/medical" className="w-full mt-6 py-2.5 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-1">
                Go to Medical Review
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}