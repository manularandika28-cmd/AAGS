import React, { useState, useEffect } from 'react';
import Sidenavbar from '../../components/Sidenavbar';
import Topnavbar from '../../components/Topnavbar';
const API_BASE = 'http://localhost:3000/api/admin';
import {
  Plus,
  Copy,
  Save,
  Check,
  Shield,
  Users,
  Calendar,
  FileText,
  UserCheck
} from 'lucide-react';

const RolesAndPermissions = () => {
  const [selectedRole, setSelectedRole] = useState('System Admin');
   const [dbRoles, setDbRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [showAddRole, setShowAddRole] = useState(false);
  const [roleForm, setRoleForm] = useState({ role_name: '', description: '' });
  const [addingRole, setAddingRole] = useState(false);
  const [addRoleError, setAddRoleError] = useState('');
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [modalRoleName, setModalRoleName] = useState('');
  const [roleUsers, setRoleUsers] = useState([]);
  const [loadingRoleUsers, setLoadingRoleUsers] = useState(false);
  const [showAllRoles, setShowAllRoles] = useState(false);
  

  

  const permissions = [
    { module: 'Attendance Records', desc: 'Student tracking & reporting', icon: UserCheck, view: true, create: true, delete: true, approve: false },
    { module: 'Medical Submissions', desc: 'Certificates & approvals', icon: FileText, view: true, create: true, delete: true, approve: true },
    { module: 'Meeting Scheduler', desc: 'Agendas & minutes', icon: Calendar, view: true, create: true, delete: true, approve: false },
    { module: 'User Management', desc: 'Restricted core module', icon: Users, view: true, create: true, delete: false, approve: true, isRestricted: true },
  ];
      const fetchRoles = async () => {
    try {
      const res = await fetch(`${API_BASE}/roles`, { credentials: 'include' });
      const data = await res.json();
      if (res.ok) setDbRoles(data);
    } catch (err) {
      console.error('Fetch roles error:', err);
    } finally {
      setLoadingRoles(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const badgeMap = {
    Admin: { badge: 'Full Access', badgeColor: 'bg-rose-50 text-rose-600 border-rose-100' },
    Dean: { badge: 'High', badgeColor: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    HOD: { badge: 'Elevated', badgeColor: 'bg-blue-50 text-blue-600 border-blue-100' },
    Lecturer: { badge: 'Standard', badgeColor: 'bg-slate-100 text-slate-600 border-slate-200' },
    Student: { badge: 'Basic', badgeColor: 'bg-slate-100 text-slate-600 border-slate-200' },
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
        body: JSON.stringify(roleForm),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create role');
      }

      setRoleForm({ role_name: '', description: '' });
      setShowAddRole(false);
      fetchRoles();
    } catch (error) {
      console.error('Add role error:', error);
      setAddRoleError(error.message);
    } finally {
      setAddingRole(false);
    }
  };

  const handleViewRoleUsers = async (roleName) => {
    setModalRoleName(roleName);
    setShowUsersModal(true);
    setLoadingRoleUsers(true);
    setRoleUsers([]);

    try {
      const res = await fetch(`${API_BASE}/users/role/${roleName}`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) setRoleUsers(data);
    } catch (err) {
      console.error('Fetch role users error:', err);
    } finally {
      setLoadingRoleUsers(false);
    }
  };

  

  return (
    <div className="flex min-h-screen  text-slate-800 font-sans antialiased">
      <Sidenavbar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        

        <main className="p-8 max-w-7xl w-full mx-auto space-y-6 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 text-white tracking-tight">Roles & Permissions</h1>
              <p className="text-sm text-slate-500 text-white mt-1 font-medium">
                Manage role-based access control (RBAC) across faculty modules.
              </p>
            </div>

                        <button
              onClick={() => {
                setAddRoleError('');
                setRoleForm({ role_name: '', description: '' });
                setShowAddRole(true);
              }}
              className="flex items-center gap-2 bg-white hover:bg-[#9fb6d4] text-black px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create New Role
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-bold text-slate-900 text-sm">Active Roles</span>
                 <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {loadingRoles ? '...' : `${dbRoles.length} Total`}
                </span>
              </div>

                            <div className="space-y-3">
                {loadingRoles ? (
                  <p className="text-xs text-slate-400 text-center py-6">Loading roles...</p>
                ) : (
                      (showAllRoles ? dbRoles : dbRoles.slice(0, 4)).map((r) => {
                    const isSelected = selectedRole === r.role_name;
                    const meta = badgeMap[r.role_name] || {
                      badge: 'Standard',
                      badgeColor: 'bg-slate-100 text-slate-600 border-slate-200',
                    };

                    return (
                      <div
                        key={r.role_id}
                        onClick={() => {
                          setSelectedRole(r.role_name);
                          handleViewRoleUsers(r.role_name);
                        }}
                        className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-sm">{r.role_name}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${meta.badgeColor}`}>
                            {meta.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{r.description}</p>
                        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                            {r.user_count} Users
                          </span>
                        </div>
                      </div>
                    );
                  })
                                )}
              </div>

              {dbRoles.length > 3 && (
                <button
                  type="button"
                  onClick={() => setShowAllRoles((current) => !current)}
                  className="w-full text-xs font-bold text-slate-700 hover:text-slate-900 pt-1"
                >
                  {showAllRoles ? 'Show Less' : `View All Roles (${dbRoles.length})`}
                </button>
              )}
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between  min-h-40">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">{selectedRole}</h3>
                    <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Root Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 max-w-md">
                    This role grants comprehensive read, write, execution, and administrative privileges across all system components. Handle with extreme care.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition-colors">
                    <Copy className="w-3.5 h-3.5" /> Duplicate
                  </button>
                  <button className="flex items-center gap-1.5 bg-[#0A192F] hover:bg-[#1E3A8A] text-white px-3 py-2 rounded-xl text-xs font-bold transition-colors">
                    <Save className="w-3.5 h-3.5" /> Save Changes
                  </button>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-base">Module Permissions Matrix</h3>
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Granted</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-slate-200" /> Denied</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="text-slate-400 font-semibold border-b border-slate-100 uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-3">MODULE / RESOURCE</th>
                        <th className="py-3 px-3 text-center">VIEW</th>
                        <th className="py-3 px-3 text-center">CREATE/EDIT</th>
                        <th className="py-3 px-3 text-center">DELETE</th>
                        <th className="py-3 px-3 text-center">APPROVE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {permissions.map((p, idx) => {
                        const Icon = p.icon;
                        return (
                          <tr key={idx} className={p.isRestricted ? 'bg-rose-50/20' : 'hover:bg-slate-50/50'}>
                            <td className="py-3 px-3 flex items-start gap-2.5">
                              <div className="p-2 bg-slate-100 text-slate-700 rounded-lg shrink-0 mt-0.5">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{p.module}</p>
                                <p className={`text-[11px] ${p.isRestricted ? 'text-rose-500 font-medium' : 'text-slate-400'}`}>
                                  {p.desc}
                                </p>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <div className="inline-flex items-center justify-center w-6 h-6 rounded bg-[#0A192F] text-white">
                                <Check className="w-3.5 h-3.5" />
                              </div>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <div className="inline-flex items-center justify-center w-6 h-6 rounded bg-[#0A192F] text-white">
                                <Check className="w-3.5 h-3.5" />
                              </div>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <div className={`inline-flex items-center justify-center w-6 h-6 rounded ${p.delete ? 'bg-[#0A192F] text-white' : 'border border-slate-200 bg-white'}`}>
                                {p.delete && <Check className="w-3.5 h-3.5" />}
                              </div>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <div className={`inline-flex items-center justify-center w-6 h-6 rounded ${p.approve ? 'bg-[#0A192F] text-white' : 'border border-slate-200 bg-white'}`}>
                                {p.approve && <Check className="w-3.5 h-3.5" />}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
                </main>
      </div>

      {showAddRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6">

            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Create New Role</h2>
                <p className="text-xs text-slate-500 mt-1">Add a new role to the AAGS system</p>
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
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Role Name</label>
                <input
                  type="text"
                  value={roleForm.role_name}
                  onChange={(e) => setRoleForm({ ...roleForm, role_name: e.target.value })}
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-500"
                  placeholder="e.g. Registrar"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Description</label>
                <textarea
                  value={roleForm.description}
                  onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-500 resize-none"
                  placeholder="Describe what this role is responsible for"
                />
              </div>

              {addRoleError && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-3 py-2.5 text-xs font-medium">
                  {addRoleError}
                </div>
              )}

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

      {showUsersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{modalRoleName} Users</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {loadingRoleUsers ? 'Loading...' : `${roleUsers.length} user(s) found`}
                </p>
              </div>
              <button type="button" onClick={() => setShowUsersModal(false)} className="text-slate-400 hover:text-slate-700 text-xl">×</button>
            </div>

            <div className="overflow-y-auto space-y-2 flex-1">
              {loadingRoleUsers ? (
                <p className="text-xs text-slate-400 text-center py-8">Loading users...</p>
              ) : roleUsers.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">No users found for this role.</p>
              ) : (
                roleUsers.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{u.name}</p>
                      <p className="text-[11px] text-slate-400">{u.email}</p>
                    </div>
                    {u.is_active !== undefined && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        u.is_active
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {u.is_active ? 'Active' : 'Pending'}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesAndPermissions;