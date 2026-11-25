
import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../../styles/theme.css';
import '../../styles/components.css';
import '../../styles/layout.css';

import Sidenavbar from '../../components/Sidenavbar';
import Topnavbar from '../../components/Topnavbar';

import * as XLSX from 'xlsx';

import {
  Users,
  ShieldCheck,
  Activity,
  Download,
  UserPlus,
  Settings,
  Plus,
  ChevronDown,
  Check,
  X,
  RefreshCw,
  Search,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  LoaderCircle,
  UserCheck
} from 'lucide-react';

const API_BASE = 'http://localhost:3000/api/admin';

/* =========================================
   CONSTANTS
========================================= */

const ROLE_OPTIONS = [
  { value: 'Student', label: 'Student' },
  { value: 'Lecturer', label: 'Lecturer' },
  { value: 'Dean', label: 'Dean' },
  { value: 'Medical Officer', label: 'Medical Officer' },
  { value: 'Admin', label: 'Admin' }
];

const DEPT_OPTIONS = [
  { value: '', label: 'Select department' },
  { value: '1', label: 'Information and Communication Technology' },
  { value: '2', label: 'Biosystems Technology' },
  { value: '3', label: 'Instrumentation & Automation' }
];

const INITIAL_USER_FORM = {
  name: '',
  email: '',
  password: '',
  role: 'Student',
  department_id: ''
};

const INITIAL_ROLE_FORM = {
  role_name: '',
  description: ''
};

/* =========================================
   API HELPERS
========================================= */


const apiRequest = async (endpoint, options = {}) => {
  // Get the current access token from the saved session
  let accessToken = null;

  try {
    const storedSession = sessionStorage.getItem('authSession');

    if (storedSession) {
      accessToken = JSON.parse(storedSession).accessToken;
    }
  } catch (error) {
    console.error('Failed to read authentication session:', error);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    credentials: 'include',
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
      ...(accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {}),
    },
  });

  const contentType = response.headers.get('content-type');

  const data = contentType?.includes('application/json')
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(
      data?.error || data?.message || `Request failed (${response.status})`
    );
  }

  return data;
};


const formatDate = (date) => {
  if (!date) return 'Unknown date';

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return 'Unknown date';

  return parsed.toLocaleString('en-GB', {
    timeZone: 'Asia/Colombo',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

const getInitials = (name = '') => {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || '?';
};

/* =========================================
   REUSABLE COMPONENTS
========================================= */

/* Page header */

const PageHeader = ({ title, description, children }) => (
  <div className="page-header">
    <div className="page-header-content">
      <h1 className="page-title">{title}</h1>
      <p className="page-description">{description}</p>
    </div>

    <div className="page-header-actions">
      {children}
    </div>
  </div>
);

/* Buttons */

const Button = ({
  children,
  variant = 'secondary',
  type = 'button',
  disabled = false,
  onClick,
  className = ''
}) => (
  <button
    type={type}
    disabled={disabled}
    onClick={onClick}
    className={`app-button app-button-${variant} ${className}`}
  >
    {children}
  </button>
);

/* Summary card */

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  variant = 'default'
}) => (
  <div className="stat-card">
    <div className="stat-card-header">
      <span className="stat-card-title">{title}</span>

      <div className={`stat-card-icon stat-icon-${variant}`}>
        <Icon size={19} strokeWidth={1.8} />
      </div>
    </div>

    <div className="stat-card-value">{value}</div>

    <p className="stat-card-description">{description}</p>
  </div>
);

/* Status badge */

const StatusBadge = ({ active }) => (
  <span className={`status-badge ${active ? 'status-active' : 'status-pending'}`}>
    <span className="status-dot" />
    {active ? 'Active' : 'Pending'}
  </span>
);

/* Error / success message */

const FeedbackMessage = ({ message, type = 'error' }) => {
  if (!message) return null;

  const Icon = type === 'success' ? CheckCircle2 : AlertCircle;

  return (
    <div className={`feedback-message feedback-${type}`} role="alert">
      <Icon size={16} />
      <span>{message}</span>
    </div>
  );
};

/* Custom dropdown */

const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  className = ''
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const selected = options.find(
    (option) => String(option.value) === String(value)
  );

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div className={`custom-select w-full ${className}`} ref={containerRef}>
      <button
        type="button"
        className="select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{selected?.label || placeholder}</span>

        <ChevronDown
          size={16}
          className={open ? 'select-chevron-open' : ''}
        />
      </button>

      {open && (
        <div className="select-options" role="listbox">
          {options.map((option) => (
            <button
              type="button"
              key={option.value}
              role="option"
              aria-selected={String(option.value) === String(value)}
              className={`select-option ${
                String(option.value) === String(value)
                  ? 'select-option-selected'
                  : ''
              }`}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              <span>{option.label}</span>

              {String(option.value) === String(value) && (
                <Check size={15} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* Form field */

const FormField = ({ label, required, children }) => (
  <div className="form-field">
    <label className="form-label">
      {label}
      {required && <span className="required-mark"> *</span>}
    </label>

    {children}
  </div>
);

/* Modal */

const Modal = ({
  title,
  subtitle,
  onClose,
  children,
  size = 'medium'
}) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);

    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={`modal-container modal-${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <div>
            <h2 id="modal-title" className="modal-title">
              {title}
            </h2>

            <p className="modal-subtitle">{subtitle}</p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={19} />
          </button>
        </div>

        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

/* Loading state */

const LoadingState = () => (
  <div className="loading-state">
    <LoaderCircle className="loading-spinner" size={28} />
    <p>Loading dashboard information...</p>
  </div>
);

/* Empty state */

const EmptyState = ({ message }) => (
  <div className="empty-state">
    <Users size={30} strokeWidth={1.5} />
    <p>{message}</p>
  </div>
);

/* =========================================
   MAIN ADMIN DASHBOARD
========================================= */

const AdminDashboard = () => {
  /* Dashboard data */

  const [stats, setStats] = useState(null);
  const [roles, setRoles] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  /* UI states */

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardError, setDashboardError] = useState('');

  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddRole, setShowAddRole] = useState(false);

  const [showAllUsers, setShowAllUsers] = useState(false);
  const [showAllRoles, setShowAllRoles] = useState(false);

  /* Filters */

  const [roleFilter, setRoleFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  /* Forms */

  const [userForm, setUserForm] = useState(INITIAL_USER_FORM);
  const [roleForm, setRoleForm] = useState(INITIAL_ROLE_FORM);

  const [addingUser, setAddingUser] = useState(false);
  const [addingRole, setAddingRole] = useState(false);

  const [addUserError, setAddUserError] = useState('');
  const [addRoleError, setAddRoleError] = useState('');

  const [successMessage, setSuccessMessage] = useState('');

  /* =========================================
     FETCH DASHBOARD DATA
  ========================================= */

  const fetchDashboardData = useCallback(async (showLoader = false) => {
    if (showLoader) setRefreshing(true);

    setDashboardError('');

    try {
      const [statsData, rolesData, logsData] = await Promise.all([
        apiRequest('/dashboard-stats'),
        apiRequest('/roles'),
        apiRequest('/audit-logs')
      ]);

      setStats(statsData);

      setRoles(Array.isArray(rolesData) ? rolesData : []);

      setAuditLogs(Array.isArray(logsData) ? logsData : []);

    } catch (error) {
      console.error('Dashboard fetch error:', error);
      setDashboardError(error.message || 'Unable to load dashboard data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  /* =========================================
     NORMALIZE USERS
  ========================================= */

 const users = (stats?.userList || []).map((user, index) => ({
  id: user.user_id ?? user.id ?? user.email ?? `user-${index}`,
  rowKey: `${user.user_id ?? user.id ?? user.email ?? 'user'}-${index}`,
  name: user.name || 'Unnamed User',
  email: user.email || '',
  role: user.role || 'Unknown',
  isActive: Boolean(user.is_active),
  initials: getInitials(user.name)
}));

  /* =========================================
     FILTER USERS
  ========================================= */

  const filteredUsers = users.filter((user) => {
    const matchesRole =
      roleFilter === 'All' || user.role === roleFilter;

    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      !search ||
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search);

    return matchesRole && matchesSearch;
  });

  const displayedUsers = showAllUsers
    ? filteredUsers
    : filteredUsers.slice(0, 5);

  const filterOptions = [
    { value: 'All', label: 'All Roles' },
    ...Array.from(new Set(users.map((user) => user.role)))
      .filter(Boolean)
      .map((role) => ({ value: role, label: role }))
  ];

  /* =========================================
   SUMMARY VALUES
========================================= */

const activeUsers =
  stats?.totalActiveUsers ??
  users.filter((user) => user.isActive).length;

const adminCount =
  stats?.systemAdminsCount ??
  users.filter((user) => user.role === 'Admin').length;

const pendingUsers = Number(stats?.pendingUsers ?? 0);

  /* =========================================
     ADD USER
  ========================================= */

  const handleAddUser = async (event) => {
    event.preventDefault();

    setAddingUser(true);
    setAddUserError('');
    setSuccessMessage('');

    try {
      await apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify(userForm)
      });

      setUserForm(INITIAL_USER_FORM);
      setShowAddUser(false);

      setSuccessMessage('User account created successfully.');

      await fetchDashboardData();

    } catch (error) {
      console.error('Add user error:', error);
      setAddUserError(error.message || 'Failed to create user.');
    } finally {
      setAddingUser(false);
    }
  };

  /* =========================================
     ADD ROLE
  ========================================= */

  const handleAddRole = async (event) => {
    event.preventDefault();

    setAddingRole(true);
    setAddRoleError('');
    setSuccessMessage('');

    try {
      const data = await apiRequest('/roles', {
        method: 'POST',
        body: JSON.stringify(roleForm)
      });

      if (data?.role) {
        setRoles((current) => [...current, data.role]);
      } else {
        await fetchDashboardData();
      }

      setRoleForm(INITIAL_ROLE_FORM);
      setShowAddRole(false);

      setSuccessMessage('New role created successfully.');

    } catch (error) {
      console.error('Add role error:', error);
      setAddRoleError(error.message || 'Failed to create role.');
    } finally {
      setAddingRole(false);
    }
  };

  /* =========================================
     EXPORT REPORT
  ========================================= */

  const handleExportReport = () => {
    try {
      const userData = users.map((user) => ({
        Name: user.name,
        Email: user.email,
        Role: user.role,
        Status: user.isActive ? 'Active' : 'Pending'
      }));

      const roleData = roles.map((role) => ({
        'Role Name': role.role_name,
        Description: role.description || '',
        'User Count': role.user_count ?? ''
      }));

      const auditData = auditLogs.map((log) => ({
        Action: log.action || '',
        Target: log.target || '',
        'IP Address': log.ip_address || '',
        'Date & Time': formatDate(log.created_at)
      }));

      const summaryData = [{
        'Total Users': users.length,
        'Active Users': activeUsers,
        'System Administrators': adminCount,
        'Total Roles': roles.length,
        'Audit Events': auditLogs.length,
        'Report Generated': formatDate(new Date())
      }];

      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(summaryData),
        'Summary'
      );

      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(userData),
        'Users'
      );

      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(roleData),
        'Roles'
      );

      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(auditData),
        'Audit Logs'
      );

      XLSX.writeFile(workbook, 'AAGS_Admin_Report.xlsx');

    } catch (error) {
      console.error('Report export error:', error);
      setDashboardError('Unable to generate the Excel report.');
    }
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="app-layout">

  {/* Sidebar */}
  <Sidenavbar />

  <div className="app-main">

    {/* Top navbar */}
    <Topnavbar />

    <main className="page-container admin-page">

      {/* Page header */}
      <PageHeader
        title="System Administration"
        description="Manage users, roles and monitor administrative activity."
      >
        {/* Refresh Button */}
        <Button
          variant="secondary"
          onClick={() => fetchDashboardData(true)}
          disabled={refreshing}
          className="transition-all duration-200 hover:!bg-emerald-600 hover:!text-white"
        >
          <RefreshCw
            size={16}
            className={refreshing ? 'loading-spinner' : ''}
          />
          Refresh
        </Button>

        {/* Export Report Button */}
        <Button
          variant="secondary"
          onClick={handleExportReport}
          disabled={!stats}
          className="transition-all duration-200 hover:!bg-blue-600 hover:!text-white"
        >
          <Download size={16} />
          Export Report
        </Button>

            
          </PageHeader>

          {/* Feedback */}

          <FeedbackMessage
            message={dashboardError}
            type="error"
          />

          <FeedbackMessage
            message={successMessage}
            type="success"
          />

          {loading ? (
            <LoadingState />
          ) : (
            <>

              {/* =================================
                  SUMMARY CARDS
              ================================= */}

              {/* =================================
    SUMMARY CARDS
================================= */}

<section className="stats-grid">

  <StatCard
    title="Total Users"
    value={users.length.toLocaleString()}
    description="Registered system accounts"
    icon={Users}
    variant="blue"
  />

  <StatCard
    title="Active Users"
    value={Number(activeUsers).toLocaleString()}
    description="Currently active accounts"
    icon={ShieldCheck}
    variant="green"
  />

  <StatCard
    title="Pending Approvals"
    value={pendingUsers.toLocaleString()}
    description="Awaiting account authorization"
    icon={UserCheck}
    variant="amber"
  />

  <StatCard
    title="System Administrators"
    value={Number(adminCount).toLocaleString()}
    description="Accounts with administrator privileges"
    icon={Settings}
    variant="purple"
  />

</section>

              {/* =================================
                  MAIN DASHBOARD GRID
              ================================= */}

              <section className="admin-content-grid">

                {/* USER MANAGEMENT */}

                <div className="panel user-panel">

                  <div className="panel-header">
                    <div>
                      <h2 className="panel-title">
                        User Management
                      </h2>

                      <p className="panel-description">
                        View and manage registered accounts.
                      </p>
                    </div>

                    <span className="panel-count">
                      {filteredUsers.length} users
                    </span>
                  </div>

                  {/* Filters */}

                  <div className="table-toolbar">

                    <div className="search-wrapper">
                      <Search size={16} />

                      <input
                        type="search"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(event) =>
                          setSearchTerm(event.target.value)
                        }
                        className="search-input"
                      />
                    </div>

                    <CustomSelect
                      value={roleFilter}
                      onChange={setRoleFilter}
                      options={filterOptions}
                      className="filter-select"
                    />

                  </div>

                  {/* User table */}

                  <div className="table-wrapper">

                    <table className="data-table">

                      <thead>
                        <tr>
                          <th>USER</th>
                          <th>ROLE</th>
                          <th>STATUS</th>
                        </tr>
                      </thead>

                      <tbody>

                        {displayedUsers.length === 0 ? (
                          <tr>
                            <td colSpan={3}>
                              <EmptyState message="No matching users found." />
                            </td>
                          </tr>
                        ) : (
                          displayedUsers.map((user) => (
                           <tr key={user.rowKey}>

                              <td>
                                <div className="user-cell">

                                  <div className="user-avatar">
                                    {user.initials}
                                  </div>

                                  <div className="user-details">
                                    <span className="user-name">
                                      {user.name}
                                    </span>

                                    <span className="user-email">
                                      {user.email}
                                    </span>
                                  </div>

                                </div>
                              </td>

                              <td>
                                <span className="role-label">
                                  {user.role}
                                </span>
                              </td>

                              <td>
                                <StatusBadge active={user.isActive} />
                              </td>

                            </tr>
                          ))
                        )}

                      </tbody>

                    </table>

                  </div>

                  {/* Table footer */}

                  <div className="panel-footer">

                    <span className="table-result-count">
                      Showing {displayedUsers.length} of {filteredUsers.length} users
                    </span>

                    {filteredUsers.length > 5 && (
                      <button
                        type="button"
                        className="text-action"
                        onClick={() =>
                          setShowAllUsers((current) => !current)
                        }
                      >
                        {showAllUsers ? 'Show less' : 'View all users'}
                      </button>
                    )}

                  </div>

                </div>

                {/* RIGHT COLUMN */}

                <div className="admin-side-column">

                  {/* ROLE SETTINGS */}

                  <div className="panel">

                    <div className="panel-header">

                      <div>
                        <h2 className="panel-title">
                          Role Settings
                        </h2>

                        <p className="panel-description">
                          System access roles.
                        </p>
                      </div>

                      <Settings size={19} className="panel-icon" />

                    </div>

                    <div className="role-list">

                      {roles.length === 0 ? (
                        <EmptyState message="No roles available." />
                      ) : (
                        (showAllRoles ? roles : roles.slice(0, 3)).map((role) => (
                          <div
                            className="role-item"
                            key={role.role_id}
                          >

                            <div className="role-item-header">
                              <span className="role-name">
                                {role.role_name}
                              </span>

                              <span className="role-tag">
                                Role
                              </span>
                            </div>

                            <p className="role-description">
                              {role.description || 'No description provided.'}
                            </p>

                            <div className="role-meta">
                              {role.user_count ?? 0} assigned users
                            </div>

                          </div>
                        ))
                      )}

                    </div>

                    <Button
                      variant="secondary"
                      className="full-width"
                      onClick={() => {
                        setAddRoleError('');
                        setRoleForm(INITIAL_ROLE_FORM);
                        setShowAddRole(true);
                      }}
                    >
                      <Plus size={16} />
                      Create New Role
                    </Button>

                    {roles.length > 3 && (
                      <button
                        type="button"
                        className="text-action role-expand-action"
                        onClick={() =>
                          setShowAllRoles((current) => !current)
                        }
                      >
                        {showAllRoles ? 'Show less' : 'View all roles'}
                      </button>
                    )}

                  </div>

                  {/* AUDIT LOGS */}

                  <div className="panel">

                    <div className="panel-header">

                      <div>
                        <h2 className="panel-title">
                          Recent Audit Logs
                        </h2>

                        <p className="panel-description">
                          Recent administrative activity.
                        </p>
                      </div>

                      <Activity size={19} className="panel-icon" />

                    </div>

                    <div className="audit-list">

                      {auditLogs.length === 0 ? (
                        <EmptyState message="No audit activity available." />
                      ) : (
                        auditLogs.slice(0, 5).map((log, index) => (
                          <div
                            className="audit-item"
                            key={log.audit_id ?? `${log.created_at}-${index}`}
                          >

                            <div className="audit-marker">
                              <Clock size={14} />
                            </div>

                            <div className="audit-content">

                              <p className="audit-action">
                                {log.action || 'Unknown action'}
                              </p>

                              {log.target && (
                                <p className="audit-target">
                                  Target: {log.target}
                                </p>
                              )}

                              <p className="audit-time">
                                {formatDate(log.timestamp)}
                              </p>

                            </div>

                          </div>
                        ))
                      )}

                    </div>

                  </div>

                </div>

              </section>

            </>
          )}

          {/* =================================
              ADD USER MODAL
          ================================= */}

          {showAddUser && (
            <Modal
              title="Create New User"
              subtitle="Add a new account to the AAGS system."
              onClose={() => {
                if (!addingUser) setShowAddUser(false);
              }}
            >

              <form
                onSubmit={handleAddUser}
                className="app-form"
              >

                <FormField label="Full Name" required>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter full name"
                    value={userForm.name}
                    onChange={(event) =>
                      setUserForm((current) => ({
                        ...current,
                        name: event.target.value
                      }))
                    }
                    required
                  />
                </FormField>

                <FormField label="Email Address" required>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="user@uoc.lk"
                    value={userForm.email}
                    onChange={(event) =>
                      setUserForm((current) => ({
                        ...current,
                        email: event.target.value
                      }))
                    }
                    required
                  />
                </FormField>

                <FormField label="Temporary Password" required>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Minimum 6 characters"
                    value={userForm.password}
                    onChange={(event) =>
                      setUserForm((current) => ({
                        ...current,
                        password: event.target.value
                      }))
                    }
                    minLength={6}
                    required
                  />
                </FormField>

                <FormField label="User Role" required>
                  <CustomSelect
                    value={userForm.role}
                    onChange={(value) =>
                      setUserForm((current) => ({
                        ...current,
                        role: value
                      }))
                    }
                    options={ROLE_OPTIONS}
                  />
                </FormField>

                {['Student', 'Lecturer'].includes(userForm.role) && (
                  <FormField label="Department" required>
                    <CustomSelect
                      value={userForm.department_id}
                      onChange={(value) =>
                        setUserForm((current) => ({
                          ...current,
                          department_id: value
                        }))
                      }
                      options={DEPT_OPTIONS}
                    />
                  </FormField>
                )}

                <FeedbackMessage
                  message={addUserError}
                  type="error"
                />

                <div className="modal-actions">

                  <Button
                    variant="secondary"
                    onClick={() => setShowAddUser(false)}
                    disabled={addingUser}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="primary"
                    type="submit"
                    disabled={addingUser}
                  >
                    {addingUser ? (
                      <>
                        <LoaderCircle size={16} className="loading-spinner" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} />
                        Create User
                      </>
                    )}
                  </Button>

                </div>

              </form>

            </Modal>
          )}

          {/* =================================
              ADD ROLE MODAL
          ================================= */}

          {showAddRole && (
            <Modal
              title="Create New Role"
              subtitle="Define a new role for the AAGS system."
              onClose={() => {
                if (!addingRole) setShowAddRole(false);
              }}
            >

              <form
                onSubmit={handleAddRole}
                className="app-form"
              >

                <FormField label="Role Name" required>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Registrar"
                    value={roleForm.role_name}
                    onChange={(event) =>
                      setRoleForm((current) => ({
                        ...current,
                        role_name: event.target.value
                      }))
                    }
                    required
                  />
                </FormField>

                <FormField label="Description" required>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="Describe the responsibilities of this role."
                    value={roleForm.description}
                    onChange={(event) =>
                      setRoleForm((current) => ({
                        ...current,
                        description: event.target.value
                      }))
                    }
                    rows={4}
                    required
                  />
                </FormField>

                <FeedbackMessage
                  message={addRoleError}
                  type="error"
                />

                <div className="modal-actions">

                  <Button
                    variant="secondary"
                    onClick={() => setShowAddRole(false)}
                    disabled={addingRole}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="primary"
                    type="submit"
                    disabled={addingRole}
                  >
                    {addingRole ? (
                      <>
                        <LoaderCircle size={16} className="loading-spinner" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        Create Role
                      </>
                    )}
                  </Button>

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
