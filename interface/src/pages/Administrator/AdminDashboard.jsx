import React, { useState, useEffect } from 'react';
import Sidenavbar from '../../components/Sidenavbar';
import Topnavbar from '../../components/Topnavbar';
import {
  Users,
  Shield,
  ShieldAlert,
  CheckCircle2,
  Download,
  UserPlus,
  ChevronDown,
  Settings,
  Edit,
  Ban,
  ShieldCheck,
  ExternalLink,
  Plus
} from 'lucide-react';

const API_BASE = 'http://localhost:3000/api/admin';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [roles, setRoles] = useState([]);
  const [showAddRole, setShowAddRole] = useState(false);
  const [roleForm, setRoleForm] = useState({
  role_name: '',
  description: ''
});

const [addingRole, setAddingRole] = useState(false);
const [addRoleError, setAddRoleError] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [showAllUsers, setShowAllUsers] = useState(false);
const [showAllRoles, setShowAllRoles] = useState(false);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Student',
    department_id: ''
});

const [addingUser, setAddingUser] = useState(false);
const [addUserError, setAddUserError] = useState('');
const fetchAuditLogs = async () => {
  try {
    const res = await fetch(`${API_BASE}/audit-logs`, {
      credentials: 'include'
    });

    const data = await res.json();

    if (res.ok) {
      setAuditLogs(data);
    }
  } catch (error) {
    console.error('Fetch audit logs error:', error);
  }
};
const fetchRoles = async () => {
    try {
        const res = await fetch(`${API_BASE}/roles`, {
            credentials: 'include'
        });

        const data = await res.json();

        if (res.ok) {
            setRoles(data);
        }
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
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(roleForm)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Failed to create role');
    }

    setRoles((currentRoles) => [
      ...currentRoles,
      data.role
    ]);

    setRoleForm({
      role_name: '',
      description: ''
    });

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
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(userForm)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Failed to create user');
    }

    // Refresh dashboard data so the new user appears immediately
    const statsRes = await fetch(`${API_BASE}/dashboard-stats`, {
      credentials: 'include'
    });

    const statsData = await statsRes.json();

    if (statsRes.ok) {
      setStats(statsData);
    }

    // Reset form
    setUserForm({
      name: '',
      email: '',
      password: '',
      role: 'Student',
      department_id: ''
    });

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
            const res = await fetch(`${API_BASE}/dashboard-stats`, {
                credentials: 'include',
            });

            const data = await res.json();

            if (res.ok) {
                setStats(data);
            }
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

    const avatarColors = ['bg-blue-900', 'bg-rose-500', 'bg-indigo-300', 'bg-emerald-600', 'bg-amber-500'];

  const users = (stats?.userList ?? []).map((u, idx) => ({
    initials: u.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.is_active ? 'Active' : 'Pending',
    statusBg: u.is_active
      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
      : 'bg-amber-50 text-amber-600 border border-amber-100',
    mfa: u.is_active, // no real MFA data exists — using is_active as a stand-in visual only
    avatarBg: avatarColors[idx % avatarColors.length],
  }));
  const filteredUsers =
  roleFilter === 'All'
    ? users
    : users.filter((user) => user.role === roleFilter);
  return (
    <div className="flex min-h-screen text-slate-800 font-sans antialiased">

      {/* Admin Sidebar */}
      <Sidenavbar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">

        {/* Top Navbar */}
        <Topnavbar />

        {/* Dashboard Content */}
        <main className="p-8 max-w-7xl w-full mx-auto space-y-6 flex-1">

          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold  text-white text-slate-900 tracking-tight">
                System Administration
              </h1>

              <p className="text-sm text-white text-slate-500 mt-1 font-medium">
                Manage users, roles, and monitor system health.
              </p>
            </div>

            <div className="flex items-center gap-3">

              {/* Export Report */}
              <button className="flex items-center gap-2 bg-white hover:bg-[#F17723] text-slate-700 border border px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors">
                <Download className="w-4 h-4" />
                Export Report
              </button>

              {/* Add User */}
              <button 
               onClick={() => {
        setAddUserError('');
        setShowAddUser(true);
    }}
    className="flex items-center gap-2 bg-white hover:bg-[#F17723] text-black px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors">
                <UserPlus className="w-4 h-4" />
                Add User
              </button>

            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            {/* Total Active Users */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">

                <div className="flex items-center space-x-1.5 text-slate-700 font-bold text-xs tracking-wider">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>TOTAL ACTIVE USERS</span>
                </div>

                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-100">
                  +12%
                </span>

              </div>

              <div className="text-3xl font-black text-slate-900 mt-4">
                 {stats?.totalActiveUsers ?? '1,248'}
              </div>
            </div>

            {/* MFA Adoption */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">

                <div className="flex items-center space-x-1.5 text-slate-700 font-bold text-xs tracking-wider">
                  <Shield className="w-4 h-4 text-indigo-600" />
                  <span>MFA ADOPTION RATE</span>
                </div>

                <span className="bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-100">
                  Needs Action
                </span>

              </div>

              <div className="text-3xl font-black text-slate-900 mt-4">
                68%
              </div>
            </div>

            {/* System Admins */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">

              <div className="flex items-center space-x-1.5 text-slate-700 font-bold text-xs tracking-wider">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>SYSTEM ADMINS</span>
              </div>

              <div className="text-3xl font-black text-slate-900 mt-4">
                 {stats?.systemAdminsCount ?? 12}
              </div>

            </div>

            {/* System Status */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden">

              <div className="absolute right-4 top-4 text-emerald-100 pointer-events-none">
                <CheckCircle2 className="w-16 h-16 opacity-30 text-emerald-500" />
              </div>

              <div>

                <div className="flex items-center space-x-1.5 text-emerald-600 font-bold text-xs tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>SYSTEM STATUS</span>
                </div>

                <div className="text-xl font-black text-emerald-600 mt-2">
                  All Systems Operational
                </div>

              </div>

              <span className="text-[10px] text-slate-400 mt-3 block">
                Last checked: 2 mins ago
              </span>

            </div>

          </div>

          {/* Lower Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

            {/* User Management */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[500px]">

              <div>

                {/* Section Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">

                  <h3 className="font-bold text-base text-slate-900">
                    User Management
                  </h3>

                  <select
  value={roleFilter}
  onChange={(e) => setRoleFilter(e.target.value)}
  className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg outline-none cursor-pointer"
>
  <option value="All">All Roles</option>
  <option value="Student">Student</option>
  <option value="Lecturer">Lecturer</option>
  <option value="HOD">HOD</option>
  <option value="Dean">Dean</option>
  <option value="Admin">Admin</option>
</select>

                </div>

                {/* Users Table */}
                <div className="overflow-x-auto pt-2">

                  <table className="w-full text-left text-xs border-collapse">

                    <thead>
                      <tr className="text-slate-400 font-semibold border-b border-slate-100 uppercase tracking-wider text-[10px]">

                        <th className="py-3 px-3">
                          USER
                        </th>

                        <th className="py-3 px-3">
                          ROLE
                        </th>

                        <th className="py-3 px-3">
                          STATUS
                        </th>

                        <th className="py-3 px-3">
                          MFA
                        </th>

                        <th className="py-3 px-3 text-right">
                          ACTIONS
                        </th>

                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 text-slate-700">

                      {(showAllUsers ? filteredUsers : filteredUsers.slice(0, 5)).map((user, index) => (
                        <tr
                          key={index}
                          className="hover:bg-slate-50/50"
                        >

                          {/* User */}
                          <td className="py-4 px-3">

                            <div className="flex items-center gap-3">

                              <div
                                className={`w-8 h-8 rounded-full ${user.avatarBg} text-white font-bold flex items-center justify-center text-xs shrink-0`}
                              >
                                {user.initials}
                              </div>

                              <div>
                                <p className="font-bold text-slate-900">
                                  {user.name}
                                </p>

                                <p className="text-[11px] text-slate-400">
                                  {user.email}
                                </p>
                              </div>

                            </div>

                          </td>

                          {/* Role */}
                          <td className="py-4 px-3 font-medium text-slate-600">
                            {user.role}
                          </td>

                          {/* Status */}
                          <td className="py-4 px-3">

                            <span
                              className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold ${user.statusBg}`}
                            >
                              {user.status}
                            </span>

                          </td>

                          {/* MFA */}
                          <td className="py-4 px-3">

                            {user.mfa ? (
                              <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <ShieldAlert className="w-4 h-4 text-amber-500" />
                            )}

                          </td>

                          {/* Actions */}
                          <td className="py-4 px-3 text-right">

                            <div className="flex items-center justify-end gap-2">

                              <button className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-50 border border-slate-200 rounded-lg">
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              <button className="p-1.5 text-rose-500 hover:text-rose-700 bg-slate-50 border border-slate-200 rounded-lg">
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

              {/* View All Users */}
              <div className="pt-4 border-t border-slate-100 text-center">

                 <button
    type="button"
    onClick={() => setShowAllUsers((current) => !current)}
    className="text-xs font-bold text-slate-700 hover:text-slate-900"
  >
    {showAllUsers ? 'Show Less' : 'View All Users'}
  </button>

              </div>

            </div>

            {/* Right Column */}
            <div className="space-y-6">

              {/* Role Settings */}
<div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">

  <div className="flex items-center justify-between pb-3 border-b border-slate-100">

    <h3 className="font-bold text-slate-900 text-base">
      Role Settings
    </h3>

    <Settings className="w-4 h-4 text-slate-400" />

  </div>

  <div className="space-y-3">

    {roles.length === 0 ? (

      <p className="text-xs text-slate-400 text-center py-4">
        No roles found.
      </p>

    ) : (

      (showAllRoles ? roles : roles.slice(0, 3)).map((role) => (

        <div
          key={role.role_id}
          className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1"
        >

          <div className="flex items-center justify-between gap-2">

            <span className="font-bold text-xs text-slate-900">
              {role.role_name}
            </span>

            <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
              Role
            </span>

          </div>

          <p className="text-[11px] text-slate-500">
            {role.description}
          </p>

        </div>

      ))

    )}

  </div>
  

  <button
    onClick={() => {
      setAddRoleError('');
      setRoleForm({
        role_name: '',
        description: ''
      });
      setShowAddRole(true);
    }}
    className="w-full py-2.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5"
  >
    <Plus className="w-3.5 h-3.5" />
    New Role
  </button>
  {roles.length > 3 && (
  <button
    type="button"
    onClick={() => setShowAllRoles((current) => !current)}
    className="w-full text-xs font-bold text-slate-700 hover:text-slate-900"
  >
    {showAllRoles ? 'Show Less' : 'View All Roles'}
  </button>
)}

</div>

              {/* Recent Audit Logs */}
<div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">

  <div className="flex items-center justify-between pb-3 border-b border-slate-100">

    <h3 className="font-bold text-slate-900 text-base">
      Recent Audit Logs
    </h3>

    <ExternalLink className="w-4 h-4 text-slate-400" />

  </div>

  <div className="space-y-4">

    {auditLogs.length === 0 ? (

      <div className="text-center py-6 text-sm text-slate-400">
        No audit activity yet.
      </div>

    ) : (

      auditLogs.slice(0, 3).map((log, index) => (

        <div
          key={log.audit_id}
          className={`border-l-2 pl-3 space-y-0.5 ${
            index === 0
              ? 'border-indigo-600'
              : index === 1
              ? 'border-emerald-500'
              : 'border-amber-500'
          }`}
        >

          <p className=" text-[13px] text-slate-900">
            {log.action}
            {log.target && `: ${log.target}`}
          </p>

          <p className="text-[11px] text-slate-400">
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
          {showAddUser && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6">

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">
                        Add New User
                    </h2>

                    <p className="text-xs text-slate-500 mt-1">
                        Create a new AAGS system account
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setShowAddUser(false)}
                    className="text-slate-400 hover:text-slate-700 text-xl"
                >
                    ×
                </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">

                {/* Name */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Full Name
                    </label>

                    <input
                        type="text"
                        value={userForm.name}
                        onChange={(e) =>
                            setUserForm({
                                ...userForm,
                                name: e.target.value
                            })
                        }
                        required
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-500"
                        placeholder="Enter full name"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Email
                    </label>

                    <input
                        type="email"
                        value={userForm.email}
                        onChange={(e) =>
                            setUserForm({
                                ...userForm,
                                email: e.target.value
                            })
                        }
                        required
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-500"
                        placeholder="user@uoc.lk"
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Temporary Password
                    </label>

                    <input
                        type="password"
                        value={userForm.password}
                        onChange={(e) =>
                            setUserForm({
                                ...userForm,
                                password: e.target.value
                            })
                        }
                        required
                        minLength={6}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-500"
                        placeholder="Minimum 6 characters"
                    />
                </div>

                {/* Role */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Role
                    </label>

                    <select
                        value={userForm.role}
                        onChange={(e) =>
                            setUserForm({
                                ...userForm,
                                role: e.target.value
                            })
                        }
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-500"
                    >
                        <option value="Student">Student</option>
                        <option value="Lecturer">Lecturer</option>
                        <option value="HOD">HOD</option>
                        <option value="Dean">Dean</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>

                {/* Department */}
                {(userForm.role === 'Student' ||
                    userForm.role === 'Lecturer') && (
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Department
                        </label>

                        <select
                            value={userForm.department_id}
                            onChange={(e) =>
                                setUserForm({
                                    ...userForm,
                                    department_id: e.target.value
                                })
                            }
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-500"
                        >
                            <option value="">Select department</option>
                            <option value="1">
                                Department of Information and Communication Technology
                            </option>
                            <option value="2">
                                Department of Biosystems Technology
                            </option>
                            <option value="3">
                                Department of Instrumentation & Automation
                            </option>
                        </select>
                    </div>
                )}

                {/* Error */}
                {addUserError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-3 py-2.5 text-xs font-medium">
                        {addUserError}
                    </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 pt-2">

                    <button
                        type="button"
                        onClick={() => setShowAddUser(false)}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={addingUser}
                        className="flex-1 py-2.5 rounded-xl bg-[#051E3D] text-white text-sm font-bold hover:bg-[#0A2B54] disabled:opacity-50"
                    >
                        {addingUser ? 'Creating...' : 'Create User'}
                    </button>

                </div>

            </form>

        </div>

    </div>
)}
{showAddRole && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

    <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6">

      <div className="flex items-center justify-between mb-6">

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Create New Role
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Add a new role to the AAGS system
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddRole(false)}
          className="text-slate-400 hover:text-slate-700 text-xl"
        >
          ×
        </button>

      </div>

      <form onSubmit={handleAddRole} className="space-y-4">

        {/* Role Name */}
        <div>

          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Role Name
          </label>

          <input
            type="text"
            value={roleForm.role_name}
            onChange={(e) =>
              setRoleForm({
                ...roleForm,
                role_name: e.target.value
              })
            }
            required
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-500"
            placeholder="e.g. Registrar"
          />

        </div>

        {/* Description */}
        <div>

          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Description
          </label>

          <textarea
            value={roleForm.description}
            onChange={(e) =>
              setRoleForm({
                ...roleForm,
                description: e.target.value
              })
            }
            required
            rows={4}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-500 resize-none"
            placeholder="Describe what this role is responsible for"
          />

        </div>

        {/* Error */}
        {addRoleError && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-3 py-2.5 text-xs font-medium">
            {addRoleError}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-2">

          <button
            type="button"
            onClick={() => setShowAddRole(false)}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={addingRole}
            className="flex-1 py-2.5 rounded-xl bg-[#051E3D] text-white text-sm font-bold hover:bg-[#0A2B54] disabled:opacity-50"
          >
            {addingRole ? 'Creating...' : 'Create Role'}
          </button>

        </div>

      </form>

    </div>

  </div>
)}

        </main>

      </div>

    </div>
  );
};

export default AdminDashboard;