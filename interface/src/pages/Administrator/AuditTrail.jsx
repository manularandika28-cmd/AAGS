import React, { useEffect, useState } from 'react';
import Sidenavbar from '../../components/Sidenavbar';
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
  const [auditLogs, setAuditLogs] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');
const [userRole, setUserRole] = useState('All Roles');
const [severity, setSeverity] = useState('All Levels');
const [actionType, setActionType] = useState('All Actions');
const [currentPage, setCurrentPage] = useState(1);
const logsPerPage = 5;

const API_BASE = 'http://localhost:3000/api/admin';

const fetchAuditLogs = async () => {
  try {
    setLoading(true);
    setError('');

    const params = new URLSearchParams();

if (startDate) params.append('startDate', startDate);
if (endDate) params.append('endDate', endDate);
if (userRole !== 'All Roles') params.append('role', userRole);
if (severity !== 'All Levels') params.append('severity', severity);
if (actionType !== 'All Actions') params.append('action', actionType);

const response = await fetch(
  `${API_BASE}/audit-logs?${params.toString()}`,
  {
    credentials: 'include'
  }
);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || data.message || 'Failed to fetch audit logs'
      );
    }

    const logs = data.logs || data;

const formattedLogs = logs.map((log) => {
  const severity = log.severity || 'Info';

  let severityBg = 'bg-blue-50 text-blue-600 border-blue-100';
  let icon = Info;

  if (severity === 'Critical') {
    severityBg = 'bg-rose-50 text-rose-600 border-rose-100';
    icon = XCircle;
  } else if (severity === 'Warning') {
    severityBg = 'bg-amber-50 text-amber-600 border-amber-100';
    icon = AlertTriangle;
  }

  const userName = log.user_name || log.username || 'Unknown User';

  const userInitials = userName
    .split(' ')
    .map((name) => name[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return {
    ...log,
    timestamp: log.timestamp,
    severity,
    severityBg,
    icon,
    userInitials,
    userName,
    action: log.action,
    actionColor:
      severity === 'Critical'
        ? 'text-rose-600'
        : severity === 'Warning'
        ? 'text-amber-600'
        : 'text-slate-900',
    module: log.module || 'System',
    details: log.details || '-',
    avatarBg: 'bg-blue-900'
  };
});

setAuditLogs(formattedLogs);
  } catch (err) {
    console.error('Fetch audit logs error:', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchAuditLogs();
}, []);

const totalPages = Math.ceil(auditLogs.length / logsPerPage);

const startIndex = (currentPage - 1) * logsPerPage;
const currentLogs = auditLogs.slice(
  startIndex,
  startIndex + logsPerPage
);

  return (
    <div className="flex min-h-screen  text-slate-800 font-sans antialiased">
      <Sidenavbar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
       

        <main className="p-8 max-w-7xl w-full mx-auto space-y-6 flex-1" style={{ transform: 'scale(1.005)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 text-white tracking-tight">Audit Trail</h1>
              <p className="text-sm text-slate-500 text-white mt-1 font-medium">
                Chronological record of system events and user actions.
              </p>
            </div>

            <button className="flex items-center gap-2 bg-white hover:bg-[#9fb6d4] text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
  <div className="grid grid-cols-1 md:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr] gap-4 items-end">

    {/* Date Range */}
    <div className="min-w-0">
      <label className="block text-[11px] font-bold text-slate-500 mb-1">
        Date Range
      </label>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="min-w-0 w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-[10px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        <span className="text-[10px] text-slate-400 shrink-0">
          to
        </span>

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="min-w-0 w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-[10px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>

    {/* User Role */}
    <div>
      <label className="block text-[11px] font-bold text-slate-500 mb-1">
        User Role
      </label>

      <div className="relative">
        <select
          value={userRole}
          onChange={(e) => setUserRole(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option>All Roles</option>
          <option>Admin</option>
          <option>Dean</option>
          <option>HOD</option>
          <option>Lecturer</option>
          <option>Student</option>
          <option>System Maintainer</option>
        </select>

        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>

    {/* Severity */}
    <div>
      <label className="block text-[11px] font-bold text-slate-500 mb-1">
        Severity Level
      </label>

      <div className="relative">
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option>All Levels</option>
          <option>Info</option>
          <option>Warning</option>
          <option>Critical</option>
        </select>

        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>

    {/* Action Type */}
    <div>
      <label className="block text-[11px] font-bold text-slate-500 mb-1">
        Action Type
      </label>

      <div className="relative">
        <select
          value={actionType}
          onChange={(e) => setActionType(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
        <option>All Actions</option>
<option>User login successful</option>
<option>User logout</option>
<option>Failed login attempt</option>
<option>Role updated</option>
<option>User created</option>
<option>User approved</option>
<option>User rejected</option>
<option>User activated</option>
<option>User deactivated</option>
<option>User deleted</option>
<option>Permissions updated</option>
<option>Medical submission approved</option>
<option>Medical submission rejected</option>
<option>Attendance overwritten</option>
<option>Data exported</option>
<option>System configuration updated</option>
        </select>

        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>

  </div>

  {/* Filter Actions */}
  <div className="flex justify-end items-center gap-2">
    <button
      type="button"
      onClick={() => { 
  setStartDate(''); 
  setEndDate(''); 
  setUserRole('All Roles'); 
  setSeverity('All Levels'); 
  setActionType('All Actions'); 
  setCurrentPage(1);
}}
      className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 transition-colors"
    >
      Clear
    </button>

    <button
      type="button"
      onClick={() => {
  setCurrentPage(1);
  fetchAuditLogs();
}}
      disabled={loading}
      className="bg-[#0A192F] hover:bg-[#1E3A8A] disabled:opacity-50 text-white font-bold py-2 px-5 rounded-xl text-xs transition-colors shadow-xs"
    >
      {loading ? 'Loading...' : 'Apply Filters'}
    </button>
  </div>
</div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            {loading ? (
  <div className="py-16 text-center text-sm text-slate-400">
    Loading audit logs...
  </div>
) : error ? (
  <div className="py-16 text-center text-sm text-rose-500">
    {error}
  </div>
) : (
  <div className="overflow-x-hidden">
              <table  className="w-full text-left text-xs border-collapse transition-transform duration-200 hover:scale-[1.002]">
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
                  {currentLogs.map((log, idx) => {
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
)}
            <div className="flex items-center justify-between p-4 border-t border-slate-100 text-xs text-slate-500">
  <span>
    Showing {auditLogs.length === 0 ? 0 : startIndex + 1} to{' '}
    {Math.min(startIndex + logsPerPage, auditLogs.length)} of{' '}
    {auditLogs.length} entries
  </span>

  <div className="flex items-center gap-1">

    <button
      type="button"
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((page) => page - 1)}
      className="p-1.5 rounded border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <ChevronLeft className="w-3.5 h-3.5" />
    </button>

    {Array.from({ length: totalPages }, (_, index) => {
      const page = index + 1;

      return (
        <button
          key={page}
          type="button"
          onClick={() => setCurrentPage(page)}
          className={`w-7 h-7 rounded font-medium flex items-center justify-center ${
            currentPage === page
              ? 'bg-[#0A192F] text-white font-bold'
              : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          {page}
        </button>
      );
    })}

    <button
      type="button"
      disabled={currentPage === totalPages || totalPages === 0}
      onClick={() => setCurrentPage((page) => page + 1)}
      className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
    >
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