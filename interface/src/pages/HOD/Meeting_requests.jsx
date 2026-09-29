import React, { useState } from 'react';
<<<<<<< HEAD
import { Link, useNavigate } from 'react-router-dom';
import Sidenavbar from '../../components/Sidenavbar';
import Topnavbar from '../../components/Topnavbar';

=======
import Sidenavbar from '../../components/Sidenavbar';
import Topnavbar from '../../components/Topnavbar';
import { useAuth } from '../../context/AuthContext';
>>>>>>> 74e34fcd3be90eb8e692e49a450bc1364e9f5aee
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

<<<<<<< HEAD
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
=======
  const filteredRequests = requests.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLecturers = lecturers.filter(l =>
    l.name.toLowerCase().includes(lecturerSearch.toLowerCase()) ||
    l.role.toLowerCase().includes(lecturerSearch.toLowerCase())
  );

  return (
    <div className="flex h-screen text-slate-800 font-sans antialiased overflow-hidden">
      
      {/* Sidebar Navigation */}
      <Sidenavbar activeNav={activeNav} setActiveNav={setActiveNav} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Top Navbar */}
        

        {/* Dashboard Body */}
        <main className="p-8 space-y-6">
          
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Meeting Request Management</h1>
              <p className="text-xs text-slate-500 mt-0.5">Coordinate departmental schedules and handle student meeting requests.</p>
            </div>
            <button 
              onClick={() => setShowNewEventModal(true)}
              className="flex items-center gap-2 bg-[#051E3D] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              New Event
            </button>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-50 text-amber-500 rounded-full">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500 block">Pending Requests</span>
                  <span className="text-2xl font-bold text-slate-900">
                    {requests.filter(r => r.status === 'Pending').length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-500 rounded-full">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500 block">Approved Today</span>
                  <span className="text-2xl font-bold text-slate-900">
                    {requests.filter(r => r.status === 'Approved').length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-rose-50 text-rose-500 rounded-full">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500 block">Schedule Conflicts</span>
                  <span className="text-2xl font-bold text-slate-900">
                    {requests.filter(r => r.status === 'Conflict').length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Layout Columns */}
          <div className="grid grid-cols-3 gap-6">
            
            {/* Table Column */}
            <div className="col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Student Meeting Requests</h3>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="text-xs text-indigo-600 font-semibold flex items-center gap-1 hover:underline"
                >
                  View All &rarr;
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Student</th>
                      <th className="px-6 py-3 font-semibold">Topic</th>
                      <th className="px-6 py-3 font-semibold">Proposed Time</th>
                      <th className="px-6 py-3 font-semibold">Status</th>
                      <th className="px-6 py-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                              {req.avatar}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">{req.name}</div>
                              <div className="text-[10px] text-slate-400">{req.regNo}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-700 max-w-[180px]">
                          {req.topic}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-600">{req.time}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold inline-block ${
                            req.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                            req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-rose-100 text-rose-700'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right relative">
                          <button 
                            onClick={() => setActiveDropdown(activeDropdown === req.id ? null : req.id)}
                            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Action Dropdown */}
                          {activeDropdown === req.id && (
                            <div className="absolute right-6 top-10 w-32 bg-white border border-slate-200 rounded-md shadow-lg z-20 py-1 text-left text-xs">
                              <button 
                                onClick={() => handleStatusChange(req.id, 'Approved')} 
                                className="w-full px-3 py-1.5 hover:bg-slate-50 text-emerald-600 font-medium"
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => handleStatusChange(req.id, 'Pending')} 
                                className="w-full px-3 py-1.5 hover:bg-slate-50 text-amber-600 font-medium"
                              >
                                Mark Pending
                              </button>
                              <button 
                                onClick={() => handleStatusChange(req.id, 'Conflict')} 
                                className="w-full px-3 py-1.5 hover:bg-slate-50 text-rose-600 font-medium"
                              >
                                Mark Conflict
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Side Widgets Column */}
            <div className="space-y-6">
              
              {/* Departmental Schedule Widget */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 text-sm">Departmental Schedule (Today)</h3>
                
                <div className="mt-4 space-y-3 relative before:absolute before:inset-0 before:left-2 before:w-0.5 before:bg-slate-100">
                  <div className="relative pl-6">
                    <div className="absolute left-1 top-1.5 w-2 h-2 rounded-full bg-slate-800 ring-4 ring-white"></div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-xs text-slate-800 max-w-[130px]">Curriculum Review Comm.</span>
                        <span className="text-[10px] font-bold text-slate-500">09:00 AM</span>
                      </div>
                      <span className="text-[11px] text-slate-400 mt-2 block">Board Room A</span>
                    </div>
                  </div>

                  <div className="relative pl-6">
                    <div className="absolute left-1 top-1.5 w-2 h-2 rounded-full bg-slate-300 ring-4 ring-white"></div>
                    <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-xs text-slate-600">Faculty Board Pre-meet</span>
                        <span className="text-[10px] font-bold text-slate-400">11:00 AM</span>
                      </div>
                      <span className="text-[11px] text-slate-400 mt-2 block">Online (Zoom)</span>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-4 py-2 border border-slate-300 text-slate-700 font-semibold text-xs rounded-lg hover:bg-slate-50 transition-colors">
                  View Full Calendar
                </button>
              </div>

              {/* Lecturer Availability Widget */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 text-sm">Lecturer Availability</h3>
                  <button className="text-slate-400 hover:text-slate-600">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {filteredLecturers.map((lec) => (
                    <div key={lec.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={lec.avatar} alt={lec.name} className="w-9 h-9 rounded-full object-cover" />
                        <div>
                          <div className="font-bold text-xs text-slate-800">{lec.name}</div>
                          <div className="text-[10px] text-slate-400">{lec.role}</div>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 ${
                        lec.status === 'Free' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${lec.status === 'Free' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        {lec.status}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Check staff schedule..."
                    value={lecturerSearch}
                    onChange={(e) => setLecturerSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

            </div>
          </div>
        </main>
>>>>>>> 74e34fcd3be90eb8e692e49a450bc1364e9f5aee
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