
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidenavbar from '../../components/Sidenavbar';
import Topnavbar from '../../components/Topnavbar';

import {
  Plus,
  Copy,
  Save,
  Check,
  Shield,
  Users,
  Calendar,
  FileText,
  UserCheck,
  UserX,
  Trash2,
  Crown,
  ChevronDown,
  UserPlus,
} from 'lucide-react';

const API_BASE = 'http://localhost:3000/api/admin';

/* =========================================================
   THEME STYLES
========================================================= */

const panelClass = 'panel';

const primaryText = 'text-[var(--text-primary)]';
const secondaryText = 'text-[var(--text-secondary)]';

const inputClass =
  'form-input w-full';

const labelClass =
  'form-label';

const secondaryButton =
  'app-button app-button-secondary';

const primaryButton =
  'app-button app-button-primary';

const modalClass =
  'modal-container';

const closeButton =
  'modal-close';

/* =========================================================
   COMPONENT
========================================================= */

const RolesAndPermissions = () => {
  const { accessToken } = useAuth();

  const [selectedRole, setSelectedRole] = useState('');
  const [dbRoles, setDbRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  const [showAddRole, setShowAddRole] = useState(false);
  const [roleForm, setRoleForm] = useState({
    role_name: '',
    description: '',
  });
  const [addingRole, setAddingRole] = useState(false);
  const [addRoleError, setAddRoleError] = useState('');

  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  /* ADD USER */
  const [showAddUser, setShowAddUser] = useState(false);

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Student',
    department_id: '',
  });

  const [addingUser, setAddingUser] = useState(false);
  const [addUserError, setAddUserError] = useState('');

  const [isDuplicatedRole, setIsDuplicatedRole] = useState(false);
  const [originalRoleId, setOriginalRoleId] = useState(null);
  const [modalRoleName, setModalRoleName] = useState('');

  const [roleUsers, setRoleUsers] = useState([]);
  const [loadingRoleUsers, setLoadingRoleUsers] = useState(false);

  const [showAllRoles, setShowAllRoles] = useState(false);
  const [temporaryRoles, setTemporaryRoles] = useState([]);

  const [loadingUsers, setLoadingUsers] = useState(false);

  const [showDeleteRoleConfirm, setShowDeleteRoleConfirm] =
    useState(false);
  const [deletingRole, setDeletingRole] = useState(false);

  const [permissions, setPermissions] = useState([]);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [savingPermissions, setSavingPermissions] = useState(false);
  const [duplicatingRole, setDuplicatingRole] = useState(false);
  const [permissionMessage, setPermissionMessage] = useState('');

  const [userActionConfirm, setUserActionConfirm] = useState(null);
  const [userActionLoading, setUserActionLoading] = useState(false);
  const [userNotification, setUserNotification] = useState(null);

  /* PROMOTE LECTURER TO HOD */
  const [showPromoteHOD, setShowPromoteHOD] = useState(false);
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [promotingHOD, setPromotingHOD] = useState(false);
  const [promoteHODError, setPromoteHODError] = useState('');

  const USER_ROLE_OPTIONS = [
    { value: 'Student', label: 'Student' },
    { value: 'Lecturer', label: 'Lecturer' },
    { value: 'Dean', label: 'Dean' },
    { value: 'Medical Officer', label: 'Medical Officer' },
    { value: 'Admin', label: 'Admin' },
  ];

  const USER_DEPARTMENT_OPTIONS = [
    { value: '', label: 'Select department' },
    {
      value: '1',
      label: 'Information and Communication Technology',
    },
    {
      value: '2',
      label: 'Biosystems Technology',
    },
    {
      value: '3',
      label: 'Instrumentation & Automation',
    },
  ];

  const DEPARTMENTS = [
    {
      value: '1',
      label: 'Information and Communication Technology',
    },
    {
      value: '2',
      label: 'Biosystems Technology',
    },
    {
      value: '3',
      label: 'Instrumentation & Automation',
    },
  ];

  const moduleIcons = {
    'Attendance Records': UserCheck,
    'Medical Submissions': FileText,
    'Meeting Scheduler': Calendar,
    'User Management': Users,
  };

  /* =========================================================
     FETCH DATA
  ========================================================= */

  const fetchRoleUsers = async (roleName) => {
    if (!roleName) return;

    setLoadingUsers(true);

    try {
      const response = await fetch(
        `${API_BASE}/users/role/${encodeURIComponent(roleName)}`,
        { credentials: 'include' }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const contentType = response.headers.get('content-type');

      const data = contentType?.includes('application/json')
        ? await response.json()
        : [];

      setRoleUsers(data);
    } catch (error) {
      console.error('Fetch role users error:', error);
      setRoleUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch(`${API_BASE}/roles`, {
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok) {
        setDbRoles(data);
      }
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
        throw new Error(
          data.error || data.message || 'Failed to fetch permissions'
        );
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
      fetchRoleUsers(dbRoles[0].role_name);
    }
  }, [dbRoles, selectedRole]);

  /* =========================================================
     ROLE BADGES
  ========================================================= */

  const badgeMap = {
    Admin: {
      badge: 'Full Access',
      badgeColor: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    },
    Dean: {
      badge: 'High',
      badgeColor: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    },
    HOD: {
      badge: 'Elevated',
      badgeColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    },
    Lecturer: {
      badge: 'Standard',
      badgeColor:
        'bg-[var(--surface-secondary)] text-[var(--text-secondary)] border-[var(--border-color)]',
    },
    Student: {
      badge: 'Basic',
      badgeColor:
        'bg-[var(--surface-secondary)] text-[var(--text-secondary)] border-[var(--border-color)]',
    },
  };

  /* =========================================================
     ROLE ACTIONS
  ========================================================= */

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

      await fetchRoles();
    } catch (error) {
      console.error('Add role error:', error);
      setAddRoleError(error.message);
    } finally {
      setAddingRole(false);
    }
  };

  const handleDeleteRole = async () => {
    const role = dbRoles.find((r) => r.role_name === selectedRole);

    if (!role) return;

    setDeletingRole(true);
    setPermissionMessage('');

    try {
      const res = await fetch(
        `${API_BASE}/roles/${role.role_id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || data.message || 'Failed to delete role'
        );
      }

      setShowDeleteRoleConfirm(false);
      setSelectedRole('');
      setPermissions([]);
      setRoleUsers([]);

      await fetchRoles();

      setPermissionMessage('Role deleted successfully.');
    } catch (error) {
      console.error('Delete role error:', error);
      setPermissionMessage(error.message);
    } finally {
      setDeletingRole(false);
    }
  };

  const handleViewRoleUsers = async (roleName) => {
    setModalRoleName(roleName);
    setShowUsersModal(true);
    setLoadingRoleUsers(true);
    setRoleUsers([]);

    try {
      const res = await fetch(
        `${API_BASE}/users/role/${encodeURIComponent(roleName)}`,
        { credentials: 'include' }
      );

      const data = await res.json();

      if (res.ok) {
        setRoleUsers(data);
      }
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

      if (isDuplicatedRole) {
        const createRes = await fetch(`${API_BASE}/roles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            role_name: selectedRole,
            description: `Duplicated from ${
              dbRoles.find((r) => r.role_id === originalRoleId)
                ?.role_name || 'role'
            }`,
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

      const res = await fetch(
        `${API_BASE}/roles/${roleId}/permissions`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
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

      const temporaryRole = {
        role_id: `temp-${Date.now()}`,
        role_name: copyName,
        description: `${
          role.description || ''
        } (Duplicated from ${role.role_name})`,
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
          ? { ...p, [permission]: !p[permission] }
          : p
      )
    );

    setPermissionMessage('');
  };

  /* =========================================================
     USER NOTIFICATIONS
  ========================================================= */

  const showUserNotification = (type, message) => {
    setUserNotification({ type, message });

    setTimeout(() => {
      setUserNotification(null);
    }, 3500);
  };

  /* =========================================================
     ADD USER
  ========================================================= */

  const handleAddUser = async (e) => {
    e.preventDefault();

    setAddingUser(true);
    setAddUserError('');

    try {
      const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : {}),
        },
        credentials: 'include',
        body: JSON.stringify(userForm),
      });

      const contentType = response.headers.get('content-type');

      const data = contentType?.includes('application/json')
        ? await response.json()
        : {};

      if (!response.ok) {
        throw new Error(
          data.error || data.message || 'Failed to create user.'
        );
      }

      const createdRole = userForm.role;
      const createdName = userForm.name;

      setShowAddUser(false);

      setUserForm({
        name: '',
        email: '',
        password: '',
        role: 'Student',
        department_id: '',
      });

      await fetchRoles();

      if (selectedRole === createdRole) {
        await fetchRoleUsers(selectedRole);
      }

      showUserNotification(
        'success',
        `${createdName} has been created successfully.`
      );
    } catch (error) {
      console.error('Add user error:', error);
      setAddUserError(error.message);
    } finally {
      setAddingUser(false);
    }
  };

  /* =========================================================
     USER ACCOUNT ACTIONS
  ========================================================= */

  const askUserActionConfirmation = (user, action) => {
    setUserActionConfirm({ user, action });
  };

  const executeUserAction = async () => {
    if (!userActionConfirm) return;

    const { user, action } = userActionConfirm;

    setUserActionLoading(true);

    try {
      let response;

      if (action === 'activate' || action === 'deactivate') {
        response = await fetch(
          `${API_BASE}/users/${encodeURIComponent(selectedRole)}/${user.id}/status`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            credentials: 'include',
            body: JSON.stringify({
              is_active: action === 'activate',
            }),
          }
        );
      }

      if (action === 'delete') {
        response = await fetch(
          `${API_BASE}/users/${encodeURIComponent(selectedRole)}/${user.id}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            credentials: 'include',
          }
        );
      }

      const contentType = response.headers.get('content-type');

      const data = contentType?.includes('application/json')
        ? await response.json()
        : {};

      if (!response.ok) {
        throw new Error(
          data.error || data.message || `Failed to ${action} user`
        );
      }

      setUserActionConfirm(null);

      await fetchRoleUsers(selectedRole);

      const actionText = {
        activate: 'activated',
        deactivate: 'deactivated',
        delete: 'permanently deleted',
      };

      showUserNotification(
        'success',
        `${user.name} has been ${actionText[action]}.`
      );
    } catch (error) {
      console.error(`User ${action} error:`, error);
      setUserActionConfirm(null);
      showUserNotification('warning', error.message);
    } finally {
      setUserActionLoading(false);
    }
  };

  /* =========================================================
     PROMOTE LECTURER TO HOD
  ========================================================= */

  const openPromoteHODModal = (user) => {
    setSelectedLecturer(user);
    setSelectedDepartment('');
    setPromoteHODError('');
    setShowPromoteHOD(true);
  };

  const closePromoteHODModal = () => {
    if (promotingHOD) return;

    setShowPromoteHOD(false);
    setSelectedLecturer(null);
    setSelectedDepartment('');
    setPromoteHODError('');
  };

  const handlePromoteToHOD = async () => {
    if (!selectedLecturer) return;

    if (!selectedDepartment) {
      setPromoteHODError('Please select a department.');
      return;
    }

    setPromotingHOD(true);
    setPromoteHODError('');

    try {
      const response = await fetch(
        `${API_BASE}/users/${selectedLecturer.id}/promote-hod`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: 'include',
          body: JSON.stringify({
            department_id: Number(selectedDepartment),
          }),
        }
      );

      const contentType = response.headers.get('content-type');

      const data = contentType?.includes('application/json')
        ? await response.json()
        : {};

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            'Failed to promote lecturer to HOD'
        );
      }

      setShowPromoteHOD(false);
      setSelectedLecturer(null);
      setSelectedDepartment('');

      await fetchRoleUsers('Lecturer');

      showUserNotification(
        'success',
        data.message ||
          `${selectedLecturer.name} has been promoted to HOD.`
      );
    } catch (error) {
      console.error('Promote lecturer to HOD error:', error);
      setPromoteHODError(error.message);
    } finally {
      setPromotingHOD(false);
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="app-layout">
      <Sidenavbar />

      <div className="app-main">
        <Topnavbar />

        <main className="page-container admin-page">

          {/* PAGE HEADER */}
<div className="page-header">
  <div className="page-header-content">
    <h1 className="page-title">
      Roles & Permissions
    </h1>

    <p className="page-description">
      Manage role-based access control (RBAC) across faculty modules.
    </p>
  </div>

  <div className="page-header-actions">
    <button
      type="button"
      onClick={() => {
        setAddRoleError('');
        setRoleForm({ role_name: '', description: '' });
        setShowAddRole(true);
      }}
      className="app-button app-button-secondary"
    >
      <Plus size={16} />
      Create New Role
    </button>

    <button
      type="button"
      onClick={() => {
        setAddUserError('');
        setUserForm({
          name: '',
          email: '',
          password: '',
          role: 'Student',
          department_id: '',
        });
        setShowAddUser(true);
      }}
      className="app-button app-button-primary"
    >
      <UserPlus size={16} />
      Add User
    </button>
  </div>
</div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* ACTIVE ROLES */}
            <section className="lg:col-span-5">
              <div className={`${panelClass} p-5 space-y-4`}>
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
                  <div>
                    <h2 className={`font-bold ${primaryText} text-sm`}>
                      Active Roles
                    </h2>
                    <p className={`text-xs ${secondaryText} mt-1`}>
                      Manage system access levels
                    </p>
                  </div>

                  <span className="bg-[var(--surface-secondary)] text-[var(--text-secondary)] text-[10px] font-bold px-3 py-1 rounded-full">
  {loadingRoles ? '...' : `${dbRoles.length} Total`}
</span>
                </div>

                <div className="space-y-3">
                  {loadingRoles ? (
                    <p className={`text-xs ${secondaryText} text-center py-6`}>
                      Loading roles...
                    </p>
                  ) : (
                    (showAllRoles ? dbRoles : dbRoles.slice(0, 4)).map((r) => {
                      const isSelected = selectedRole === r.role_name;

                      const meta = badgeMap[r.role_name] || {
                        badge: 'Standard',
                        badgeColor:
                          'bg-[var(--surface-secondary)] text-[var(--text-secondary)] border-[var(--border-color)]',
                      };

                      return (
                        <div
                          key={r.role_id}
                          onClick={() => {
                            setSelectedRole(r.role_name);
                            fetchRolePermissions(r.role_id);
                            fetchRoleUsers(r.role_name);
                          }}
                         className={`p-4 rounded-xl transition-colors cursor-pointer space-y-2 ${
  isSelected
    ? 'bg-blue-500/10'
    : 'bg-[var(--surface-secondary)] hover:bg-[var(--surface-hover)]'
}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className={`font-bold ${primaryText} text-sm`}>
                              {r.role_name}
                            </span>

                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded border ${meta.badgeColor}`}
                            >
                              {meta.badge}
                            </span>
                          </div>

                          <p className={`text-xs ${secondaryText}`}>
                            {r.description}
                          </p>

                          <div className="flex items-center pt-1 text-[11px]">
                           <span className="bg-[var(--surface-secondary)] text-[var(--text-secondary)] px-2 py-1 rounded-lg font-medium">
  {r.user_count} Users
</span>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewRoleUsers(r.role_name);
                              }}
                              className="ml-auto text-[var(--text-primary)] hover:bg-[var(--surface-hover)] px-3 py-1 rounded-lg font-semibold text-[11px] transition-colors"
                              title={`View ${r.role_name} users`}
                            >
                              View Users
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
                    className={`w-full text-xs font-bold ${secondaryText} hover:text-[var(--text-primary)] pt-1 transition-colors`}
                  >
                    {showAllRoles
                      ? 'Show Less'
                      : `View All Roles (${dbRoles.length})`}
                  </button>
                )}
              </div>
            </section>

            {/* RIGHT COLUMN */}
            <section className="lg:col-span-7 space-y-6">

              {/* ROLE HEADER */}
              <div className={`${panelClass} p-5`}>
                <div className="flex flex-wrap items-center justify-between gap-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className={`font-bold ${primaryText} text-base`}>
                        {selectedRole || 'Select a Role'}
                      </h3>

                      <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Root Active
                      </span>
                    </div>

                    <p className={`text-xs ${secondaryText} mt-2 max-w-md leading-relaxed`}>
                      This role grants comprehensive read, write,
                      execution, and administrative privileges across
                      all system components. Handle with extreme care.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowDeleteRoleConfirm(true)}
                      disabled={
                        deletingRole ||
                        !selectedRole ||
                        selectedRole === 'Admin'
                      }
                      className="inline-flex items-center gap-1.5 bg-rose-100 hover:bg-rose-200 dark:bg-rose-500/15 dark:hover:bg-rose-500/25 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-500/30 px-3 py-2 rounded-[14px] text-xs font-bold transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Role
                    </button>

                    <button
                      type="button"
                      onClick={handleDuplicateRole}
                      disabled={duplicatingRole || !selectedRole}
                     className={`${secondaryButton} !h-10 !px-6`}
                    >
                      <Copy className="w-4.5 h-3.5" />
                      {duplicatingRole ? 'Duplicating...' : 'Duplicate'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowSaveConfirm(true)}
                      disabled={
                        savingPermissions ||
                        loadingPermissions ||
                        !selectedRole
                      }
                      className={primaryButton}
                    >
                      <Save className="w-3 h-3.5" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>

              {/* PERMISSION MESSAGE */}
              {permissionMessage && (
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-xs font-medium text-[var(--text-primary)]">
                  {permissionMessage}
                </div>
              )}

              {/* USER ACCOUNT MANAGEMENT */}
              <div className={`${panelClass} p-5 space-y-4`}>
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-color)]">
                  <div>
                    <h3 className={`font-bold ${primaryText} text-base`}>
                      User Account Management
                    </h3>

                    <p className={`text-xs ${secondaryText} mt-1`}>
                      {selectedRole === 'Lecturer'
                        ? 'Activate, deactivate, remove, or promote lecturer accounts'
                        : 'Activate, deactivate, or permanently remove user accounts'}
                    </p>
                  </div>

                  <div className={`text-xs font-semibold ${secondaryText}`}>
                    {roleUsers.length} user
                    {roleUsers.length !== 1 ? 's' : ''}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className={`font-semibold ${secondaryText} border-b border-[var(--border-color)] uppercase tracking-wider text-[10px]`}>
                        <th className="py-3 px-3">USER</th>
                        <th className="py-3 px-3">EMAIL</th>
                        <th className="py-3 px-3 text-center">STATUS</th>
                        <th className="py-3 px-3 text-right">ACTIONS</th>
                      </tr>
                    </thead>

                    <tbody className={`divide-y divide-[var(--border-color)] ${primaryText}`}>
                      {loadingUsers ? (
                        <tr>
                          <td colSpan={4} className={`py-8 text-center text-xs ${secondaryText}`}>
                            Loading users...
                          </td>
                        </tr>
                      ) : roleUsers.length === 0 ? (
                        <tr>
                          <td colSpan={4} className={`py-8 text-center text-xs ${secondaryText}`}>
                            No users found.
                          </td>
                        </tr>
                      ) : (
                        roleUsers.map((user) => (
                          <tr
                            key={user.id}
                            className="hover:bg-[var(--surface-secondary)] transition-colors"
                          >
                            {/* USER */}
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-[#0A192F] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                                  {user.name
                                    ?.split(' ')
                                    .map((n) => n[0])
                                    .slice(0, 2)
                                    .join('')
                                    .toUpperCase()}
                                </div>

                                <p className={`font-bold ${primaryText}`}>
                                  {user.name}
                                </p>
                              </div>
                            </td>

                            {/* EMAIL */}
                            <td className={`py-3 px-3 ${secondaryText}`}>
                              {user.email}
                            </td>

                            {/* STATUS */}
                            <td className="py-3 px-3 text-center">
                              {user.is_active ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-semibold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-500/10 text-[var(--text-secondary)] border border-[var(--border-color)] text-[10px] font-semibold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                  Inactive
                                </span>
                              )}
                            </td>

                            {/* ACTIONS */}
                            <td className="py-3 px-3">
                              <div className="flex flex-wrap items-center justify-end gap-2">
                                {!user.is_active && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      askUserActionConfirmation(user, 'activate')
                                    }
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors text-[10px] font-semibold"
                                  >
                                    <UserCheck className="w-3.5 h-3.5" />
                                    Activate
                                  </button>
                                )}

                                {user.is_active && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      askUserActionConfirmation(user, 'deactivate')
                                    }
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20 transition-colors text-[10px] font-semibold"
                                  >
                                    <UserX className="w-3.5 h-3.5" />
                                    Deactivate
                                  </button>
                                )}

                                {selectedRole === 'Lecturer' &&
                                  user.is_active && (
                                    <button
                                      type="button"
                                      onClick={() => openPromoteHODModal(user)}
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500/20 transition-colors text-[10px] font-semibold"
                                      title="Promote lecturer to HOD"
                                    >
                                      <Crown className="w-3.5 h-3.5" />
                                      Promote to HOD
                                    </button>
                                  )}

                                <button
                                  type="button"
                                  onClick={() =>
                                    askUserActionConfirmation(user, 'delete')
                                  }
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20 transition-colors text-[10px] font-semibold"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* =====================================================
          ADD USER MODAL
      ===================================================== */}
      {showAddUser && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`${modalClass} max-w-lg max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className={`text-xl font-bold ${primaryText}`}>
                  Create New User
                </h2>
                <p className={`text-xs ${secondaryText} mt-1`}>
                  Add a new account to the AAGS system.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!addingUser) setShowAddUser(false);
                }}
                disabled={addingUser}
                className={closeButton}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) =>
                    setUserForm((current) => ({
                      ...current,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Enter full name"
                  required
                  disabled={addingUser}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Email Address</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm((current) => ({
                      ...current,
                      email: e.target.value,
                    }))
                  }
                  placeholder="user@uoc.lk"
                  required
                  disabled={addingUser}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Temporary Password</label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={(e) =>
                    setUserForm((current) => ({
                      ...current,
                      password: e.target.value,
                    }))
                  }
                  placeholder="Minimum 6 characters"
                  minLength={6}
                  required
                  disabled={addingUser}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>User Role</label>
                <div className="relative">
                  <select
                    value={userForm.role}
                    onChange={(e) =>
                      setUserForm((current) => ({
                        ...current,
                        role: e.target.value,
                        department_id: '',
                      }))
                    }
                    required
                    disabled={addingUser}
                    className={`${inputClass} appearance-none pr-10`}
                  >
                    {USER_ROLE_OPTIONS.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${secondaryText} pointer-events-none`} />
                </div>
              </div>

              {['Student', 'Lecturer'].includes(userForm.role) && (
                <div>
                  <label className={labelClass}>Department</label>
                  <div className="relative">
                    <select
                      value={userForm.department_id}
                      onChange={(e) =>
                        setUserForm((current) => ({
                          ...current,
                          department_id: e.target.value,
                        }))
                      }
                      required
                      disabled={addingUser}
                      className={`${inputClass} appearance-none pr-10`}
                    >
                      {USER_DEPARTMENT_OPTIONS.map((department) => (
                        <option
                          key={department.value}
                          value={department.value}
                        >
                          {department.label}
                        </option>
                      ))}
                    </select>

                    <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${secondaryText} pointer-events-none`} />
                  </div>
                </div>
              )}

              {addUserError && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-px1 px-3 py-2.5 text-xs font-medium">
                  {addUserError}
                </div>
              )}

              <div className="flex gap-3 pt-2 rounded-[22px]">
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  disabled={addingUser}
                  className={`flex-1 ${secondaryButton}`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={addingUser}
                  className={`flex-1 ${primaryButton}`}
                >
                  {addingUser ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Create User
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          CREATE ROLE MODAL
      ===================================================== */}
      {showAddRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`${modalClass} max-w-lg`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className={`text-xl font-bold ${primaryText}`}>
                  Create New Role
                </h2>
                <p className={`text-xs ${secondaryText} mt-1`}>
                  Add a new role to the AAGS system.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddRole(false)}
                className={closeButton}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddRole} className="space-y-4">
              <div>
                <label className={labelClass}>Role Name</label>
                <input
                  type="text"
                  value={roleForm.role_name}
                  onChange={(e) =>
                    setRoleForm({
                      ...roleForm,
                      role_name: e.target.value,
                    })
                  }
                  required
                  className={inputClass}
                  placeholder="e.g. Registrar"
                />
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  value={roleForm.description}
                  onChange={(e) =>
                    setRoleForm({
                      ...roleForm,
                      description: e.target.value,
                    })
                  }
                  required
                  rows={4}
                  className={`${inputClass} resize-none`}
                  placeholder="Describe what this role is responsible for"
                />
              </div>

              {addRoleError && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl px-3 py-2.5 text-xs font-medium">
                  {addRoleError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddRole(false)}
                  className={`flex-1 ${secondaryButton}`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={addingRole}
                  className={`flex-1 ${primaryButton}`}
                >
                  {addingRole ? 'Creating...' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          VIEW USERS MODAL
      ===================================================== */}
      {showUsersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`${modalClass} max-w-lg max-h-[80vh] flex flex-col`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className={`text-lg font-bold ${primaryText}`}>
                  {modalRoleName} Users
                </h2>
                <p className={`text-xs ${secondaryText} mt-0.5`}>
                  {loadingRoleUsers
                    ? 'Loading...'
                    : `${roleUsers.length} user(s) found`}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowUsersModal(false)}
                className={closeButton}
              >
                ×
              </button>
            </div>

            <div className="overflow-y-auto space-y-2 flex-1">
              {loadingRoleUsers ? (
                <p className={`text-xs ${secondaryText} text-center py-8`}>
                  Loading users...
                </p>
              ) : roleUsers.length === 0 ? (
                <p className={`text-xs ${secondaryText} text-center py-8`}>
                  No users found for this role.
                </p>
              ) : (
                roleUsers.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[var(--surface-secondary)]"
                  >
                    <div className="min-w-0">
                      <p className={`text-sm font-bold ${primaryText}`}>
                        {u.name}
                      </p>
                      <p className={`text-[11px] ${secondaryText}`}>
                        {u.email}
                      </p>
                    </div>

                    {u.is_active !== undefined && (
                      <span
                        className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded ${
                          u.is_active
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        }`}
                      >
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

      {/* =====================================================
          PROMOTE TO HOD MODAL
      ===================================================== */}
      {showPromoteHOD && selectedLecturer && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`${modalClass} max-w-md`}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <Crown className="w-5 h-5" />
                </div>

                <div>
                  <h2 className={`text-lg font-bold ${primaryText}`}>
                    Promote to HOD
                  </h2>
                  <p className={`text-xs ${secondaryText} mt-1`}>
                    Assign this lecturer as a Head of Department.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closePromoteHODModal}
                disabled={promotingHOD}
                className={closeButton}
              >
                ×
              </button>
            </div>

            <div className="bg-[var(--surface-secondary)] border border-[var(--border-color)] rounded-xl p-3 mb-5">
              <p className={`text-[10px] uppercase tracking-wider font-bold ${secondaryText}`}>
                Lecturer
              </p>
              <p className={`text-sm font-bold ${primaryText} mt-1`}>
                {selectedLecturer.name}
              </p>
              <p className={`text-xs ${secondaryText} mt-0.5`}>
                {selectedLecturer.email}
              </p>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Department</label>

              <div className="relative">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  disabled={promotingHOD}
                  className={`${inputClass} appearance-none pr-10`}
                >
                  <option value="">Select department</option>

                  {DEPARTMENTS.map((department) => (
                    <option
                      key={department.value}
                      value={department.value}
                    >
                      {department.label}
                    </option>
                  ))}
                </select>

                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${secondaryText} pointer-events-none`} />
              </div>
            </div>

            {promoteHODError && (
              <div className="mt-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl px-3 py-2.5 text-xs font-medium">
                {promoteHODError}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={closePromoteHODModal}
                disabled={promotingHOD}
                className={`flex-1 ${secondaryButton}`}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handlePromoteToHOD}
                disabled={promotingHOD || !selectedDepartment}
                className={`flex-1 ${primaryButton}`}
              >
                {promotingHOD ? 'Promoting...' : 'Promote to HOD'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          SAVE CONFIRMATION
      ===================================================== */}
      {showSaveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className={`${modalClass} max-w-md`}>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
                <Save className="w-5 h-5" />
              </div>

              <div>
                <h3 className={`text-base font-bold ${primaryText}`}>
                  Save Permission Changes?
                </h3>

                <p className={`mt-1 text-sm ${secondaryText}`}>
                  Are you sure you want to save the permission changes for{' '}
                  <span className={`font-semibold ${primaryText}`}>
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
                className={secondaryButton}
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
                className={primaryButton}
              >
                {savingPermissions ? 'Saving...' : 'Confirm Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          DELETE ROLE CONFIRMATION
      ===================================================== */}
      {showDeleteRoleConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className={`${modalClass} max-w-md`}>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>

              <div>
                <h3 className={`text-base font-bold ${primaryText}`}>
                  Delete Role?
                </h3>

                <p className={`mt-1 text-sm ${secondaryText}`}>
                  Are you sure you want to permanently delete the role{' '}
                  <span className={`font-semibold ${primaryText}`}>
                    {selectedRole}
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setShowDeleteRoleConfirm(false)}
                disabled={deletingRole}
               className={`${secondaryButton} !rounded-[18px]`}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteRole}
                disabled={deletingRole}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[18px] bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors disabled:opacity-50"
              >
                {deletingRole ? 'Deleting...' : 'Delete Role'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          USER ACTION CONFIRMATION
      ===================================================== */}
      {userActionConfirm && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] w-[min(430px,calc(100%-32px))]">
          <div className="bg-[#071B38]/95 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-5">
              <div className="flex items-start gap-3">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                    userActionConfirm.action === 'delete'
                      ? 'bg-rose-500/15 text-rose-300'
                      : userActionConfirm.action === 'deactivate'
                        ? 'bg-amber-500/15 text-amber-300'
                        : 'bg-emerald-500/15 text-emerald-300'
                  }`}
                >
                  {userActionConfirm.action === 'delete' ? (
                    <Trash2 className="w-5 h-5" />
                  ) : userActionConfirm.action === 'deactivate' ? (
                    <UserX className="w-5 h-5" />
                  ) : (
                    <UserCheck className="w-5 h-5" />
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="text-white font-semibold text-sm">
                    {userActionConfirm.action === 'delete'
                      ? 'Delete User?'
                      : userActionConfirm.action === 'deactivate'
                        ? 'Deactivate User?'
                        : 'Activate User?'}
                  </h3>

                  <p className="text-white/60 text-xs mt-1 leading-relaxed">
                    {userActionConfirm.action === 'delete'
                      ? `Are you sure you want to permanently delete ${userActionConfirm.user.name}? This action cannot be undone.`
                      : userActionConfirm.action === 'deactivate'
                        ? `Are you sure you want to deactivate ${userActionConfirm.user.name}?`
                        : `Are you sure you want to activate ${userActionConfirm.user.name}?`}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex border-t border-white/10">
              <button
                type="button"
                onClick={() => setUserActionConfirm(null)}
                disabled={userActionLoading}
                className="flex-1 py-3 text-xs font-semibold text-white/60 hover:bg-white/5 transition-colors disabled:opacity-40"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={executeUserAction}
                disabled={userActionLoading}
                className={`flex-1 py-3 text-xs font-semibold border-l border-white/10 transition-colors disabled:opacity-50 ${
                  userActionConfirm.action === 'delete'
                    ? 'text-rose-300 hover:bg-rose-500/10'
                    : userActionConfirm.action === 'deactivate'
                      ? 'text-amber-300 hover:bg-amber-500/10'
                      : 'text-emerald-300 hover:bg-emerald-500/10'
                }`}
              >
                {userActionLoading
                  ? 'Processing...'
                  : userActionConfirm.action === 'delete'
                    ? 'Delete'
                    : userActionConfirm.action === 'deactivate'
                      ? 'Deactivate'
                      : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          USER NOTIFICATION
      ===================================================== */}
      {userNotification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[110] w-[min(430px,calc(100%-32px))]">
          <div
            className={`backdrop-blur-2xl rounded-2xl border shadow-2xl px-4 py-3 flex items-center gap-3 ${
              userNotification.type === 'warning'
                ? 'bg-amber-500/15 border-amber-400/25'
                : 'bg-emerald-500/15 border-emerald-400/25'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                userNotification.type === 'warning'
                  ? 'bg-amber-400/15 text-amber-300'
                  : 'bg-emerald-400/15 text-emerald-300'
              }`}
            >
              {userNotification.type === 'warning' ? (
                <span className="font-bold">!</span>
              ) : (
                <Check className="w-4 h-4" />
              )}
            </div>

            <div className="min-w-0">
              <p className="text-white text-xs font-semibold">
                {userNotification.type === 'warning' ? 'Warning' : 'Success'}
              </p>

              <p className="text-white/70 text-[11px] mt-0.5">
                {userNotification.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesAndPermissions;
