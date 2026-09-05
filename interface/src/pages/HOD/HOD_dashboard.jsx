import React from 'react';
import Sidenavbar from '../../components/Sidenavbar';
import Topnavbar from '../../components/Topnavbar';
import {
  Users,
  FileClock,
  Radio,
  CalendarOff,
  ArrowUpRight,
  ArrowRight,
  ArrowDownRight
} from 'lucide-react';

const HODDashboard = () => {
  const modules = [
    { code: 'IT3010', lecturer: 'Dr. A. Perera', students: 120, attendance: 92, color: 'bg-emerald-500', trend: ArrowUpRight, trendColor: 'text-emerald-500' },
    { code: 'IT3045', lecturer: 'Prof. S. Jayasinghe', students: 85, attendance: 78, color: 'bg-amber-500', trend: ArrowRight, trendColor: 'text-amber-500' },
    { code: 'IT4102', lecturer: 'Dr. M. Fernando', students: 45, attendance: 65, color: 'bg-rose-500', trend: ArrowDownRight, trendColor: 'text-rose-500' },
  ];

  return (
    <div className="flex min-h-screen text-slate-800 font-sans antialiased">
      <Sidenavbar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Topnavbar />

        <main className="p-8 max-w-7xl w-full mx-auto space-y-6 flex-1">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Department Overview
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Information Technology Department — Fall Semester 2024
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-700 w-fit mb-3">
                <Users className="w-4 h-4" />
              </div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Dept Attendance Avg</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">87.5%</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg w-fit mb-3">
                <FileClock className="w-4 h-4" />
              </div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Pending Medicals</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">12</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg w-fit mb-3">
                <Radio className="w-4 h-4" />
              </div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Active Sessions Today</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">24</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="p-2 bg-rose-50 text-rose-500 rounded-lg w-fit mb-3">
                <CalendarOff className="w-4 h-4" />
              </div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Staff on Leave</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">3</p>
            </div>
          </div>

          {/* Attendance by Module Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-sm font-semibold text-slate-800">Attendance Overview by Module</h3>
              <button className="text-xs font-semibold text-blue-600 hover:underline">View All</button>
            </div>

            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 font-medium">
                  <th className="pb-3 font-medium">Module Code</th>
                  <th className="pb-3 font-medium">Lecturer</th>
                  <th className="pb-3 font-medium">Total Students</th>
                  <th className="pb-3 font-medium">Avg Attendance</th>
                  <th className="pb-3 font-medium text-center">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {modules.map((mod) => {
                  const TrendIcon = mod.trend;
                  return (
                    <tr key={mod.code} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 font-semibold text-slate-800">{mod.code}</td>
                      <td className="py-4 text-slate-700">{mod.lecturer}</td>
                      <td className="py-4 text-slate-600">{mod.students}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-slate-700 w-8">{mod.attendance}%</span>
                          <div className="w-24 bg-slate-100 rounded-full h-2">
                            <div className={`h-2 rounded-full ${mod.color}`} style={{ width: `${mod.attendance}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <TrendIcon className={`w-4 h-4 inline-block ${mod.trendColor}`} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HODDashboard;