import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidenavbar from '../../components/Sidenavbar';
import Topnavbar from '../../components/Topnavbar';

import { 
  Users, 
  FileClock, 
  Radio, 
  CalendarOff, 
  Download, 
  ArrowUpRight, 
  ArrowRight, 
  ArrowDownRight 
} from 'lucide-react';

export default function DepartmentOverview() {
  const navigate = useNavigate();

  const [modules] = useState([
    {
      code: 'IT3010',
      lecturer: 'Dr. A. Perera',
      students: 120,
      attendance: 92,
      color: 'bg-emerald-500',
      trend: ArrowUpRight,
      trendColor: 'text-emerald-500',
    },
    {
      code: 'IT3045',
      lecturer: 'Prof. S. Jayasinghe',
      students: 85,
      attendance: 78,
      color: 'bg-amber-500',
      trend: ArrowRight,
      trendColor: 'text-amber-500',
    },
    {
      code: 'IT4102',
      lecturer: 'Dr. M. Fernando',
      students: 45,
      attendance: 65,
      color: 'bg-rose-500',
      trend: ArrowDownRight,
      trendColor: 'text-rose-500',
    },
  ]);

  const [medicalQueue, setMedicalQueue] = useState([
    { id: 'STU/2021/045', forwardedBy: 'Dr. A. Perera' },
    { id: 'STU/2020/112', forwardedBy: 'Prof. S. Jayasinghe' },
  ]);

  const handleQuickApprove = (id) => {
    setMedicalQueue((prev) => prev.filter((item) => item.id !== id));
  };

        return (
    <div className="flex min-h-screen text-slate-800 font-sans antialiased">
      <Sidenavbar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Topnavbar />

        <main className="p-8 max-w-7xl w-full mx-auto space-y-6 flex-1">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Department Overview</h2>
          <p className="text-xs text-slate-500 mt-0.5">Information Technology Department - Fall Semester 2024</p>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 shadow-sm transition-colors">
          <Download className="w-3.5 h-3.5" />
          Export Report
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +2.4%
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Dept Attendance Avg</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">87.5%</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg w-fit mb-3">
            <FileClock className="w-4 h-4" />
          </div>
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Pending Medicals</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-800">{12 + medicalQueue.length}</span>
            <span className="text-xs text-slate-400">awaiting review</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg w-fit mb-3">
            <Radio className="w-4 h-4" />
          </div>
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Active Sessions Today</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">24</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="p-2 bg-rose-50 text-rose-500 rounded-lg w-fit mb-3">
            <CalendarOff className="w-4 h-4" />
          </div>
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Staff on Leave</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">3</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Attendance by Module Table */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <span className="h-4 w-1 bg-slate-800 rounded-full inline-block"></span>
              Attendance Overview by Module
            </h3>
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
                    <td className="py-4 text-slate-700 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-[10px] flex items-center justify-center font-bold">
                        {mod.lecturer.slice(4, 6)}
                      </div>
                      {mod.lecturer}
                    </td>
                    <td className="py-4 text-slate-600">{mod.students}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-slate-700 w-8">{mod.attendance}%</span>
                        <div className="w-24 bg-slate-100 rounded-full h-2">
                          <div className={`h-2 rounded-full ${mod.color}`} style={{ width: `${mod.attendance}%` }}></div>
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

        {/* Medical Queue Widget */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <FileClock className="w-4 h-4 text-amber-500" />
                Medical Queue
              </h3>
              <span className="text-[11px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                {12 + medicalQueue.length} Pending
              </span>
            </div>

            <div className="space-y-3">
              {medicalQueue.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">All quick items cleared!</div>
              ) : (
                medicalQueue.map((item) => (
                  <div key={item.id} className="p-3 bg-slate-50 border border-slate-200/70 rounded-lg text-xs">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-bold text-slate-800">{item.id}</span>
                      <span className="text-[10px] uppercase font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                        Review Required
                      </span>
                    </div>
                    <p className="text-slate-500 mb-3 text-[11px]">Forwarded by {item.forwardedBy} - ...</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => navigate('/medical-review')}
                        className="flex-1 py-1.5 rounded bg-white border border-slate-300 font-semibold text-slate-700 hover:bg-slate-100 text-[11px] transition-colors"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleQuickApprove(item.id)}
                        className="flex-1 py-1.5 rounded bg-[#0d2137] text-white font-semibold hover:bg-slate-800 text-[11px] transition-colors"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <Link 
            to="/medical-review"
            className="w-full text-center text-xs font-semibold text-blue-600 hover:underline pt-4 border-t border-slate-100 mt-4 block"
          >
            Go to Medical Hub →
          </Link>
        </div>
            </div>
        </main>
      </div>
    </div>
  );
}