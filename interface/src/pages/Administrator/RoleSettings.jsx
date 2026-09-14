import React, { useEffect, useState } from 'react';
import Sidenavbar from '../../components/Sidenavbar';
import Topnavbar from '../../components/Topnavbar';
import {
  Users,
  UserCheck,
  FileText,
  CalendarDays,
  Shield,
  ShieldCheck,
  Lock,
  Save,
  RotateCcw,
  Check,
  X,
  AlertTriangle
} from 'lucide-react';

const API_BASE = 'http://localhost:3000/api/admin';

const moduleIcons = {
  'Attendance Records': UserCheck,
  'Medical Submissions': FileText,
  'Meeting Scheduler': CalendarDays,
  'User Management': Users
};

const RoleSettings = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);

  const [permissions, setPermissions] = useState([]);
  const [originalPermissions, setOriginalPermissions] = useState([]);

  const [loadingRoles, setLoadingRoles] = useState(true);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);
      setError('');

      const response = await fetch(`${API_BASE}/roles`, {
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || 'Failed to fetch roles'
        );
      }

      setRoles(data);

      if (data.length > 0) {
        setSelectedRoleId(String(data[0].role_id));
      }
    } catch (err) {
      console.error('Fetch roles error:', err);
      setError(err.message);
    } finally {
      setLoadingRoles(false);
    }
  };

  const fetchPermissions = async (roleId) => {
    if (!roleId) return;

    try {
      setLoadingPermissions(true);
      setError('');
      setMessage('');

      const response = await fetch(
        `${API_BASE}/roles/${roleId}/permissions`,
        {
          credentials: 'include'
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || 'Failed to fetch permissions'
        );
      }

      const formattedPermissions = data.permissions.map((permission) => ({
        ...permission,
        module: permission.module_name,
        icon: moduleIcons[permission.module_name] || Shield
      }));

      setPermissions(formattedPermissions);

      setOriginalPermissions(
        JSON.parse(JSON.stringify(formattedPermissions))
      );
    } catch (err) {
      console.error('Fetch permissions error:', err);
      setPermissions([]);
      setOriginalPermissions([]);
      setError(err.message);
    } finally {
      setLoadingPermissions(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (!selectedRoleId) return;

    const role = roles.find(
      (item) => String(item.role_id) === String(selectedRoleId)
    );

    setSelectedRole(role || null);

    fetchPermissions(selectedRoleId);
  }, [selectedRoleId, roles]);

  const isProtectedRole =
    selectedRole?.role_name === 'Admin';

  const togglePermission = (moduleId, permissionName) => {
    if (isProtectedRole) {
      return;
    }

    setPermissions((currentPermissions) =>
      currentPermissions.map((permission) => {
        if (permission.module_id !== moduleId) {
          return permission;
        }

        return {
          ...permission,
          [permissionName]: !permission[permissionName]
        };
      })
    );

    setMessage('');
    setError('');
  };

  const handleReset = () => {
    setPermissions(
      JSON.parse(JSON.stringify(originalPermissions))
    );

    setMessage('');
    setError('');
  };

  const handleSave = async () => {
    if (!selectedRoleId || isProtectedRole) {
      return;
    }

    try {
      setSaving(true);
      setError('');
      setMessage('');

      const response = await fetch(
        `${API_BASE}/roles/${selectedRoleId}/permissions`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            permissions: permissions.map((permission) => ({
              module_id: permission.module_id,
              can_view: permission.can_view,
              can_create: permission.can_create,
              can_delete: permission.can_delete,
              can_approve: permission.can_approve
            }))
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || 'Failed to save permissions'
        );
      }

      setOriginalPermissions(
        JSON.parse(JSON.stringify(permissions))
      );

      setMessage('Permissions saved successfully.');

      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (err) {
      console.error('Save permissions error:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const getPermissionValue = (permission, key) => {
    return Boolean(permission[key]);
  };

  return (
    <div className="flex min-h-screen text-slate-800 font-sans antialiased">

      <Sidenavbar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">

        <Topnavbar />

        <main className="p-8 max-w-[1500px] w-full mx-auto space-y-6 flex-1">

          {/* PAGE HEADER */}
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Role Settings
            </h1>

            <p className="text-sm text-white mt-1 font-medium">
              Manage role-based permissions and access control.
            </p>
          </div>


          {/* MESSAGES */}

          {message && (
            <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">

              <CheckCircleIcon />

              <span className="text-sm font-semibold">
                {message}
              </span>

            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">

              <AlertTriangle className="w-5 h-5 shrink-0" />

              <span className="text-sm font-semibold">
                {error}
              </span>

            </div>
          )}


          {/* MAIN LAYOUT */}

          <div className="grid grid-cols-1 xl:grid-cols-[340px_minmax(0,1fr)] gap-6 items-start">


            {/* LEFT COLUMN */}

            <div className="space-y-6">


              {/* SELECT ROLE */}

              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">

                <div className="flex items-center gap-3 mb-6">

                  <div className="p-2.5 rounded-xl bg-[#071B38] text-white">
                    <ShieldCheck className="w-5 h-5" />
                  </div>

                  <div>

                    <h2 className="text-lg font-bold text-slate-900">
                      Select Role
                    </h2>

                    <p className="text-xs text-slate-500 mt-0.5">
                      Choose a role to manage.
                    </p>

                  </div>

                </div>


                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  System Role
                </label>


                <select
                  value={selectedRoleId}
                  onChange={(event) =>
                    setSelectedRoleId(event.target.value)
                  }
                  disabled={loadingRoles}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-[#071B38] focus:ring-2 focus:ring-[#071B38]/10 transition"
                >

                  {loadingRoles ? (

                    <option>
                      Loading roles...
                    </option>

                  ) : (

                    roles.map((role) => (

                      <option
                        key={role.role_id}
                        value={role.role_id}
                      >
                        {role.role_name}
                      </option>

                    ))

                  )}

                </select>


                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">

                  <Users className="w-3.5 h-3.5" />

                  <span>
                    {selectedRole?.user_count ?? 0} users assigned
                  </span>

                </div>

              </section>


              {/* SELECTED ROLE CARD */}

              {selectedRole && (

                <section
                  className={`rounded-2xl border shadow-sm overflow-hidden ${
                    isProtectedRole
                      ? 'border-amber-200'
                      : 'border-slate-200'
                  }`}
                >

                  {/* ROLE HEADER */}

                  <div
                    className={`px-5 py-[30px] ${
                      isProtectedRole
                        ? 'bg-amber-50'
                        : 'bg-white'
                    }`}
                  >

                    <div className="flex items-start gap-3">

                      <div
                        className={`p-3 rounded-xl shrink-0 ${
                          isProtectedRole
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >

                        {isProtectedRole ? (
                          <Lock className="w-5 h-5" />
                        ) : (
                          <Shield className="w-5 h-5" />
                        )}

                      </div>


                      <div className="min-w-0">

                        <div className="flex items-center gap-2 flex-wrap">

                          <h2 className="text-lg font-extrabold text-slate-900">
                            {selectedRole.role_name}
                          </h2>


                          {isProtectedRole && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">

                              <Lock className="w-3 h-3" />

                              Protected

                            </span>
                          )}

                        </div>


                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                          {selectedRole.description}
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* ROLE STATISTICS */}

                  <div className="bg-white border-t border-slate-100 grid grid-cols-2">

                    <div className="p-4 border-r border-slate-100">

                      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                        Assigned Users
                      </p>

                      <p className="text-xl font-extrabold text-slate-900 mt-1">
                        {selectedRole.user_count ?? 0}
                      </p>

                    </div>


                    <div className="p-4">

                      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                        Permissions
                      </p>

                      <p className="text-xl font-extrabold text-slate-900 mt-1">

                        {permissions.filter(
                          (permission) =>
                            permission.can_view ||
                            permission.can_create ||
                            permission.can_delete ||
                            permission.can_approve
                        ).length}

                      </p>

                    </div>

                  </div>


                  {/* PROTECTED NOTICE */}

                  {isProtectedRole && (

                    <div className="px-5 py-3 bg-amber-50 border-t border-amber-200">

                      <div className="flex items-start gap-2.5">

                        <Lock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />

                        <div>

                          <p className="text-xs font-bold text-amber-800">
                            Protected System Role
                          </p>

                          <p className="text-[11px] text-amber-700 mt-1 leading-relaxed">
                            Admin permissions are predefined and cannot be changed by administrators.
                          </p>

                        </div>

                      </div>

                    </div>

                  )}

                </section>

              )}

            </div>


            {/* RIGHT COLUMN */}

            {isProtectedRole ? (

  <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

    {/* Permission Header */}
    <div className="px-5 py-3 border-b border-slate-200">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>

          <div className="flex items-center gap-2">

            <div className="p-2.5 rounded-xl bg-[#071B38] text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                Admin Permissions
              </h2>

              <p className="text-xs text-slate-500 mt-0.5">
                System administrator permissions are predefined.
              </p>

            </div>

          </div>

        </div>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-[11px] font-bold">
          <Lock className="w-3.5 h-3.5" />
          Protected
        </span>

      </div>

    </div>


    {/* Same Table Header Dimensions */}
    <div className="hidden md:grid grid-cols-[minmax(0,1fr)_90px_90px_90px_90px] gap-3 px-6 py-3 bg-slate-50 border-b border-slate-100 text-[10px] uppercase tracking-wider font-bold text-slate-500">

      <div>
        Module
      </div>

      <div className="text-center">
        View
      </div>

      <div className="text-center">
        Create
      </div>

      <div className="text-center">
        Delete
      </div>

      <div className="text-center">
        Approve
      </div>

    </div>


    {/* Same Permission Rows */}
    <div className="divide-y divide-slate-100">

      {permissions.map((permission) => {

        const Icon =
          permission.icon || Shield;

        return (

          <div
            key={permission.module_id}
            className={`px-6 py-2 ${
              permission.module_name === 'User Management'
                ? 'bg-rose-50/20'
                : ''
            }`}
          >

            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_90px_90px_90px_90px] gap-4 items-center">

              {/* Module */}
              <div className="flex items-start gap-3">

                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>

                <div className="min-w-0">

                  <p className="font-bold text-slate-900">
                    {permission.module_name}
                  </p>

                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {permission.description}
                  </p>

                </div>

              </div>


              {/* View */}
              <PermissionControl
                label="View"
                enabled={getPermissionValue(
                  permission,
                  'can_view'
                )}
                disabled
              />


              {/* Create */}
              <PermissionControl
                label="Create"
                enabled={getPermissionValue(
                  permission,
                  'can_create'
                )}
                disabled
              />


              {/* Delete */}
              <PermissionControl
                label="Delete"
                enabled={getPermissionValue(
                  permission,
                  'can_delete'
                )}
                disabled
              />


              {/* Approve */}
              <PermissionControl
                label="Approve"
                enabled={getPermissionValue(
                  permission,
                  'can_approve'
                )}
                disabled
              />

            </div>

          </div>

        );

      })}

    </div>


    {/* Same Bottom Area Height */}
    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">

      <div className="flex items-center gap-2">

        <Lock className="w-4 h-4 text-amber-600 shrink-0" />

        <div>

          <p className="text-xs font-bold text-slate-700">
            Protected System Role
          </p>

          <p className="text-[11px] text-slate-400 mt-0.5">
            Admin permissions are predefined and cannot be changed by administrators.
          </p>

        </div>

      </div>

    </div>

  </section>

            ) : (

              /* NORMAL ROLE PERMISSION MANAGER */

              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                {/* PERMISSION HEADER */}

                <div className="px-5 py-3 border-b border-slate-200">

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                    <div>

                      <div className="flex items-center gap-2">

                        <div className="p-2.5 rounded-xl bg-[#071B38] text-white">

                          <ShieldCheck className="w-5 h-5" />

                        </div>


                        <div>

                          <h2 className="text-lg font-bold text-slate-900">
                            Permission Manager
                          </h2>

                          <p className="text-xs text-slate-500 mt-0.5">

                            {selectedRole
                              ? `Manage permissions for ${selectedRole.role_name}.`
                              : 'Select a role to manage permissions.'}

                          </p>

                        </div>

                      </div>

                    </div>


                    {/* LEGEND */}

                    <div className="flex items-center gap-2">

                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-bold">

                        <Check className="w-3.5 h-3.5" />

                        Granted

                      </span>


                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-500 text-[11px] font-bold">

                        <X className="w-3.5 h-3.5" />

                        Denied

                      </span>

                    </div>

                  </div>

                </div>


                {/* TABLE HEADER */}

                <div className="hidden md:grid grid-cols-[minmax(0,1fr)_90px_90px_90px_90px] gap-3 px-6 py-3 bg-slate-50 border-b border-slate-100 text-[10px] uppercase tracking-wider font-bold text-slate-500">

                  <div>
                    Module
                  </div>

                  <div className="text-center">
                    View
                  </div>

                  <div className="text-center">
                    Create
                  </div>

                  <div className="text-center">
                    Delete
                  </div>

                  <div className="text-center">
                    Approve
                  </div>

                </div>


                {/* PERMISSION CONTENT */}

                {loadingPermissions ? (

                  <div className="py-20 text-center">

                    <div className="inline-flex items-center gap-2 text-sm text-slate-400">
                      Loading permissions...
                    </div>

                  </div>

                ) : permissions.length === 0 ? (

                  <div className="py-20 text-center">

                    <Shield className="w-10 h-10 mx-auto text-slate-300" />

                    <p className="mt-3 text-sm font-semibold text-slate-500">
                      No permissions found for this role.
                    </p>

                  </div>

                ) : (

                  <div className="divide-y divide-slate-100">

                    {permissions.map((permission) => {

                      const Icon =
                        permission.icon || Shield;

                      return (

                        <div
                          key={permission.module_id}
                          className={`px-6 py-2 ${
                            permission.module_name === 'User Management'
                              ? 'bg-rose-50/20'
                              : ''
                          }`}
                        >

                          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_90px_90px_90px_90px] gap-4 items-center">

                            {/* MODULE */}

                            <div className="flex items-start gap-3">

                              <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 shrink-0">

                                <Icon className="w-5 h-5" />

                              </div>


                              <div className="min-w-0">

                                <p className="font-bold text-slate-900">
                                  {permission.module_name}
                                </p>

                                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                  {permission.description}
                                </p>


                                {permission.module_name === 'User Management' && (

                                  <p className="text-[10px] text-rose-500 font-semibold mt-1.5">
                                    Restricted system module
                                  </p>

                                )}

                              </div>

                            </div>


                            {/* VIEW */}

                            <PermissionControl
                              label="View"
                              enabled={getPermissionValue(
                                permission,
                                'can_view'
                              )}
                              disabled={false}
                              onClick={() =>
                                togglePermission(
                                  permission.module_id,
                                  'can_view'
                                )
                              }
                            />


                            {/* CREATE */}

                            <PermissionControl
                              label="Create"
                              enabled={getPermissionValue(
                                permission,
                                'can_create'
                              )}
                              disabled={false}
                              onClick={() =>
                                togglePermission(
                                  permission.module_id,
                                  'can_create'
                                )
                              }
                            />


                            {/* DELETE */}

                            <PermissionControl
                              label="Delete"
                              enabled={getPermissionValue(
                                permission,
                                'can_delete'
                              )}
                              disabled={false}
                              onClick={() =>
                                togglePermission(
                                  permission.module_id,
                                  'can_delete'
                                )
                              }
                            />


                            {/* APPROVE */}

                            <PermissionControl
                              label="Approve"
                              enabled={getPermissionValue(
                                permission,
                                'can_approve'
                              )}
                              disabled={false}
                              onClick={() =>
                                togglePermission(
                                  permission.module_id,
                                  'can_approve'
                                )
                              }
                            />

                          </div>

                        </div>

                      );

                    })}

                  </div>

                )}


                {/* ACTION BAR */}

                {selectedRole && (

                  <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                    <div>

                      <p className="text-xs font-bold text-slate-700">
                        Permission changes
                      </p>

                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Changes are not applied until you save.
                      </p>

                    </div>


                    <div className="flex items-center gap-2">

                      <button
                        type="button"
                        onClick={handleReset}
                        disabled={saving || loadingPermissions}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs font-bold hover:bg-slate-100 disabled:opacity-50 transition"
                      >

                        <RotateCcw className="w-3.5 h-3.5" />

                        Reset

                      </button>


                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving || loadingPermissions}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#071B38] text-white text-xs font-bold hover:bg-[#0A264D] disabled:opacity-50 transition"
                      >

                        <Save className="w-3.5 h-3.5" />

                        {saving
                          ? 'Saving...'
                          : 'Save Permissions'}

                      </button>

                    </div>

                  </div>

                )}

              </section>

            )}

          </div>

        </main>

      </div>

    </div>
  );
};


const PermissionControl = ({
  label,
  enabled,
  disabled,
  onClick
}) => {

  return (

    <div className="flex items-center justify-between md:block">

      <span className="md:hidden text-xs font-bold text-slate-500">
        {label}
      </span>


      <div className="flex justify-center">

        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          aria-label={`${label} permission`}
          className={`inline-flex items-center justify-center w-9 h-9 rounded-xl transition ${
            enabled
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-100 text-slate-400'
          } ${
            disabled
              ? 'cursor-not-allowed opacity-80'
              : 'cursor-pointer hover:scale-105'
          }`}
        >

          {enabled ? (
            <Check className="w-4 h-4" />
          ) : (
            <X className="w-4 h-4" />
          )}

        </button>

      </div>

    </div>

  );
};


const CheckCircleIcon = () => (

  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">

    <Check className="w-3 h-3" />

  </div>

);


export default RoleSettings;