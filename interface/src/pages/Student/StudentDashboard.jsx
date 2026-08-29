import React from 'react';
import Sidenavbar from '../../components/Sidenavbar';
import Topnavbar from '../../components/Topnavbar';
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
  Shield
} from 'lucide-react';

const StudentDashboard = () => {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
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
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, Alex.
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Here is your academic overview for the week.
            </p>
          </div>

          {/* Top 3 Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Attendance */}
            <div className="relative bg-white border border-slate-200 rounded-2xl p-5 shadow-xs overflow-hidden flex flex-col justify-between">
              <div className="absolute right-4 top-4 text-amber-100 pointer-events-none">
                <UserCheck className="w-20 h-20 opacity-40" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5 text-amber-500 font-bold text-xs tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  <span>ATTENDANCE</span>
                </div>
                <div className="text-3xl font-black text-slate-900 mt-3">73%</div>
                <p className="text-xs text-slate-600 mt-1 max-w-[200px]">
                  Below 75% threshold. Action required.
                </p>
              </div>

              {/* Attendance Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 mt-5 overflow-hidden flex">
                <div className="bg-amber-500 h-full rounded-full w-[73%]" />
              </div>
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
                <div className="text-3xl font-black text-slate-900 mt-3">2</div>
                <p className="text-xs text-slate-600 mt-1">
                  Scheduled for this week.
                </p>
              </div>

              <a
                href="#schedule"
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
                <div className="text-2xl font-black text-slate-900 mt-3">Cleared</div>
                <p className="text-xs text-slate-600 mt-1">
                  All documents up to date.
                </p>
              </div>

              <div className="mt-5">
                <span className="inline-block bg-emerald-50 text-emerald-600 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-emerald-100">
                  Valid until Dec 2024
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
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">TIME</th>
                      <th className="py-2.5 px-3">MONDAY</th>
                      <th className="py-2.5 px-3">TUESDAY</th>
                      <th className="py-2.5 px-3">WEDNESDAY</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr className="h-20">
                      <td className="py-3 px-3 font-medium text-slate-700 align-top text-[11px]">
                        08:00 - 10:00
                      </td>
                      <td className="py-3 px-2 align-top">
                        <div className="bg-[#EBF3FC] border-l-4 border-[#2563EB] p-2 rounded-r-md">
                          <p className="font-bold text-[#1E3A8A] text-xs leading-tight">Data Structures</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Room 302</p>
                        </div>
                      </td>
                      <td className="py-3 px-2 align-top" />
                      <td className="py-3 px-2 align-top">
                        <div className="bg-[#FEF2F2] border-l-4 border-[#EF4444] p-2 rounded-r-md">
                          <p className="font-bold text-[#B91C1C] text-xs leading-tight">Algorithm Analysis</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Lab A</p>
                        </div>
                      </td>
                    </tr>
                    <tr className="h-20">
                      <td className="py-3 px-3 font-medium text-slate-700 align-top text-[11px]">
                        10:30 - 12:30
                      </td>
                      <td className="py-3 px-2 align-top" />
                      <td className="py-3 px-2 align-top">
                        <div className="bg-[#F8F4EA] border-l-4 border-[#854D0E] p-2 rounded-r-md">
                          <p className="font-bold text-[#713F12] text-xs leading-tight">Database Systems</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Room 105</p>
                        </div>
                      </td>
                      <td className="py-3 px-2 align-top" />
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 font-bold text-base text-slate-900 pb-1 border-b border-slate-100">
                <BellRing className="w-4 h-4 text-slate-800" />
                <h3>Recent Alerts</h3>
              </div>

              {/* Alert 1 */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex space-x-3">
                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-slate-900">Attendance Warning</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Your attendance for Data Structures has dropped below 75%. Please submit medical documents if applicable.
                  </p>
                  <span className="text-[10px] text-slate-400 block pt-1">2 hours ago</span>
                </div>
              </div>

              {/* Alert 2 */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex space-x-3">
                <div className="w-6 h-6 rounded-full bg-[#051E3D] flex items-center justify-center text-white shrink-0 mt-0.5">
                  <Info className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-slate-900">Meeting Scheduled</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Advisor meeting confirmed for Thursday at 14:00.
                  </p>
                  <span className="text-[10px] text-slate-400 block pt-1">1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;