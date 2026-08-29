import React from 'react';
import Sidenavbar from '../../components/Sidenavbar';
import Topnavbar from '../../components/Topnavbar';
import {
  Star,
  CheckCircle2,
  Download,
  ChevronDown,
  Plus,
  FileText,
  AlertTriangle,
  TrendingUp,
  Activity
} from 'lucide-react';

const AcademicRecords = () => {
  const modules = [
    { code: 'ITC3201', name: 'Advanced Software Engineering', attendance: 92, status: 'Enrolled', badgeColor: 'bg-slate-100 text-slate-700' },
    { code: 'ITC3202', name: 'Machine Learning Concepts', attendance: 68, status: 'At Risk', badgeColor: 'bg-amber-50 text-amber-600 border border-amber-200', isWarning: true },
    { code: 'ITC3203', name: 'Cloud Computing Architecture', attendance: 85, status: 'Pass - ICA', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-200' },
    { code: 'ENG3201', name: 'Professional Practice & Ethics', attendance: 100, status: 'Enrolled', badgeColor: 'bg-slate-100 text-slate-700' },
  ];

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
          
          {/* Header Bar */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Academic Profile</h1>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                Student ID: FOT/2020/IT/045 | BSc (Hons) in Information Technology
              </p>
            </div>

            <button className="flex items-center gap-2 bg-[#0A192F] hover:bg-[#1E3A8A] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors">
              <Download className="w-4 h-4" />
              Download Unofficial Transcript
            </button>
          </div>

          {/* Top 2 Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Cumulative GPA */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center space-x-1.5 text-slate-700 font-bold text-xs tracking-wider">
                <Star className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                <span>CUMULATIVE GPA</span>
              </div>
              <div className="flex items-baseline gap-2 mt-3">
                <span className="text-3xl font-black text-slate-900">3.84</span>
                <span className="text-xs text-slate-400 font-medium">/ 4.00</span>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+0.05 from last semester</span>
              </div>
            </div>

            {/* Card 2: Credits Earned */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center space-x-1.5 text-slate-700 font-bold text-xs tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>CREDITS EARNED</span>
              </div>
              <div className="flex items-baseline gap-2 mt-3">
                <span className="text-3xl font-black text-slate-900">92</span>
                <span className="text-xs text-slate-400 font-medium">/ 120 Total</span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 mt-4 overflow-hidden flex">
                <div className="bg-[#0A192F] h-full rounded-full w-[76%]" />
              </div>
            </div>
          </div>

          {/* Lower Grid: Semester Progress & Document Status / Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Left 2 Columns: Semester Progress Table & GPA Trend */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Semester Progress Table */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="font-bold text-base text-slate-900">Semester Progress</h3>
                  <button className="flex items-center space-x-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                    <span>Year 3 - Semester 2 (Current)</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto pt-4">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="text-slate-400 font-semibold border-b border-slate-100 uppercase tracking-wider text-[10px]">
                        <th className="pb-3 px-3">MODULE</th>
                        <th className="pb-3 px-3">NAME</th>
                        <th className="pb-3 px-3">ATTENDANCE</th>
                        <th className="pb-3 px-3 text-right">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {modules.map((m, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-4 px-3 font-bold text-slate-900">{m.code}</td>
                          <td className="py-4 px-3 font-medium text-slate-600">{m.name}</td>
                          <td className="py-4 px-3">
                            <div className="flex items-center gap-3">
                              <span className={`font-bold w-9 ${m.isWarning ? 'text-rose-600' : 'text-slate-800'}`}>
                                {m.attendance}%
                              </span>
                              <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${
                                    m.attendance >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
                                  }`} 
                                  style={{ width: `${m.attendance}%` }}
                                />
                              </div>
                            </div>
                            {m.isWarning && (
                              <p className="text-[10px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> Below 75% threshold
                              </p>
                            )}
                          </td>
                          <td className="py-4 px-3 text-right">
                            <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold ${m.badgeColor}`}>
                              {m.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end text-[11px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-800 inline-block"></span> 75% Mandatory Requirement</span>
                </div>
              </div>

              {/* GPA Trend Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-slate-900">GPA Trend</h3>
                  <div className="flex items-center gap-4 text-[11px] font-medium text-slate-500">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#0A192F] inline-block"></span> Semester GPA</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-200 inline-block"></span> Cumulative GPA</span>
                  </div>
                </div>

                {/* Simplified Graph Representation */}
                <div className="h-48 w-full bg-slate-50 rounded-xl border border-slate-100 flex items-end justify-between px-8 py-6 relative">
                  {/* Grid lines */}
                  <div className="absolute inset-x-8 top-6 bottom-6 flex flex-col justify-between pointer-events-none opacity-20">
                    <div className="border-b border-slate-300 w-full" />
                    <div className="border-b border-slate-300 w-full" />
                    <div className="border-b border-slate-300 w-full" />
                    <div className="border-b border-slate-300 w-full" />
                  </div>

                  {['Y1S1', 'Y1S2', 'Y2S1', 'Y2S2', 'Y3S1'].map((sem, index) => (
                    <div key={index} className="flex flex-col items-center z-10 gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#0A192F] ring-4 ring-white shadow-xs" />
                      <span className="text-[10px] font-semibold text-slate-400">{sem}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right 1 Column: Document Status & Academic Alerts */}
            <div className="space-y-6">
              
              {/* Document Status */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-base">Document Status</h3>
                  <button className="w-7 h-7 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Doc 1 */}
                  <div className="p-3 bg-emerald-50/40 border border-emerald-100 rounded-xl space-y-1">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-bold text-xs text-slate-900">Official Transcript</span>
                    </div>
                    <p className="text-[11px] text-emerald-700 font-semibold pl-6">Ready for Collection</p>
                    <span className="text-[10px] text-slate-400 block pl-6">Req. Date: 12 Oct 2023</span>
                  </div>

                  {/* Doc 2 */}
                  <div className="p-3 bg-amber-50/40 border border-amber-100 rounded-xl space-y-1">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="font-bold text-xs text-slate-900">Semester Result Sheet (Y2S2)</span>
                    </div>
                    <p className="text-[11px] text-amber-700 font-semibold pl-6">Processing</p>
                    <span className="text-[10px] text-slate-400 block pl-6">Req. Date: 15 Oct 2023</span>
                  </div>
                </div>

                <button className="w-full py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                  View All Requests
                </button>
              </div>

              {/* Academic Alerts */}
              <div className="bg-rose-50/30 border border-rose-200 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <h3>Academic Alerts</h3>
                </div>

                <div className="bg-white border border-rose-100 rounded-xl p-4 space-y-2 shadow-xs">
                  <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Low Attendance Warning
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Your attendance for ITC3202 has dropped below the 75% threshold. Please contact the module coordinator immediately to discuss makeup requirements before final exams.
                  </p>
                  <a href="#contact" className="text-xs font-bold text-indigo-600 hover:underline block pt-1">
                    Contact Coordinator
                  </a>
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default AcademicRecords;