import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  PlusSquare, 
  LogOut, 
  Search, 
  Bell, 
  HelpCircle, 
  Clock, 
  CheckCircle2, 
  Filter,
  ThumbsUp,
  ThumbsDown,
  CornerUpRight,
  ZoomIn,
  FileText
} from 'lucide-react';

export default function MedicalReview() {
  const [activeNav, setActiveNav] = useState('Medical Review');
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingCount, setPendingCount] = useState(12);
  const [approvedCount, setApprovedCount] = useState(48);

  const handleApprove = () => {
    alert("Medical certificate approved successfully!");
    setPendingCount(prev => Math.max(0, prev - 1));
    setApprovedCount(prev => prev + 1);
  };

  const handleReject = () => {
    alert("Medical certificate rejected.");
    setPendingCount(prev => Math.max(0, prev - 1));
  };

  const handleForward = () => {
    alert("Medical certificate forwarded to Dean.");
  };

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

        <div className="p-4 border-t border-slate-700/50">
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
      <div className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-lg font-bold text-slate-900">AAGS Faculty System</h2>
          
          <div className="flex items-center gap-6">
            <div className="relative w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-100/80 rounded-md border-transparent focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
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
                className="w-8 h-8 rounded-full border border-slate-200 object-cover"
              />
            </div>
          </div>
        </header>

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
      </div>

    </div>
  );
}