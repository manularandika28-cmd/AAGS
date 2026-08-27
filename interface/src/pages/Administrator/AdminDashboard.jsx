import React from 'react';
import AdminSidenavbar from '../../components/AdminSidenavbar';
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

const AdminDashboard = () => {
  const users = [
    {
      initials: 'Dr',
      name: 'Dr. Anil Perera',
      email: 'anil.p@fot.cmb.ac.lk',
      role: 'Faculty Member',
      status: 'Active',
      statusBg:
        'bg-emerald-50 text-emerald-600 border border-emerald-100',
      mfa: true,
      avatarBg: 'bg-blue-900'
    },
    {
      initials: 'SW',
      name: 'Sarah Wijesinghe',
      email: 'sarah.w@admin.cmb.ac.lk',
      role: 'System Admin',
      status: 'Active',
      statusBg:
        'bg-emerald-50 text-emerald-600 border border-emerald-100',
      mfa: true,
      avatarBg: 'bg-rose-500'
    },
    {
      initials: 'KJ',
      name: 'Kamal Jayathilake',
      email: 'kamal.j@fot.cmb.ac.lk',
      role: 'Data Entry Staff',
      status: 'Pending',
      statusBg:
        'bg-amber-50 text-amber-600 border border-amber-100',
      mfa: false,
      avatarBg: 'bg-indigo-300'
    }
  ];

  return (
    <div className="flex min-h-screen text-slate-800 font-sans antialiased">

      {/* Admin Sidebar */}
      <AdminSidenavbar />

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
              <button className="flex items-center gap-2 bg-white hover:bg-[#F17723] text-black px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors">
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
                1,248
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
                12
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

                  <button className="flex items-center space-x-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                    <span>All Roles</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

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

                      {users.map((user, index) => (
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

                <a
                  href="/Admin/users"
                  className="text-xs font-bold text-slate-700 hover:text-slate-900"
                >
                  View All Users
                </a>

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

                  {/* System Admin */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">

                    <div className="flex items-center justify-between">

                      <span className="font-bold text-xs text-slate-900">
                        System Admin
                      </span>

                      <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                        Full Access
                      </span>

                    </div>

                    <p className="text-[11px] text-slate-500">
                      Manage users, global settings, audit logs.
                    </p>

                  </div>

                  {/* Faculty Member */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">

                    <div className="flex items-center justify-between">

                      <span className="font-bold text-xs text-slate-900">
                        Faculty Member
                      </span>

                      <span className="bg-rose-50 text-rose-600 border border-rose-100 text-[10px] font-bold px-2 py-0.5 rounded">
                        Restricted
                      </span>

                    </div>

                    <p className="text-[11px] text-slate-500">
                      View academic records, schedule meetings.
                    </p>

                  </div>

                </div>

                <button className="w-full py-2.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  New Role
                </button>

              </div>

              {/* Recent Audit Logs */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">

                <div className="flex items-center justify-between pb-3 border-b border-slate-100">

                  <h3 className="font-bold text-slate-900 text-base">
                    Recent Audit Logs
                  </h3>

                  <ExternalLink className="w-4 h-4 text-slate-400" />

                </div>

                <div className="space-y-3 text-xs">

                  {/* Audit 1 */}
                  <div className="border-l-2 border-indigo-600 pl-3 space-y-0.5">

                    <p className="font-bold text-slate-900">
                      Role updated: Faculty Member
                    </p>

                    <p className="text-[11px] text-slate-400">
                      By S. Wijesinghe • 10:42 AM
                    </p>

                  </div>

                  {/* Audit 2 */}
                  <div className="border-l-2 border-emerald-500 pl-3 space-y-0.5">

                    <p className="font-bold text-slate-900">
                      User login successful
                    </p>

                    <p className="text-[11px] text-slate-400">
                      Dr. A. Perera (IP: 192.168.1.45) • 09:15 AM
                    </p>

                  </div>

                  {/* Audit 3 */}
                  <div className="border-l-2 border-amber-500 pl-3 space-y-0.5">

                    <p className="font-bold text-slate-900">
                      Failed login attempt
                    </p>

                    <p className="text-[11px] text-slate-400">
                      Unknown User (IP: 45.33.22.1) • 08:02 AM
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
};

export default AdminDashboard;