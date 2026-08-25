import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Stethoscope, 
  LogOut, 
  Search, 
  Bell, 
  HelpCircle, 
  Plus, 
  MoreVertical, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Filter,
  X
} from 'lucide-react';

export default function MeetingRequests() {
  // Navigation & Interactive States
  const [activeNav, setActiveNav] = useState('Meeting Scheduler');
  const [searchTerm, setSearchTerm] = useState('');
  const [lecturerSearch, setLecturerSearch] = useState('');
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Dynamic Data States
  const [requests, setRequests] = useState([
    { id: 1, name: 'Amal Silva', regNo: 'IT/2020/045', topic: 'Final Year Project Supervision', time: 'Oct 24, 10:00 AM', status: 'Pending', avatar: 'AS' },
    { id: 2, name: 'Kasun Perera', regNo: 'IT/2021/112', topic: 'Module Registration Issue', time: 'Oct 24, 11:30 AM', status: 'Approved', avatar: 'KP' },
    { id: 3, name: 'Nishanthi Fernando', regNo: 'IT/2019/003', topic: 'Research Grant Discussion', time: 'Oct 25, 09:00 AM', status: 'Conflict', avatar: 'NF' }
  ]);

  const [lecturers, setLecturers] = useState([
    { id: 1, name: 'Dr. Ruwan Bandara', role: 'Software Eng.', status: 'Free', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' },
    { id: 2, name: 'Dr. Samanthi Dias', role: 'Data Science', status: 'In Class', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80' }
  ]);

  const [newEvent, setNewEvent] = useState({ student: '', topic: '', time: 'Oct 26, 10:00 AM' });

  // Action Functions
  const handleStatusChange = (id, newStatus) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
    setActiveDropdown(null);
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEvent.student || !newEvent.topic) return;
    
    const created = {
      id: Date.now(),
      name: newEvent.student,
      regNo: `IT/2024/${Math.floor(100 + Math.random() * 900)}`,
      topic: newEvent.topic,
      time: newEvent.time,
      status: 'Pending',
      avatar: newEvent.student.split(' ').map(n => n[0]).join('').toUpperCase()
    };

    setRequests([created, ...requests]);
    setNewEvent({ student: '', topic: '', time: 'Oct 26, 10:00 AM' });
    setShowNewEventModal(false);
  };

  const filteredRequests = requests.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLecturers = lecturers.filter(l =>
    l.name.toLowerCase().includes(lecturerSearch.toLowerCase()) ||
    l.role.toLowerCase().includes(lecturerSearch.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans antialiased overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#051E3D] text-white flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 flex flex-col items-center border-b border-slate-700/50">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center p-2 mb-3 shadow-inner">
              <div className="w-full h-full rounded-full border-2 border-[#051E3D] flex items-center justify-center font-bold text-xs text-[#051E3D]">
                UOC
              </div>
            </div>
            <h1 className="text-base font-bold text-center leading-tight">Technology System</h1>
            <p className="text-[10px] tracking-widest uppercase text-slate-400 mt-1">University of Colombo</p>
          </div>

          <nav className="mt-6 px-3 space-y-1">
            {[
              { name: 'Dashboard', icon: LayoutDashboard },
              { name: 'Meeting Scheduler', icon: Calendar },
              { name: 'Medical Hub', icon: Stethoscope },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveNav(item.name)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-rose-500/20 text-rose-400 border-l-4 border-rose-500 rounded-l-none' 
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-700/50">
          <button 
            onClick={() => alert('Logged out successfully!')}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-lg font-bold text-slate-900">AAGS System</h2>
          
          <div className="flex items-center gap-6">
            <div className="relative w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-100 rounded-md border-transparent focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            <div className="flex items-center gap-3 text-slate-500 border-r border-slate-200 pr-6">
              <button className="relative p-1.5 hover:bg-slate-100 rounded-full">
                <Bell className="w-5 h-5" />
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
                className="w-8 h-8 rounded-full border border-slate-200"
              />
            </div>
          </div>
        </header>

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
      </div>

      {/* New Event Modal */}
      {showNewEventModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setShowNewEventModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Schedule New Meeting</h3>
            
            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. John Doe" 
                  value={newEvent.student}
                  onChange={(e) => setNewEvent({ ...newEvent, student: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Meeting Topic</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Thesis Progress" 
                  value={newEvent.topic}
                  onChange={(e) => setNewEvent({ ...newEvent, topic: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Time & Date</label>
                <input 
                  type="text" 
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewEventModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-md font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#051E3D] text-white rounded-md font-semibold hover:bg-slate-800"
                >
                  Save Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}