import React from 'react';
import Sidenavbar from '../../components/AdminSidenavbar';
import Topnavbar from '../../components/Topnavbar';
import {
  Download,
  ChevronDown,
  Info,
  AlertTriangle,
  XCircle,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

const AuditLog = () => {
  const auditLogs = [
    {
      timestamp: '2023-10-27 14:32:01',
      severity: 'Info',
      severityBg: 'bg-blue-50 text-blue-600 border-blue-100',
      icon: Info,
      userInitials: 'JD',
      userName: 'John Doe (Admin)',
      action: 'System Login',
      actionColor: 'text-slate-900',
      module: 'Authentication',
      details: 'Successful login via SSO',
      avatarBg: 'bg-blue-900',
    },
    {
      timestamp: '2023-10-27 14:15:22',
      severity: 'Critical',
      severityBg: 'bg-rose-50 text-rose-600 border-rose-100',
      icon: XCircle,
      userInitials: 'JD',
      userName: 'John Doe (Admin)',
      action: 'Role Modified',
      actionColor: 'text-rose-600',
      module: 'User Management',
      details: 'Changed role for User ID 4',
      avatarBg: 'bg-blue-900',
    },
    {
      timestamp: '2023-10-27 11:05:40',
      severity: 'Info',
      severityBg: 'bg-blue-50 text-blue-600 border-blue-100',
      icon: Info,
      userInitials: 'DR',
      userName: 'Dr. Smith (MO)',
      action: 'Medical Approved',
      actionColor: 'text-emerald-600',
      module: 'Medical Hub',
      details: 'Approved medical certificate...',
      avatarBg: 'bg-indigo-900',
    },
    {
      timestamp: '2023-10-27 09:45:11',
      severity: 'Warning',
      severityBg: 'bg-amber-50 text-amber-600 border-amber-100',
      icon: AlertTriangle,
      userInitials: 'AP',
      userName: 'Prof. Perera (Faculty)',
      action: 'Attendance Overwrite',
      actionColor: 'text-amber-600',
      module: 'Academic Records',
      details: 'Manually updated attendance...',
      avatarBg: 'bg-rose-600',
    },
    {
      timestamp: '2023-10-26 16:20:05',
      severity: 'Info',
      severityBg: 'bg-blue-50 text-blue-600 border-blue-100',
      icon: Info,
      userInitials: 'JD',
      userName: 'John Doe (Admin)',
      action: 'Data Export',
      actionColor: 'text-slate-900',
      module: 'Governance',
      details: 'Exported Senate Meeting...',
      avatarBg: 'bg-blue-900',
    },
    {
      timestamp: '2023-10-26 08:12:33',
      severity: 'Warning',
      severityBg: 'bg-amber-50 text-amber-600 border-amber-100',
      icon: AlertTriangle,
      userInitials: '?',
      userName: 'Unknown User',
      action: 'Failed Login Attempt',
      actionColor: 'text-amber-600',
      module: 'Authentication',
      details: 'Invalid credentials for user...',
      avatarBg: 'bg-slate-300 text-slate-700',
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      <Sidenavbar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Topnavbar />

        <main className="p-8 max-w-7xl w-full mx-auto space-y-6 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Audit Trail</h1>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                Chronological record of system events and user actions.
              </p>
            </div>

            <button className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Date Range</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-xs text-slate-400">to</span>
                  <input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <button className="text-[11px] font-semibold text-rose-500 mt-1 hover:underline">Clear</button>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">User Role</label>
                <div className="relative">
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option>All Roles</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Severity Level</label>
                <div className="relative">
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option>All Levels</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Action Type</label>
                <div className="relative">
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option>All Actions</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <button className="w-full bg-[#0A192F] hover:bg-[#1E3A8A] text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors shadow-xs">
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 text-slate-400 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">TIMESTAMP</th>
                    <th className="py-3.5 px-4">SEVERITY</th>
                    <th className="py-3.5 px-4">USER</th>
                    <th className="py-3.5 px-4">ACTION</th>
                    <th className="py-3.5 px-4">MODULE</th>
                    <th className="py-3.5 px-4">DETAILS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {auditLogs.map((log, idx) => {
                    const SeverityIcon = log.icon;
                    return (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">{log.timestamp}</td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold border ${log.severityBg}`}>
                            <SeverityIcon className="w-3 h-3" />
                            {log.severity}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-full ${log.avatarBg} font-bold flex items-center justify-center text-[10px] shrink-0`}>
                            {log.userInitials}
                          </div>
                          <span className="font-bold text-slate-900">{log.userName}</span>
                        </td>
                        <td className={`py-3.5 px-4 font-bold ${log.actionColor}`}>{log.action}</td>
                        <td className="py-3.5 px-4 font-medium text-slate-600">{log.module}</td>
                        <td className="py-3.5 px-4 text-slate-500 truncate max-w-xs">{log.details}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between p-4 border-t border-slate-100 text-xs text-slate-500">
              <span>Showing 1 to 6 of 1,240 entries</span>
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded border border-slate-200 text-slate-400 hover:bg-slate-50">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button className="w-7 h-7 rounded bg-[#0A192F] text-white font-bold flex items-center justify-center">1</button>
                <button className="w-7 h-7 rounded hover:bg-slate-100 font-medium flex items-center justify-center">2</button>
                <button className="w-7 h-7 rounded hover:bg-slate-100 font-medium flex items-center justify-center">3</button>
                <span className="px-1 text-slate-400">...</span>
                <button className="w-7 h-7 rounded hover:bg-slate-100 font-medium flex items-center justify-center">24</button>
                <button className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuditLog;