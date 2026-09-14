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
  const [selectedRole, setSelectedRole] = useState('');
   const [dbRoles, setDbRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [showAddRole, setShowAddRole] = useState(false);
  const [roleForm, setRoleForm] = useState({ role_name: '', description: '' });
  const [addingRole, setAddingRole] = useState(false);
  const [addRoleError, setAddRoleError] = useState('');
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [isDuplicatedRole, setIsDuplicatedRole] = useState(false);
  const [originalRoleId, setOriginalRoleId] = useState(null);
  const [modalRoleName, setModalRoleName] = useState('');
  const [roleUsers, setRoleUsers] = useState([]);
  const [loadingRoleUsers, setLoadingRoleUsers] = useState(false);
  const [showAllRoles, setShowAllRoles] = useState(false);
  const [temporaryRoles, setTemporaryRoles] = useState([]);
  

  

  const [permissions, setPermissions] = useState([]);
const [loadingPermissions, setLoadingPermissions] = useState(false);
const [savingPermissions, setSavingPermissions] = useState(false);
const [duplicatingRole, setDuplicatingRole] = useState(false);
const [permissionMessage, setPermissionMessage] = useState('');

const moduleIcons = {
  'Attendance Records': UserCheck,
  'Medical Submissions': FileText,
  'Meeting Scheduler': Calendar,
  'User Management': Users,
};
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

  const fetchRolePermissions = async (roleId) => {
  setLoadingPermissions(true);
  setPermissionMessage('');

  try {
    const res = await fetch(
      `${API_BASE}/roles/${roleId}/permissions`,
      { credentials: 'include' }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || data.message || 'Failed to fetch permissions');
    }

    const formattedPermissions = data.permissions.map((p) => ({
      ...p,
      module: p.module_name,
      desc: p.description,
      icon: moduleIcons[p.module_name] || Shield,
      isRestricted: p.module_name === 'User Management',
    }));

    setPermissions(formattedPermissions);
  } catch (error) {
    console.error('Fetch permissions error:', error);
    setPermissions([]);
    setPermissionMessage(error.message);
  } finally {
    setLoadingPermissions(false);
  }
};

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
  if (!selectedRole && dbRoles.length > 0) {
    setSelectedRole(dbRoles[0].role_name);
    fetchRolePermissions(dbRoles[0].role_id);
  }
}, [dbRoles, selectedRole]);

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

  const handleSavePermissions = async () => {
  const role = dbRoles.find((r) => r.role_name === selectedRole);

  setSavingPermissions(true);
  setPermissionMessage('');

  try {
    let roleId = role?.role_id;

    // Temporary duplicated role → create it in database first
    if (isDuplicatedRole) {
      const createRes = await fetch(`${API_BASE}/roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          role_name: selectedRole,
          description: `Duplicated from ${dbRoles.find(
            (r) => r.role_id === originalRoleId
          )?.role_name || 'role'}`,
        }),
      });

      const createData = await createRes.json();

      if (!createRes.ok) {
        throw new Error(
          createData.error ||
          createData.message ||
          'Failed to create duplicated role'
        );
      }

      roleId = createData.role?.role_id;

      if (!roleId) {
        throw new Error('New role ID was not returned by the server.');
      }
    }

    if (!roleId) {
      throw new Error('Role not found.');
    }

    // Save permissions
    const res = await fetch(
      `${API_BASE}/roles/${roleId}/permissions`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          permissions: permissions.map((p) => ({
            module_id: p.module_id,
            can_view: p.can_view,
            can_create: p.can_create,
            can_delete: p.can_delete,
            can_approve: p.can_approve,
          })),
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.error || data.message || 'Failed to save permissions'
      );
    }

    setIsDuplicatedRole(false);
    setOriginalRoleId(null);

    await fetchRoles();

    setPermissionMessage('Changes saved successfully.');
  } catch (error) {
    console.error('Save permissions error:', error);
    setPermissionMessage(error.message);
  } finally {
    setSavingPermissions(false);
  }
};

const handleDuplicateRole = async () => {
  const role = dbRoles.find((r) => r.role_name === selectedRole);

  if (!role) return;

  setDuplicatingRole(true);
  setPermissionMessage('');

  try {
    const res = await fetch(
      `${API_BASE}/roles/${role.role_id}/permissions`,
      { credentials: 'include' }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.error || data.message || 'Failed to duplicate role'
      );
    }

    // Create a unique temporary role name
    const existingNames = [
      ...dbRoles.map((r) => r.role_name),
      ...temporaryRoles.map((r) => r.role_name),
    ];

    let copyName = `${role.role_name} Copy`;
    let copyNumber = 2;

    while (existingNames.includes(copyName)) {
      copyName = `${role.role_name} Copy ${copyNumber}`;
      copyNumber++;
    }

    // Temporary role object
    const temporaryRole = {
      role_id: `temp-${Date.now()}`,
      role_name: copyName,
      description: `${role.description || ''} (Duplicated from ${role.role_name})`,
      user_count: 0,
      isTemporary: true,
      originalRoleId: role.role_id,
    };

    setTemporaryRoles((current) => [...current, temporaryRole]);

    setSelectedRole(copyName);
    setOriginalRoleId(role.role_id);
    setIsDuplicatedRole(true);

    setPermissions(
      data.permissions.map((p) => ({
        ...p,
        module: p.module_name,
        desc: p.description,
        icon: moduleIcons[p.module_name] || Shield,
        isRestricted: p.module_name === 'User Management',
      }))
    );

    setPermissionMessage(
      `"${copyName}" is a temporary copy. Save Changes to keep it after refresh.`
    );
  } catch (error) {
    console.error('Duplicate role error:', error);
    setPermissionMessage(error.message);
  } finally {
    setDuplicatingRole(false);
  }
};

const togglePermission = (moduleId, permission) => {
  setPermissions((current) =>
    current.map((p) =>
      p.module_id === moduleId
        ? {
            ...p,
            [permission]: !p[permission],
          }
        : p
    )
  );

  setPermissionMessage('');
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
  fetchRolePermissions(r.role_id);
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
                        <div className="flex items-center pt-1 text-[11px] text-slate-400">
  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
    {r.user_count} Users
  </span>

  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      handleViewRoleUsers(r.role_name);
    }}
    className="ml-auto bg-slate-100 text-slate-600 hover:bg-slate-200 px-2 py-0.5 rounded font-medium text-[11px] border-0 focus:outline-none transition-colors"
    title={`View ${r.role_name} users`}
  >
    View
  </button>
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
                  <button
  type="button"
  onClick={handleDuplicateRole}
  disabled={duplicatingRole || !selectedRole}
  className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
>
  <Copy className="w-3.5 h-3.5" />
  {duplicatingRole ? 'Duplicating...' : 'Duplicate'}
</button>
                  <button
  type="button"
  onClick={() => setShowSaveConfirm(true)}
  disabled={savingPermissions || loadingPermissions || !selectedRole}
  className="flex items-center gap-1.5 bg-[#0A192F] hover:bg-[#1E3A8A] text-white px-3 py-1 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
>
  <Save className="w-3.5 h-3.5" />
  Save Changes
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
  {loadingPermissions ? (
    <tr>
      <td
        colSpan={5}
        className="py-8 text-center text-xs text-slate-400"
      >
        Loading permissions...
      </td>
    </tr>
  ) : permissions.length === 0 ? (
    <tr>
      <td
        colSpan={5}
        className="py-8 text-center text-xs text-slate-400"
      >
        No permissions found.
      </td>
    </tr>
  ) : (
    permissions.map((p, idx) => {
      const Icon = p.icon;

      return (
        <tr
          key={p.module_id || idx}
          className={
            p.isRestricted
              ? 'bg-rose-50/20'
              : 'hover:bg-slate-50/50'
          }
        >
          {/* MODULE */}
          <td className="py-3 px-3">
            <div className="flex items-start gap-2.5">
              <div className="p-2 bg-slate-100 text-slate-700 rounded-lg shrink-0 mt-0.5">
                <Icon className="w-4 h-4" />
              </div>

              <div>
                <p className="font-bold text-slate-900">
                  {p.module}
                </p>

                <p
                  className={`text-[11px] ${
                    p.isRestricted
                      ? 'text-rose-500 font-medium'
                      : 'text-slate-400'
                  }`}
                >
                  {p.desc}
                </p>
              </div>
            </div>
          </td>

          {/* VIEW */}
          <td className="py-3 px-3 text-center">
            <div
              className={`inline-flex items-center justify-center w-6 h-6 rounded ${
                p.can_view
                  ? 'bg-[#0A192F] text-white'
                  : 'border border-slate-200 bg-white'
              }`}
            >
              {p.can_view && (
                <Check className="w-3.5 h-3.5" />
              )}
            </div>
          </td>

          {/* CREATE / EDIT */}
          <td className="py-3 px-3 text-center">
            <div
              className={`inline-flex items-center justify-center w-6 h-6 rounded ${
                p.can_create
                  ? 'bg-[#0A192F] text-white'
                  : 'border border-slate-200 bg-white'
              }`}
            >
              {p.can_create && (
                <Check className="w-3.5 h-3.5" />
              )}
            </div>
          </td>

          {/* DELETE */}
          <td className="py-3 px-3 text-center">
            <div
              className={`inline-flex items-center justify-center w-6 h-6 rounded ${
                p.can_delete
                  ? 'bg-[#0A192F] text-white'
                  : 'border border-slate-200 bg-white'
              }`}
            >
              {p.can_delete && (
                <Check className="w-3.5 h-3.5" />
              )}
            </div>
          </td>

          {/* APPROVE */}
          <td className="py-3 px-3 text-center">
            <div
              className={`inline-flex items-center justify-center w-6 h-6 rounded ${
                p.can_approve
                  ? 'bg-[#0A192F] text-white'
                  : 'border border-slate-200 bg-white'
              }`}
            >
              {p.can_approve && (
                <Check className="w-3.5 h-3.5" />
              )}
            </div>
          </td>
        </tr>
      );
    })
  )}
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
      {showSaveConfirm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl border border-slate-200 p-6">
      
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 text-amber-600">
          <Save className="w-5 h-5" />
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900">
            Save Permission Changes?
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Are you sure you want to save the permission changes for{' '}
            <span className="font-semibold text-slate-700">
              {selectedRole}
            </span>
            ? These changes will be saved to the database.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <button
          type="button"
          onClick={() => setShowSaveConfirm(false)}
          className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={async () => {
            setShowSaveConfirm(false);
            await handleSavePermissions();
          }}
          disabled={savingPermissions}
          className="px-4 py-2 rounded-xl bg-[#0A192F] hover:bg-[#1E3A8A] text-white text-xs font-bold transition-colors disabled:opacity-50"
        >
          {savingPermissions ? 'Saving...' : 'Confirm Save'}
        </button>
      </div>

    </div>
  </div>
)}
    </div>
  );
};

export default RolesAndPermissions;