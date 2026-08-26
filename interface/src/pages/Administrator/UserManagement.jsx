import React, { useState } from 'react';
import Sidenavbar from '../../components/AdminSidenavbar';
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
  UserCheck
} from 'lucide-react';

const RolesAndPermissions = () => {
  const [selectedRole, setSelectedRole] = useState('System Admin');

  const roles = [
    { name: 'System Admin', badge: 'Full Access', badgeColor: 'bg-rose-50 text-rose-600 border-rose-100', users: '3 Users', modified: 'Last modified: Today' },
    { name: 'Dean', badge: 'High', badgeColor: 'bg-indigo-50 text-indigo-600 border-indigo-100', users: '1 User' },
    { name: 'Head of Dept (HOD)', badge: 'Elevated', badgeColor: 'bg-blue-50 text-blue-600 border-blue-100', users: '8 Users' },
    { name: 'Lecturer', badge: 'Standard', badgeColor: 'bg-slate-100 text-slate-600 border-slate-200', users: '124 Users' },
    { name: 'Student', badge: 'Basic', badgeColor: 'bg-slate-100 text-slate-600 border-slate-200', users: '3,450+ Users' },
  ];

  const permissions = [
    { module: 'Attendance Records', desc: 'Student tracking & reporting', icon: UserCheck, view: true, create: true, delete: true, approve: false },
    { module: 'Medical Submissions', desc: 'Certificates & approvals', icon: FileText, view: true, create: true, delete: true, approve: true },
    { module: 'Meeting Scheduler', desc: 'Agendas & minutes', icon: Calendar, view: true, create: true, delete: true, approve: false },
    { module: 'User Management', desc: 'Restricted core module', icon: Users, view: true, create: true, delete: false, approve: true, isRestricted: true },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      <Sidenavbar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Topnavbar />

        <main className="p-8 max-w-7xl w-full mx-auto space-y-6 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Roles & Permissions</h1>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                Manage role-based access control (RBAC) across faculty modules.
              </p>
            </div>

            <button className="flex items-center gap-2 bg-[#0A192F] hover:bg-[#1E3A8A] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors">
              <Plus className="w-4 h-4" />
              Create New Role
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-bold text-slate-900 text-sm">Active Roles</span>
                <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">5 Total</span>
              </div>

              <div className="space-y-3">
                {roles.map((r, idx) => {
                  const isSelected = selectedRole === r.name;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedRole(r.name)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{r.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${r.badgeColor}`}>
                          {r.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {r.name === 'System Admin' 
                          ? 'Complete control over all faculty modules and user management.' 
                          : r.name === 'Dean'
                          ? 'Executive oversight and final approval authority for all departments.'
                          : r.name === 'Head of Dept (HOD)'
                          ? 'Department-level management, approvals, and reporting.'
                          : r.name === 'Lecturer'
                          ? 'Manage course attendance, internal medicals, and personal schedule.'
                          : 'View-only access to personal records and submissions.'}
                      </p>
                      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{r.users}</span>
                        {r.modified && <span>{r.modified}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
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
    </div>
  );
};

export default RolesAndPermissions;