import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  PlusSquare, 
  LogOut, 
  Bell, 
  HelpCircle, 
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
  const [activeNav, setActiveNav] = useState('Dashboard');

  const modules = [
    { code: 'IT3010', lecturer: 'Dr. A. Perera', students: 120, avgAttendance: 92, status: 'up', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' },
    { code: 'IT3045', lecturer: 'Prof. S. Jayasinghe', students: 85, avgAttendance: 78, status: 'stable', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80' },
    { code: 'IT4102', lecturer: 'Dr. M. Fernando', students: 45, avgAttendance: 65, status: 'down', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80' }
  ];

  return (
    /* min-h-screen ensures the dark navy sidebar extends all the way to the bottom */
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#051E3D] text-white flex flex-col justify-between shrink-0 min-h-screen">
        <div>
          <div className="p-6 flex flex-col items-center border-b border-slate-700/50">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center p-2 mb-3 shadow-inner">
              <div className="w-full h-full rounded-full border-2 border-[#051E3D] flex items-center justify-center font-bold text-xs text-[#051E3D]">
                UOC
              </div>
            </div>
            <h1 className="text-base font-bold text-center leading-tight">Faculty of Technology</h1>
            <p className="text-[10px] tracking-widest uppercase text-slate-400 mt-1">University of Colombo</p>
          </div>

          <nav className="mt-6 px-3 space-y-1">
            {[
              { name: 'Dashboard', icon: LayoutDashboard },
              { name: 'Meeting Requests', icon: Calendar },
              { name: 'Medical Review', icon: PlusSquare },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveNav(item.name)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all ${
                    isActive 
                      ? 'bg-rose-500 text-white rounded-lg shadow-sm' 
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-700/50 mt-auto">
          <button 
            onClick={() => alert('Logged out successfully!')}
            className="w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold text-slate-400 hover:text-white uppercase tracking-wider transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-lg font-bold text-slate-900">AAGS Faculty System</h2>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 text-slate-500 border-r border-slate-200 pr-6">
              <button className="relative p-1.5 hover:bg-slate-100 rounded-full">
                <Bell className="w-5 h-5 text-rose-500" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
              </button>
              <button className="p-1.5 hover:bg-slate-100 rounded-full">
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button className="text-xs font-semibold text-slate-600 hover:text-slate-900">Settings</button>
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80"
                alt="Profile"
                className="w-8 h-8 rounded-full border border-slate-200 object-cover"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-8 space-y-6 flex-1">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Department Overview</h1>
              <p className="text-sm text-slate-500 mt-1">Information Technology Department - Fall Semester 2024</p>
            </div>

            <button className="flex items-center gap-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold shadow-xs transition-colors">
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
                  <TrendingUp className="w-3 h-3" /> +2.4%
                </span>
              </div>
              <div className="mt-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Dept Attendance Avg</span>
                <span className="text-3xl font-black text-slate-900 mt-1 block">87.5%</span>
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
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Pending Medicals</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-slate-900">14</span>
                  <span className="text-xs text-slate-400 font-medium">awaiting review</span>
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
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Sessions Today</span>
                <span className="text-3xl font-black text-slate-900 mt-1 block">24</span>
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
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Staff On Leave</span>
                <span className="text-3xl font-black text-slate-900 mt-1 block">3</span>
              </div>
            </div>
          </div>

          {/* Grid Layout: Attendance Overview Table & Medical Queue Widget */}
          <div className="grid grid-cols-12 gap-6 items-start">
            
            {/* Left 8 Columns: Attendance Table */}
            <div className="col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-600" />
                  Attendance Overview by Module
                </h3>
                <button className="text-xs font-bold text-slate-500 hover:text-slate-800">View All</button>
              </div>

              <div className="p-4">
                <table className="w-full text-left text-xs">
                  <thead className="text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    <tr>
                      <th className="pb-3 font-semibold">Module Code</th>
                      <th className="pb-3 font-semibold">Lecturer</th>
                      <th className="pb-3 font-semibold">Total Students</th>
                      <th className="pb-3 font-semibold">Avg Attendance</th>
                      <th className="pb-3 font-semibold text-right">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {modules.map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-4 font-bold text-slate-900">{m.code}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-2.5">
                            <img src={m.avatar} alt={m.lecturer} className="w-7 h-7 rounded-full object-cover" />
                            <span className="font-semibold text-slate-700">{m.lecturer}</span>
                          </div>
                        </td>
                        <td className="py-4 font-medium text-slate-600">{m.students}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-800 w-8">{m.avgAttendance}%</span>
                            <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  m.avgAttendance >= 80 ? 'bg-emerald-500' :
                                  m.avgAttendance >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                                }`} 
                                style={{ width: `${m.avgAttendance}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          {m.status === 'up' && <TrendingUp className="w-4 h-4 text-emerald-500 inline-block" />}
                          {m.status === 'stable' && <Minus className="w-4 h-4 text-amber-500 inline-block" />}
                          {m.status === 'down' && <TrendingDown className="w-4 h-4 text-rose-500 inline-block" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right 4 Columns: Medical Queue Sidebar */}
            <div className="col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between min-h-[400px]">
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <PlusSquare className="w-4 h-4 text-amber-500" />
                    <h3 className="font-bold text-slate-800 text-sm">Medical Queue</h3>
                  </div>
                  <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    14 Pending
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Queue Item 1 */}
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-slate-800">STU/2021/045</span>
                      <span className="bg-indigo-50 text-indigo-600 text-[9px] font-bold px-2 py-0.5 rounded">
                        REVIEW REQUIRED
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">Forwarded by Dr. A. Perera - IT3010</p>
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-[11px] font-semibold rounded-md hover:bg-slate-100">
                        View
                      </button>
                      <button className="px-3 py-1 bg-[#051E3D] text-white text-[11px] font-semibold rounded-md hover:bg-slate-800">
                        Approve
                      </button>
                    </div>
                  </div>

                  {/* Queue Item 2 */}
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-slate-800">STU/2020/112</span>
                      <span className="bg-indigo-50 text-indigo-600 text-[9px] font-bold px-2 py-0.5 rounded">
                        REVIEW REQUIRED
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">Forwarded by Prof. S. Jayasinghe - IT3045</p>
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-[11px] font-semibold rounded-md hover:bg-slate-100">
                        View
                      </button>
                      <button className="px-3 py-1 bg-[#051E3D] text-white text-[11px] font-semibold rounded-md hover:bg-slate-800">
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 py-2.5 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-1">
                Go to Medical Hub
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </main>
      </div>

    </div>
  );
}