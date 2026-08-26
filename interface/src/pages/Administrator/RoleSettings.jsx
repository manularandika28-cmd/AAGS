import React, { useState } from 'react';
import AdminSidenavbar from '../../components/AdminSidenavbar';
import Topnavbar from '../../components/Topnavbar';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  BriefcaseMedical,
  CalendarDays,
  FileText,
  Settings,
  Save,
  RotateCcw,
  CheckCircle2,
  Shield,
  Lock,
  ChevronDown
} from 'lucide-react';

const RoleSettings = () => {
  const [selectedRole, setSelectedRole] = useState('System Admin');
  const [saved, setSaved] = useState(false);

  const roles = [
    {
      name: 'System Admin',
      description: 'Full access to system administration and management.',
      users: 12,
      badge: 'Full Access'
    },
    {
      name: 'Faculty Member',
      description: 'Manage academic activities and student interactions.',
      users: 86,
      badge: 'Academic'
    },
    {
      name: 'Medical Staff',
      description: 'Manage student medical records and documents.',
      users: 8,
      badge: 'Medical'
    },
    {
      name: 'Data Entry Staff',
      description: 'Enter and update permitted student information.',
      users: 14,
      badge: 'Restricted'
    },
    {
      name: 'Student',
      description: 'Access personal academic and student services.',
      users: 1128,
      badge: 'Basic Access'
    }
  ];

  const permissionGroups = [
    {
      title: 'User Management',
      description: 'Control access to user accounts and account administration.',
      icon: Users,
      permissions: [
        {
          id: 'view_users',
          name: 'View Users',
          description: 'View registered users and account information.'
        },
        {
          id: 'create_users',
          name: 'Create Users',
          description: 'Create new student, staff, or administrator accounts.'
        },
        {
          id: 'edit_users',
          name: 'Edit Users',
          description: 'Modify user account information.'
        },
        {
          id: 'deactivate_users',
          name: 'Activate / Deactivate Users',
          description: 'Change the active status of user accounts.'
        }
      ]
    },
    {
      title: 'Academic Records',
      description: 'Control access to academic information and records.',
      icon: GraduationCap,
      permissions: [
        {
          id: 'view_academic',
          name: 'View Academic Records',
          description: 'View student academic records and results.'
        },
        {
          id: 'edit_academic',
          name: 'Edit Academic Records',
          description: 'Create and modify academic records.'
        },
        {
          id: 'manage_attendance',
          name: 'Manage Attendance',
          description: 'View and update student attendance.'
        },
        {
          id: 'export_academic',
          name: 'Export Academic Data',
          description: 'Export academic information and reports.'
        }
      ]
    },
    {
      title: 'Meeting Management',
      description: 'Control student and staff meeting functionality.',
      icon: CalendarDays,
      permissions: [
        {
          id: 'view_meetings',
          name: 'View Meetings',
          description: 'View scheduled meetings and appointments.'
        },
        {
          id: 'create_meetings',
          name: 'Create Meetings',
          description: 'Schedule meetings with students or staff.'
        },
        {
          id: 'manage_meetings',
          name: 'Manage Meetings',
          description: 'Edit, reschedule, or cancel meetings.'
        }
      ]
    },
    {
      title: 'Medical Hub',
      description: 'Control access to student medical information.',
      icon: BriefcaseMedical,
      permissions: [
        {
          id: 'view_medical',
          name: 'View Medical Records',
          description: 'View student medical information.'
        },
        {
          id: 'manage_medical',
          name: 'Manage Medical Records',
          description: 'Review and update medical records.'
        },
        {
          id: 'verify_documents',
          name: 'Verify Medical Documents',
          description: 'Approve or reject uploaded medical documents.'
        }
      ]
    },
    {
      title: 'Audit Logs',
      description: 'Control access to system activity and security logs.',
      icon: FileText,
      permissions: [
        {
          id: 'view_audit',
          name: 'View Audit Logs',
          description: 'View recorded system activities and changes.'
        },
        {
          id: 'export_audit',
          name: 'Export Audit Logs',
          description: 'Export audit records for administrative review.'
        }
      ]
    },
    {
      title: 'System Administration',
      description: 'Control sensitive system-level administration functions.',
      icon: Settings,
      permissions: [
        {
          id: 'manage_roles',
          name: 'Manage Roles',
          description: 'Create, edit, and configure system roles.'
        },
        {
          id: 'system_config',
          name: 'System Configuration',
          description: 'Modify global system configuration.'
        }
      ]
    }
  ];

  const defaultPermissions = {
    'System Admin': [
      'view_users',
      'create_users',
      'edit_users',
      'deactivate_users',
      'view_academic',
      'edit_academic',
      'manage_attendance',
      'export_academic',
      'view_meetings',
      'create_meetings',
      'manage_meetings',
      'view_medical',
      'manage_medical',
      'verify_documents',
      'view_audit',
      'export_audit',
      'manage_roles',
      'system_config'
    ],

    'Faculty Member': [
      'view_academic',
      'edit_academic',
      'manage_attendance',
      'export_academic',
      'view_meetings',
      'create_meetings',
      'manage_meetings'
    ],

    'Medical Staff': [
      'view_medical',
      'manage_medical',
      'verify_documents',
      'view_meetings'
    ],

    'Data Entry Staff': [
      'view_users',
      'edit_users',
      'view_academic',
      'edit_academic'
    ],

    Student: [
      'view_academic',
      'view_meetings',
      'create_meetings',
      'view_medical'
    ]
  };

  const [permissions, setPermissions] = useState(
    defaultPermissions[selectedRole]
  );

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setPermissions(defaultPermissions[role] || []);
    setSaved(false);
  };

  const togglePermission = (permissionId) => {
    setPermissions((current) => {
      if (current.includes(permissionId)) {
        return current.filter((id) => id !== permissionId);
      }

      return [...current, permissionId];
    });

    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  const handleReset = () => {
    setPermissions(defaultPermissions[selectedRole] || []);
    setSaved(false);
  };

  const selectedRoleData = roles.find(
    (role) => role.name === selectedRole
  );

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">

      {/* Sidebar */}
      <AdminSidenavbar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">

        {/* Top Navbar */}
        <Topnavbar />

        {/* Main Content */}
        <main className="p-8 max-w-7xl w-full mx-auto space-y-6 flex-1">

          {/* Header */}
          <div className="flex items-center justify-between">

            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Role Settings
              </h1>

              <p className="text-sm text-slate-500 mt-1 font-medium">
                Manage role-based permissions and access control.
              </p>
            </div>

            <div className="flex items-center gap-3">

              <button
                onClick={handleReset}
                className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>

              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-[#0A192F] hover:bg-[#1E3A8A] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>

            </div>
          </div>

          {/* Success Message */}
          {saved && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 flex items-center gap-3">

              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />

              <div>
                <p className="text-xs font-bold text-emerald-700">
                  Role permissions saved successfully
                </p>

                <p className="text-[10px] text-emerald-600 mt-0.5">
                  Changes to {selectedRole} permissions have been applied.
                </p>
              </div>

            </div>
          )}

          {/* Role Selection + Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Role List */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">

              <div className="flex items-center justify-between pb-4 border-b border-slate-100">

                <div>
                  <h2 className="font-bold text-base text-slate-900">
                    System Roles
                  </h2>

                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Select a role to manage.
                  </p>
                </div>

                <Shield className="w-4 h-4 text-slate-300" />

              </div>

              <div className="space-y-2 pt-4">

                {roles.map((role) => {
                  const isSelected = selectedRole === role.name;

                  return (
                    <button
                      key={role.name}
                      onClick={() => handleRoleChange(role.name)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-[#051E3D] border-[#051E3D] text-white shadow-sm'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                      }`}
                    >

                      <div className="flex items-center justify-between gap-2">

                        <div className="flex items-center gap-2">

                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                              isSelected
                                ? 'bg-white/10 text-white'
                                : 'bg-white text-slate-500'
                            }`}
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </div>

                          <span className="text-xs font-bold">
                            {role.name}
                          </span>

                        </div>

                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        )}

                      </div>

                      <div className="flex items-center justify-between mt-2">

                        <span
                          className={`text-[10px] ${
                            isSelected
                              ? 'text-slate-300'
                              : 'text-slate-400'
                          }`}
                        >
                          {role.users} users
                        </span>

                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                            isSelected
                              ? 'bg-white/10 text-slate-200'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {role.badge}
                        </span>

                      </div>

                    </button>
                  );
                })}

              </div>

            </div>

            {/* Selected Role Information */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">

              <div className="flex items-center justify-between pb-4 border-b border-slate-100">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>

                  <div>
                    <h2 className="font-bold text-base text-slate-900">
                      {selectedRole}
                    </h2>

                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {selectedRoleData?.description}
                    </p>
                  </div>

                </div>

                <div className="text-right">

                  <p className="text-xl font-black text-slate-900">
                    {permissions.length}
                  </p>

                  <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                    Permissions
                  </p>

                </div>

              </div>

              {/* Permission Summary */}
              <div className="grid grid-cols-3 gap-3 pt-5">

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">

                  <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                    Assigned Users
                  </p>

                  <p className="text-lg font-black text-slate-900 mt-1">
                    {selectedRoleData?.users}
                  </p>

                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">

                  <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                    Active Permissions
                  </p>

                  <p className="text-lg font-black text-emerald-600 mt-1">
                    {permissions.length}
                  </p>

                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">

                  <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                    Access Level
                  </p>

                  <p className="text-sm font-black text-slate-900 mt-1">
                    {selectedRoleData?.badge}
                  </p>

                </div>

              </div>

              <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-3">

                <Lock className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />

                <div>

                  <p className="text-[11px] font-bold text-blue-700">
                    Role-based access control
                  </p>

                  <p className="text-[10px] text-blue-600 mt-0.5">
                    Permission changes apply to every user assigned to this role.
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* Permissions */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">

            <div className="flex items-center justify-between pb-4 border-b border-slate-100">

              <div>

                <h2 className="font-bold text-base text-slate-900">
                  Permissions
                </h2>

                <p className="text-[10px] text-slate-400 mt-0.5">
                  Configure what {selectedRole} members can access.
                </p>

              </div>

              <button className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700">
                {selectedRole}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-5">

              {permissionGroups.map((group) => {

                const Icon = group.icon;

                return (
                  <div
                    key={group.title}
                    className="border border-slate-200 rounded-xl overflow-hidden"
                  >

                    {/* Permission Group Header */}
                    <div className="bg-slate-50 p-4 border-b border-slate-200">

                      <div className="flex items-center gap-3">

                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </div>

                        <div>
                          <h3 className="text-xs font-bold text-slate-900">
                            {group.title}
                          </h3>

                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {group.description}
                          </p>
                        </div>

                      </div>

                    </div>

                    {/* Permission Items */}
                    <div className="px-4">

                      {group.permissions.map((permission) => {

                        const enabled = permissions.includes(
                          permission.id
                        );

                        return (
                          <div
                            key={permission.id}
                            className="flex items-center justify-between gap-4 py-3 border-b border-slate-100 last:border-b-0"
                          >

                            <div className="min-w-0">

                              <p className="text-xs font-bold text-slate-800">
                                {permission.name}
                              </p>

                              <p className="text-[10px] text-slate-400 mt-0.5">
                                {permission.description}
                              </p>

                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                togglePermission(permission.id)
                              }
                              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
                                enabled
                                  ? 'bg-emerald-500'
                                  : 'bg-slate-300'
                              }`}
                            >

                              <span
                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 mt-0.5 ${
                                  enabled
                                    ? 'translate-x-4'
                                    : 'translate-x-0.5'
                                }`}
                              />

                            </button>

                          </div>
                        );
                      })}

                    </div>

                  </div>
                );
              })}

            </div>

          </div>

          {/* Bottom Save Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

            <div className="flex items-start gap-3">

              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>

              <div>

                <h3 className="text-sm font-bold text-slate-900">
                  Permission Changes
                </h3>

                <p className="text-[11px] text-slate-400 mt-0.5">
                  Changes will affect all users assigned to the{' '}
                  {selectedRole} role.
                </p>

              </div>

            </div>

            <div className="flex items-center gap-3 shrink-0">

              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A192F] text-white text-xs font-bold hover:bg-[#1E3A8A] transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Permissions
              </button>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
};

export default RoleSettings;