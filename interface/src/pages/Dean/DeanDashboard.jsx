import React from 'react';
import { Users, UserCheck, ClipboardX, Download, TrendingUp } from 'lucide-react';

import Sidenavbar from '../../components/Sidenavbar';
import Topnavbar from '../../components/Topnavbar';

// =========================================
// MOCK DATA
// Replace this with real API data once the
// backend endpoints are ready.
// =========================================
const STATS = [
  {
    id: 'enrolled',
    label: 'Total Enrolled Students',
    value: '4,250',
    icon: Users,
    iconBg: 'bg-slate-100',
    iconColor: 'text-[#071B38]',
    footer: '+3.2% vs last semester',
    footerColor: 'text-emerald-600',
    footerIcon: TrendingUp,
  },
  {
    id: 'attendance',
    label: 'Faculty Attendance Avg.',
    value: '94.8%',
    icon: UserCheck,
    iconBg: 'bg-slate-100',
    iconColor: 'text-[#071B38]',
    footer: 'Target: 90%',
    footerColor: 'text-emerald-600',
    footerIcon: null,
  },
  {
    id: 'approvals',
    label: 'Pending Final Approvals',
    value: '12',
    icon: ClipboardX,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
    footer: 'Action required',
    footerColor: 'text-red-500',
    footerIcon: null,
    highlight: true,
  },
];

export default function DeanDashboard() {
  return (
    <div className="flex min-h-screen ">
      {/* Shared sidebar */}
      <Sidenavbar activeItem="dashboard" role="Dean" />

      <div className="flex-1 flex flex-col">
        {/* Shared topbar */}
        <Topnavbar
          title="Dean Dashboard - AAGS"
          searchPlaceholder="Search resources..."
          userName="Prof. N. Perera"
          userRole="Dean, FOT"
        />

        <main className="flex-1 p-8">
          {/* Page header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Dean's Dashboard
              </h1>
              <p className="text-sm text-white/70 mt-1">
                High-level strategic overview for the Faculty of Technology.
              </p>
            </div>

            <button
              type="button"
              className="flex items-center gap-2 bg-[#071B38] hover:bg-[#0a2549] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
            >
              <Download size={16} />
              Generate Report
            </button>
          </div>

          <hr className="border-slate-200 mb-6" />

          {/* Stat cards */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
  {STATS.map((stat) => {
    const Icon = stat.icon;
    const FooterIcon = stat.footerIcon;

    return (
      <div
        key={stat.id}
        className={`rounded-2xl p-5 shadow-xl backdrop-blur-2xl border ${
          stat.highlight
            ? 'bg-white/10 border-red-300/40 shadow-red-900/20'
            : 'bg-white/10 border-white/30'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white/90">
            {stat.label}
          </span>
          <span className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center">
            <Icon size={16} className="text-white" />
          </span>
        </div>

        <div className="text-4xl font-bold text-white mt-4">
          {stat.value}
        </div>

        <div className="flex items-center gap-1 text-xs font-medium mt-2 text-white/70">
          {FooterIcon && <FooterIcon size={12} />}
          {stat.highlight && <span className="text-red-300">&#9888;</span>}
          {stat.footer}
        </div>
      </div>
    );
  })}
</div>
        </main>
      </div>
    </div>
  );
}