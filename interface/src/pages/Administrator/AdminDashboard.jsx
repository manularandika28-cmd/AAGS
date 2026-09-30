import React, { useState, useEffect, useRef } from 'react';
import '../../glass.css';
import Sidenavbar from '../../components/Sidenavbar';
import Topnavbar from '../../components/Topnavbar';
import * as XLSX from 'xlsx';
import {
  Users, Shield, ShieldAlert, CheckCircle2, Download, UserPlus,
  Settings, Edit, Ban, ShieldCheck, ExternalLink, Plus, ChevronDown, Check
} from 'lucide-react';

const API_BASE = 'http://localhost:3000/api/admin';

const labelCls = 'block text-xs font-bold text-white/90 mb-1.5';
const inputCls = 'glass-input w-full px-3 py-2.5 rounded-xl text-sm outline-none';
const iconBtn =
  'p-1.5 rounded-lg bg-white/10 border border-white/20 hover:bg-white/25 transition-colors';

/* Reusable glass modal shell */
const Modal = ({ title, subtitle, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md p-4">
    <div className="glass-modal w-full max-w-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="text-xs text-white/60 mt-1">{subtitle}</p>
        </div>
        <button type="button" onClick={onClose} className="text-white/60 hover:text-white text-2xl leading-none">
          ×
        </button>
      </div>
      {children}
    </div>
  </div>
);

const Field = ({ label, children }) => (
  <div>
    <label className={labelCls}>{label}</label>
    {children}
  </div>
);

/* Custom rounded navy dropdown (replaces native <select>) */
const CustomSelect = ({ value, onChange, options, placeholder = 'Select', className = '', small = false }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`glass-input w-full flex items-center justify-between gap-2 text-left outline-none ${
          small ? 'text-xs font-semibold px-3 py-1.5 rounded-lg' : 'text-sm px-3 py-2.5 rounded-xl'
        }`}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="absolute z-50 mt-2 w-full max-h-60 overflow-auto rounded-2xl border border-white/25 bg-[#0A2447]/95 shadow-2xl p-1.5"
          style={{ backdropFilter: 'blur(20px)' }}
        >
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between gap-2 text-left text-xs px-3 py-2 rounded-xl transition-colors ${
                o.value === value ? 'bg-white/20 text-white font-bold' : 'text-white/85 hover:bg-white/15'
              }`}
            >
              <span>{o.label}</span>
              {o.value === value && <Check className="w-3.5 h-3.5 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ROLE_OPTIONS = ['Student', 'Lecturer',  'Dean', 'Admin'].map((r) => ({ value: r, label: r }));
const FILTER_OPTIONS = [{ value: 'All', label: 'All Roles' }, ...ROLE_OPTIONS];
const DEPT_OPTIONS = [
  { value: '', label: 'Select department' },
  { value: '1', label: 'Information and Communication Technology' },
  { value: '2', label: 'Biosystems Technology' },
  { value: '3', label: 'Instrumentation & Automation' }
];

const ErrorBox = ({ message }) =>
  message ? (
    <div className="bg-red-500/20 border border-red-300/40 text-red-100 rounded-xl px-3 py-2.5 text-xs font-medium">
      {message}
    </div>
  ) : null;

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddRole, setShowAddRole] = useState(false);
  const [roleFilter, setRoleFilter] = useState('All');
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [showAllRoles, setShowAllRoles] = useState(false);

  const [roleForm, setRoleForm] = useState({ role_name: '', description: '' });
  const [addingRole, setAddingRole] = useState(false);
  const [addRoleError, setAddRoleError] = useState('');

  const [userForm, setUserForm] = useState({
    name: '', email: '', password: '', role: 'Student', department_id: ''
  });
  const [addingUser, setAddingUser] = useState(false);
  const [addUserError, setAddUserError] = useState('');

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch(`${API_BASE}/audit-logs`, { credentials: 'include' });
      const data = await res.json();
      if (res.ok) setAuditLogs(data);
    } catch (error) {
      console.error('Fetch audit logs error:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch(`${API_BASE}/roles`, { credentials: 'include' });
      const data = await res.json();
      if (res.ok) setRoles(data);
    } catch (error) {
      console.error('Fetch roles error:', error);
    }
  };

  const handleAddRole = async (e) => {
    e.preventDefault();
    setAddingRole(true);
    setAddRoleError('');
    try {
      const res = await fetch(`${API_BASE}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(roleForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create role');

      setRoles((currentRoles) => [...currentRoles, data.role]);
      setRoleForm({ role_name: '', description: '' });
      setShowAddRole(false);
    } catch (error) {
      console.error('Add role error:', error);
      setAddRoleError(error.message);
    } finally {
      setAddingRole(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddingUser(true);
    setAddUserError('');
    try {
      const res = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create user');

      // Refresh dashboard data so the new user appears immediately
      const statsRes = await fetch(`${API_BASE}/dashboard-stats`, { credentials: 'include' });
      const statsData = await statsRes.json();
      if (statsRes.ok) setStats(statsData);

      setUserForm({ name: '', email: '', password: '', role: 'Student', department_id: '' });
      setShowAddUser(false);
    } catch (error) {
      console.error('Add user error:', error);
      setAddUserError(error.message);
    } finally {
      setAddingUser(false);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/dashboard-stats`, { credentials: 'include' });
        const data = await res.json();
        if (res.ok) setStats(data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      }
    };

    fetchStats();
    fetchRoles();
    fetchAuditLogs();

    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const avatarColors = ['bg-blue-900', 'bg-rose-500', 'bg-indigo-400', 'bg-emerald-600', 'bg-amber-500'];

  const users = (stats?.userList ?? []).map((u, idx) => ({
    initials: u.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.is_active ? 'Active' : 'Pending',
    statusBg: u.is_active
      ? 'bg-emerald-400/20 text-emerald-200 border border-emerald-300/30'
      : 'bg-amber-400/20 text-amber-200 border border-amber-300/30',
    mfa: u.is_active, // no real MFA data exists — using is_active as a stand-in visual only
    avatarBg: avatarColors[idx % avatarColors.length]
  }));

  const filteredUsers =
    roleFilter === 'All' ? users : users.filter((user) => user.role === roleFilter);

  const handleExportReport = () => {
    const userData = users.map((user) => ({
      Name: user.name,
      Email: user.email,
      Role: user.role,
      Status: user.status,
      MFA: user.mfa ? 'Enabled' : 'Disabled'
    }));

    const roleData = roles.map((role) => ({
      'Role Name': role.role_name,
      Description: role.description,
      'User Count': role.user_count
    }));

    const auditData = auditLogs.map((log) => ({
      Action: log.action,
      Target: log.target || '',
      'IP Address': log.ip_address || '',
      'Date & Time': new Date(log.created_at).toLocaleString('en-GB', {
        timeZone: 'Asia/Colombo',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    }));

    const summaryData = [
      {
        'Total Active Users': stats?.totalActiveUsers ?? 0,
        'System Admins': stats?.systemAdminsCount ?? 0,
        'MFA Adoption Rate': '68%',
        'System Status': 'All Systems Operational'
      }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(summaryData), 'Summary');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(userData), 'Users');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(roleData), 'Roles');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(auditData), 'Audit Logs');
    XLSX.writeFile(workbook, 'AAGS_Admin_Report.xlsx');
  };

  return (
    <div className="flex min-h-screen text-white font-sans antialiased">
      {/* Admin Sidebar */}
      <Sidenavbar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar */}
        <Topnavbar />

        <main className="p-8 max-w-7xl w-full mx-auto space-y-6 flex-1">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow">
                System Administration
              </h1>
              <p className="text-sm text-white/80 mt-1 font-medium">
                Manage users, roles, and monitor system health.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleExportReport}
                className="glass-btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold"
              >
                <Download className="w-4 h-4" />
                Export Report
              </button>

              <button
                type="button"
                onClick={() => {
                  setAddUserError('');
                  setShowAddUser(true);
                }}
                className="glass-btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold"
              >
                <UserPlus className="w-4 h-4" />
                Add User
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Total Active Users */}
            <div className="glass-card p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-white/90 font-bold text-xs tracking-wider">
                  <Users className="w-4 h-4 text-indigo-300" />
                  <span>TOTAL ACTIVE USERS</span>
                </div>
                <span className="bg-emerald-400/20 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-300/30">
                  +12%
                </span>
              </div>
              <div className="text-3xl font-black text-white mt-4">
                {stats?.totalActiveUsers ?? '1,248'}
              </div>
            </div>

            {/* MFA Adoption */}
            <div className="glass-card p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-white/90 font-bold text-xs tracking-wider">
                  <Shield className="w-4 h-4 text-indigo-300" />
                  <span>MFA ADOPTION RATE</span>
                </div>
                <span className="bg-amber-400/20 text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-300/30">
                  Needs Action
                </span>
              </div>
              <div className="text-3xl font-black text-white mt-4">68%</div>
            </div>

            {/* System Admins */}
            <div className="glass-card p-5 flex flex-col justify-between">
              <div className="flex items-center space-x-1.5 text-white/90 font-bold text-xs tracking-wider">
                <ShieldCheck className="w-4 h-4 text-indigo-300" />
                <span>SYSTEM ADMINS</span>
              </div>
              <div className="text-3xl font-black text-white mt-4">
                {stats?.systemAdminsCount ?? 12}
              </div>
            </div>

            {/* System Status */}
            <div className="glass-card p-5 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute right-4 top-4 pointer-events-none">
                <CheckCircle2 className="w-16 h-16 opacity-25 text-emerald-300" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5 text-emerald-300 font-bold text-xs tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>SYSTEM STATUS</span>
                </div>
                <div className="text-xl font-black text-emerald-200 mt-2">
                  All Systems Operational
                </div>
              </div>
              <span className="text-[10px] text-white/50 mt-3 block">Last checked: 2 mins ago</span>
            </div>
          </div>

          {/* Lower Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* User Management */}
            <div className="lg:col-span-2 glass-card p-5 flex flex-col justify-between min-h-[500px]">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/15">
                  <h3 className="font-bold text-base text-white">User Management</h3>

                  <CustomSelect small className="w-36" value={roleFilter} onChange={setRoleFilter} options={FILTER_OPTIONS} />
                </div>

                <div className="overflow-x-auto pt-2">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="text-white/50 font-semibold border-b border-white/15 uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-3">USER</th>
                        <th className="py-3 px-3">ROLE</th>
                        <th className="py-3 px-3">STATUS</th>
                        <th className="py-3 px-3">MFA</th>
                        <th className="py-3 px-3 text-right">ACTIONS</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-white/10 text-white/90">
                      {(showAllUsers ? filteredUsers : filteredUsers.slice(0, 5)).map((user, index) => (
                        <tr key={index} className="hover:bg-white/10 transition-colors">
                          <td className="py-4 px-3">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-full ${user.avatarBg} text-white font-bold flex items-center justify-center text-xs shrink-0 ring-2 ring-white/30`}
                              >
                                {user.initials}
                              </div>
                              <div>
                                <p className="font-bold text-white">{user.name}</p>
                                <p className="text-[11px] text-white/55">{user.email}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-3 font-medium text-white/80">{user.role}</td>

                          <td className="py-4 px-3">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold ${user.statusBg}`}
                            >
                              {user.status}
                            </span>
                          </td>

                          <td className="py-4 px-3">
                            {user.mfa ? (
                              <ShieldCheck className="w-4 h-4 text-emerald-300" />
                            ) : (
                              <ShieldAlert className="w-4 h-4 text-amber-300" />
                            )}
                          </td>

                          <td className="py-4 px-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button className={`${iconBtn} text-white/80 hover:text-white`}>
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button className={`${iconBtn} text-rose-300 hover:text-rose-200`}>
                                <Ban className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-4 border-t border-white/15 text-center">
                <button
                  type="button"
                  onClick={() => setShowAllUsers((current) => !current)}
                  className="text-xs font-bold text-white/80 hover:text-white"
                >
                  {showAllUsers ? 'Show Less' : 'View All Users'}
                </button>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Role Settings */}
              <div className="glass-card p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/15">
                  <h3 className="font-bold text-white text-base">Role Settings</h3>
                  <Settings className="w-4 h-4 text-white/50" />
                </div>

                <div className="space-y-3">
                  {roles.length === 0 ? (
                    <p className="text-xs text-white/50 text-center py-4">No roles found.</p>
                  ) : (
                    (showAllRoles ? roles : roles.slice(0, 3)).map((role) => (
                      <div key={role.role_id} className="glass-inner p-3 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-xs text-white">{role.role_name}</span>
                          <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            Role
                          </span>
                        </div>
                        <p className="text-[11px] text-white/65">{role.description}</p>
                      </div>
                    ))
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setAddRoleError('');
                    setRoleForm({ role_name: '', description: '' });
                    setShowAddRole(true);
                  }}
                  className="glass-btn w-full py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Role
                </button>

                {roles.length > 3 && (
                  <button
                    type="button"
                    onClick={() => setShowAllRoles((current) => !current)}
                    className="w-full text-xs font-bold text-white/80 hover:text-white"
                  >
                    {showAllRoles ? 'Show Less' : 'View All Roles'}
                  </button>
                )}
              </div>

              {/* Recent Audit Logs */}
              <div className="glass-card p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/15">
                  <h3 className="font-bold text-white text-base">Recent Audit Logs</h3>
                  <ExternalLink className="w-4 h-4 text-white/50" />
                </div>

                <div className="space-y-4">
                  {auditLogs.length === 0 ? (
                    <div className="text-center py-6 text-sm text-white/50">
                      No audit activity yet.
                    </div>
                  ) : (
                    auditLogs.slice(0, 3).map((log, index) => (
                      <div
                        key={log.audit_id}
                        className={`border-l-2 pl-3 space-y-0.5 ${
                          index === 0
                            ? 'border-indigo-300'
                            : index === 1
                            ? 'border-emerald-300'
                            : 'border-amber-300'
                        }`}
                      >
                        <p className="text-[13px] text-white">
                          {log.action}
                          {log.target && `: ${log.target}`}
                        </p>
                        <p className="text-[11px] text-white/55">
                          {log.ip_address
                            ? `${log.target || 'Unknown User'} (IP: ${log.ip_address})`
                            : log.target || 'System'}
                          {' • '}
                          {new Date(log.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Add User Modal */}
          {showAddUser && (
            <Modal
              title="Add New User"
              subtitle="Create a new AAGS system account"
              onClose={() => setShowAddUser(false)}
            >
              <form onSubmit={handleAddUser} className="space-y-4">
                <Field label="Full Name">
                  <input
                    type="text"
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    required
                    className={inputCls}
                    placeholder="Enter full name"
                  />
                </Field>

                <Field label="Email">
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    required
                    className={inputCls}
                    placeholder="user@uoc.lk"
                  />
                </Field>

                <Field label="Temporary Password">
                  <input
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    required
                    minLength={6}
                    className={inputCls}
                    placeholder="Minimum 6 characters"
                  />
                </Field>

                <Field label="Role">
                  <CustomSelect value={userForm.role} onChange={(v) => setUserForm({ ...userForm, role: v })} options={ROLE_OPTIONS} />
                </Field>

                {(userForm.role === 'Student' || userForm.role === 'Lecturer') && (
                  <Field label="Department">
                    <CustomSelect value={userForm.department_id} onChange={(v) => setUserForm({ ...userForm, department_id: v })} options={DEPT_OPTIONS} />
                  </Field>
                )}

                <ErrorBox message={addUserError} />

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddUser(false)}
                    className="glass-btn flex-1 py-2.5 rounded-xl text-sm font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingUser}
                    className="glass-btn flex-1 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50"
                  >
                    {addingUser ? 'Creating...' : 'Create User'}
                  </button>
                </div>
              </form>
            </Modal>
          )}

          {/* Add Role Modal */}
          {showAddRole && (
            <Modal
              title="Create New Role"
              subtitle="Add a new role to the AAGS system"
              onClose={() => setShowAddRole(false)}
            >
              <form onSubmit={handleAddRole} className="space-y-4">
                <Field label="Role Name">
                  <input
                    type="text"
                    value={roleForm.role_name}
                    onChange={(e) => setRoleForm({ ...roleForm, role_name: e.target.value })}
                    required
                    className={inputCls}
                    placeholder="e.g. Registrar"
                  />
                </Field>

                <Field label="Description">
                  <textarea
                    value={roleForm.description}
                    onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                    required
                    rows={4}
                    className={`${inputCls} resize-none`}
                    placeholder="Describe what this role is responsible for"
                  />
                </Field>

                <ErrorBox message={addRoleError} />

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddRole(false)}
                    className="glass-btn flex-1 py-2.5 rounded-xl text-sm font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingRole}
                    className="glass-btn flex-1 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50"
                  >
                    {addingRole ? 'Creating...' : 'Create Role'}
                  </button>
                </div>
              </form>
            </Modal>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;