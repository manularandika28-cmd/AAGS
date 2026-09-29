import React, { useState } from 'react';
import Sidenavbar from '../../components/Sidenavbar';
import Topnavbar from '../../components/Topnavbar';
<<<<<<< HEAD

=======
import { useAuth } from '../../context/AuthContext';
>>>>>>> 74e34fcd3be90eb8e692e49a450bc1364e9f5aee
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Filter 
} from 'lucide-react';

export default function MeetingRequests() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenuId, setActiveMenuId] = useState(null);

  const [requests, setRequests] = useState([
    {
      id: 'IT/2020/045',
      name: 'Amal Silva',
      initials: 'AS',
      topic: 'Final Year Project Supervision',
      time: 'Oct 24, 10:00 AM',
      status: 'Pending',
    },
    {
      id: 'IT/2021/112',
      name: 'Kasun Perera',
      initials: 'KP',
      topic: 'Module Registration Issue',
      time: 'Oct 24, 11:30 AM',
      status: 'Approved',
    },
    {
      id: 'IT/2019/003',
      name: 'Nishanthi Fernando',
      initials: 'NF',
      topic: 'Research Grant Discussion',
      time: 'Oct 25, 09:00 AM',
      status: 'Conflict',
    },
  ]);

  const updateStatus = (id, newStatus) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    setActiveMenuId(null);
  };

  const filteredRequests = requests.filter(
    (req) =>
      req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingCount = requests.filter((r) => r.status === 'Pending').length;
  const approvedCount = requests.filter((r) => r.status === 'Approved').length;
  const conflictCount = requests.filter((r) => r.status === 'Conflict').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-100 text-emerald-700';
      case 'Conflict':
        return 'bg-rose-100 text-rose-700';
      default:
        return 'bg-amber-100 text-amber-700';
    }
  };

      return (
    <div className="flex min-h-screen text-slate-800 font-sans antialiased">
      <Sidenavbar />

<<<<<<< HEAD
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Topnavbar />

        <main className="p-8 max-w-7xl w-full mx-auto space-y-6 flex-1">
      <div className="flex justify-between items-start mb-6">

        <div className="relative w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student, ID, or topic..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
          />
        </div>
        <button 
          onClick={() => {
            const name = prompt("Enter Student Name:");
            if (!name) return;
            const topic = prompt("Enter Topic:") || "General Discussion";
            const newReq = {
              id: `IT/2024/${Math.floor(100 + Math.random() * 900)}`,
              name,
              initials: name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
              topic,
              time: 'Oct 26, 10:00 AM',
              status: 'Pending',
            };
            setRequests([newReq, ...requests]);
          }}
          className="flex items-center gap-1.5 bg-[#0d2137] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-slate-800 shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          New Event
        </button>
=======
  return (
    <div className="flex h-screen text-slate-800 font-sans antialiased overflow-hidden">
      
      {/* Sidebar Navigation */}
      <Sidenavbar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Top Header */}
        

        {/* Dashboard Body */}
        <main className="p-8 space-y-6 max-w-7xl">
          
          {/* Header & Metrics Banner */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">HOD Medical Review</h1>
              <p className="text-sm text-slate-500 mt-1 max-w-xl">
                Review and process forwarded medical certificates from academic staff.
              </p>
            </div>

            {/* Stat Cards */}
            <div className="flex gap-4">
              <div className="bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 w-48">
                <div className="p-2 bg-amber-50 text-amber-500 rounded-lg">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 leading-tight block">
                    Pending HOD Review
                  </span>
                  <span className="text-2xl font-black text-slate-900">{pendingCount}</span>
                </div>
              </div>

              <div className="bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 w-48">
                <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 leading-tight block">
                    Approved This Month
                  </span>
                  <span className="text-2xl font-black text-slate-900">{approvedCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Forwarded Queue Container */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-700" />
                <h3 className="font-bold text-slate-800 text-sm">Forwarded Queue</h3>
              </div>
              <button className="flex items-center gap-1.5 border border-slate-200 bg-white px-3 py-1 rounded-md text-xs font-semibold text-slate-600 hover:bg-slate-50 shadow-xs">
                <Filter className="w-3.5 h-3.5" />
                Filter
              </button>
            </div>

            {/* Queue Item 1 - Detailed View */}
            <div className="p-6 border-b border-slate-100">
              <div className="grid grid-cols-12 gap-6">
                
                {/* Left Column: Student Details */}
                <div className="col-span-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#051E3D] text-white font-bold flex items-center justify-center text-sm shadow-sm">
                      JD
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base leading-tight">Jane Doe</h4>
                      <span className="text-xs text-slate-400 font-mono">IT21045678</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-400 font-medium">Course:</span>
                      <span className="font-semibold text-slate-700">BSc IT (Hons)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-400 font-medium">Dates:</span>
                      <span className="font-bold text-slate-800">12 Oct - 15 Oct 2023</span>
                    </div>
                  </div>

                  <div>
                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 text-[11px] font-bold px-3 py-1 rounded-md border border-amber-200/50">
                      <Clock className="w-3 h-3" />
                      Requires HOD Approval
                    </span>
                  </div>
                </div>

                {/* Middle Column: Lecturer Review Note */}
                <div className="col-span-4 flex flex-col justify-between">
                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 relative">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-indigo-900 uppercase tracking-wider mb-2">
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      Lecturer Review
                    </div>
                    <p className="text-xs text-indigo-900 font-semibold mb-2">
                      Dr. A. Silva (Module Coordinator) <span className="font-normal text-slate-600">reviewed this certificate.</span>
                    </p>
                    <div className="bg-white p-3 rounded-lg border border-indigo-100/80 shadow-xs text-xs text-slate-600 italic">
                      "Student missed the mid-term practical exam during this period. The medical certificate appears valid, but given it affects an examination, it requires HOD approval to schedule a make-up session."
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2 mt-4">
                    <button 
                      onClick={handleApprove}
                      className="flex-1 bg-[#051E3D] text-white py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-800 transition-colors shadow-xs"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      Approve
                    </button>
                    <button 
                      onClick={handleReject}
                      className="border border-rose-300 text-rose-600 hover:bg-rose-50 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      Reject
                    </button>
                    <button 
                      onClick={handleForward}
                      className="border border-slate-300 text-slate-700 hover:bg-slate-50 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <CornerUpRight className="w-3.5 h-3.5" />
                      Forward to Dean
                    </button>
                  </div>
                </div>

                {/* Right Column: Medical Document Preview */}
                <div className="col-span-4">
                  <div className="relative border border-slate-200 rounded-xl overflow-hidden bg-slate-800 group h-56 flex flex-col justify-end shadow-xs">
                    {/* Fake Document Canvas View */}
                    <div className="absolute inset-0 bg-slate-100 p-4 opacity-95 group-hover:opacity-100 transition-opacity">
                      <div className="h-full w-full bg-white border border-slate-300 p-3 shadow-inner rounded flex flex-col justify-between">
                        <div className="text-center border-b pb-1">
                          <p className="text-[9px] font-bold text-slate-700">ST. MARY'S HOSPITAL</p>
                          <p className="text-[7px] text-slate-400">OFFICIAL MEDICAL CERTIFICATE</p>
                        </div>
                        <div className="space-y-1 text-[8px] text-slate-600 my-auto">
                          <p><strong>Patient Name:</strong> Jane Doe</p>
                          <p><strong>Diagnosis:</strong> Acute Viral Infection</p>
                          <p><strong>Period:</strong> 12/10/2023 - 15/10/2023</p>
                          <p><strong>Status:</strong> Fit to resume studies 16/10/2023</p>
                        </div>
                        <div className="text-right border-t pt-1">
                          <p className="text-[8px] font-bold text-slate-800">Dr. E. Collins</p>
                          <p className="text-[6px] text-slate-400">MBBS, MRCGP</p>
                        </div>
                      </div>
                    </div>

                    {/* Zoom Icon Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-slate-900/20 transition-opacity cursor-pointer">
                      <div className="p-2 bg-slate-900/80 text-white rounded-full shadow-lg">
                        <ZoomIn className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Bottom File Label */}
                    <div className="relative z-10 bg-slate-900/90 text-white px-3 py-1.5 text-[11px] font-mono flex items-center gap-2 truncate">
                      <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">medical_cert_jd_oct.pdf</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Queue Item 2 - Minimized View */}
            <div className="p-4 bg-slate-50/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-xs">
                  SM
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Saman Perera</h4>
                  <span className="text-[10px] text-slate-400 font-mono">ET22012345</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 italic">Content minimized for brevity...</p>
            </div>

          </div>

        </main>
>>>>>>> 74e34fcd3be90eb8e692e49a450bc1364e9f5aee
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Meeting Request Management</h2>
        <p className="text-xs text-slate-500 mt-0.5">Coordinate departmental schedules and handle student meeting requests.</p>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Pending Requests</p>
            <p className="text-xl font-bold text-slate-800">{pendingCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Approved Today</p>
            <p className="text-xl font-bold text-slate-800">{approvedCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Schedule Conflicts</p>
            <p className="text-xl font-bold text-slate-800">{conflictCount}</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Student Requests & Right Panels */}
      <div className="grid grid-cols-3 gap-6">
        {/* Requests Table */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-slate-800">Student Meeting Requests</h3>
            <span className="text-xs text-slate-400 font-medium">Showing {filteredRequests.length} results</span>
          </div>

          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100 font-medium">
                <th className="pb-3 font-medium">Student</th>
                <th className="pb-3 font-medium">Topic</th>
                <th className="pb-3 font-medium">Proposed Time</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-xs">
                      {row.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{row.name}</p>
                      <p className="text-[10px] text-slate-400">{row.id}</p>
                    </div>
                  </td>
                  <td className="py-3.5 text-slate-700">{row.topic}</td>
                  <td className="py-3.5 text-slate-600">{row.time}</td>
                  <td className="py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${getStatusBadge(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right relative">
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === row.id ? null : row.id)}
                      className="text-slate-400 hover:text-slate-600 p-1 rounded"
                    >
                      <MoreVertical className="w-4 h-4 inline-block" />
                    </button>

                    {/* Context Action Menu */}
                    {activeMenuId === row.id && (
                      <div className="absolute right-0 top-10 bg-white border border-slate-200 rounded-lg shadow-lg z-20 w-32 py-1 text-left">
                        <button
                          onClick={() => updateStatus(row.id, 'Approved')}
                          className="w-full px-3 py-1.5 text-[11px] font-medium text-emerald-600 hover:bg-slate-50 text-left"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(row.id, 'Conflict')}
                          className="w-full px-3 py-1.5 text-[11px] font-medium text-rose-600 hover:bg-slate-50 text-left"
                        >
                          Mark Conflict
                        </button>
                        <button
                          onClick={() => updateStatus(row.id, 'Pending')}
                          className="w-full px-3 py-1.5 text-[11px] font-medium text-amber-600 hover:bg-slate-50 text-left"
                        >
                          Reset Pending
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Panels */}
        <div className="space-y-4">
          {/* Department Schedule */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
            <h4 className="text-xs font-bold text-slate-800 mb-3">Departmental Schedule (Today)</h4>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg border-l-4 border-blue-600 text-xs">
                <div className="flex justify-between font-semibold text-slate-800 mb-0.5">
                  <span>Curriculum Review Comm.</span>
                  <span>09:00 AM</span>
                </div>
                <p className="text-[11px] text-slate-500">Board Room A</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border-l-4 border-slate-300 text-xs">
                <div className="flex justify-between font-semibold text-slate-800 mb-0.5">
                  <span>Faculty Board Pre-meet</span>
                  <span>11:00 AM</span>
                </div>
                <p className="text-[11px] text-slate-500">Online (Zoom)</p>
              </div>
            </div>
            <button className="w-full mt-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50">
              View Full Calendar
            </button>
          </div>

          {/* Lecturer Availability */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs font-bold text-slate-800">Lecturer Availability</h4>
              <Filter className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[10px]">
                    RB
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Dr. Ruwan Bandara</p>
                    <p className="text-[10px] text-slate-400">Software Eng.</p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
                  • Free
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[10px]">
                    SD
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Dr. Samanthi Dias</p>
                    <p className="text-[10px] text-slate-400">Data Science</p>
                  </div>
                </div>
                <span className="text-[10px] bg-rose-100 text-rose-700 font-semibold px-2 py-0.5 rounded-full">
                  • In Class
                </span>
              </div>
            </div>

            <div className="mt-3 relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
              <input
                type="text"
                placeholder="Check staff schedule..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] focus:outline-none"
              />
            </div>
          </div>
        </div>
            </div>
        </main>
      </div>
    </div>
  );
}