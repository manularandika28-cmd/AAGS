import React, { useState } from 'react';
import {
  Download,
  Plus,
  ClipboardX,
  Calendar as CalendarIcon,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Clock,
} from 'lucide-react';

import Sidenavbar from '../../components/Sidenavbar';
import Topnavbar from '../../components/Topnavbar';

// =========================================
// MOCK DATA
// Replace with real API data once the
// backend endpoints are ready.
// =========================================
const SUMMARY_STATS = [
  {
    id: 'pending',
    label: 'Pending Approvals',
    value: '12',
    icon: ClipboardX,
    iconBg: 'bg-slate-100',
    iconColor: 'text-[#071B38]',
    footer: '+3 since yesterday',
    footerColor: 'text-amber-600',
  },
  {
    id: 'today',
    label: "Today's Meetings",
    value: '5',
    icon: CalendarIcon,
    iconBg: 'bg-slate-100',
    iconColor: 'text-[#071B38]',
    footer: 'Next: 10:30 AM (HOD IAT)',
    footerColor: 'text-slate-500',
  },
  {
    id: 'escalated',
    label: 'Escalated (Student)',
    value: '2',
    icon: AlertTriangle,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
    footer: 'Requires immediate attention',
    footerColor: 'text-red-500',
    highlight: true,
  },
];

const QUICK_FILTERS = ['IAT Dept', 'AT Dept', 'High Urgency'];

const PRIORITY_REQUESTS = [
  {
    id: 1,
    initials: 'SR',
    title: 'Curriculum Revision Approval',
    tag: 'HIGH URGENCY',
    tagColor: 'bg-red-100 text-red-600',
    requestedBy: 'Dr. S. Rathnayake (HOD - ICT)',
    description:
      'Requires final sign-off on the proposed curriculum changes for the upcoming semester before Senate submission.',
    meta: ['Proposed: Tomorrow, 10:00 AM', '30 mins'],
    actions: [
      { label: 'Decline', variant: 'ghost' },
      { label: 'Delegate', variant: 'outline' },
      { label: 'Approve & Schedule', variant: 'solid' },
    ],
    accent: 'border-l-red-400',
  },
  {
    id: 2,
    initials: 'KP',
    avatar: true,
    title: 'Special Medical Leave Appeal',
    tag: 'STUDENT ESCALATION',
    tagColor: 'bg-amber-100 text-amber-700',
    requestedBy: 'K. Perera (ET Dept, 3rd Year)',
    description:
      'Appeal regarding medical leave rejection for end-semester examinations. Escalated from HOD ET.',
    meta: ['Flexible', '15 mins'],
    actions: [
      { label: 'Decline', variant: 'ghost' },
      { label: 'Delegate to HOD ET', variant: 'outline' },
      { label: 'Approve', variant: 'solid' },
    ],
    accent: 'border-l-amber-400',
  },
  {
    id: 3,
    initials: 'IA',
    title: 'Industry Partnership Discussion',
    tag: null,
    requestedBy: 'Dr. I. Abeykoon (Director, Industry Linkages)',
    description: null,
    meta: ['Next Week'],
    actions: [
      { label: 'Decline', variant: 'ghost' },
      { label: 'Approve', variant: 'solid' },
    ],
    accent: 'border-l-slate-200',
  },
];

const TODAY_SCHEDULE = [
  {
    id: 1,
    time: '09:00 AM - 10:00 AM',
    title: 'Faculty Board Meeting',
    location: 'Board Room',
    status: 'done',
  },
  {
    id: 2,
    time: '10:30 AM - 11:00 AM (Now)',
    title: 'Discussion with HOD IAT',
    location: "Dean's Office",
    status: 'active',
  },
  {
    id: 3,
    time: '01:00 PM - 01:30 PM',
    title: 'Student Representative Council',
    location: 'Online (Zoom)',
    status: 'upcoming',
  },
];

const CALENDAR_DAYS = [
  25, 26, 27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
];
const CALENDAR_START_OFFSET = 0; // Mon 25 is the first cell in this mock month
const TODAY_DATE = 6;

function ActionButton({ label, variant }) {
  const base =
    'text-xs font-medium px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap';

  const styles = {
    ghost: 'text-slate-500 hover:bg-slate-100',
    outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50',
    solid: 'bg-[#071B38] text-white hover:bg-[#0a2549]',
  };

  return <button className={`${base} ${styles[variant]}`}>{label}</button>;
}

export default function DeanMeetingRequests() {
  const [sortBy, setSortBy] = useState('urgency');

  return (
    <div className="flex min-h-screen ">
      {/* Shared sidebar */}
      <Sidenavbar activeItem="meetings" role="Dean" />

      <div className="flex-1 flex flex-col">
        {/* Shared topbar */}
        

        <main className="flex-1 p-8">
          {/* Page header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Dean's Meeting Requests
              </h1>
              <p className="text-sm text-white mt-1">
                Review, approve, and delegate high-level academic
                appointments.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 border border-slate-300 text-slate-700 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-slate-50">
                <Download size={16} />
                Export
              </button>
              <button className="flex items-center gap-2 bg-[#071B38] hover:bg-[#0a2549] text-white text-sm font-medium px-4 py-2.5 rounded-lg">
                <Plus size={16} />
                New Appointment
              </button>
            </div>
          </div>

          {/* Summary row: stat cards + quick filters */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-6">
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-5">
              {SUMMARY_STATS.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.id}
                    className={`rounded-2xl p-5 shadow-sm border backdrop-blur-md ${
  stat.highlight
    ? 'bg-red-100/30 border-white/70'
    : 'bg-white/30 border-white/70'
}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-white">
                        {stat.label}
                      </span>
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${stat.iconBg}`}
                      >
                        <Icon size={16} className={stat.iconColor} />
                      </span>
                    </div>
                    <div className="text-3xl  font-bold text-white mt-3">
                      {stat.value}
                    </div>
                    <div
                      className={`text-xs text-white font-medium mt-2 ${stat.footerColor}`}
                    >
                      {stat.footer}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="
  bg-[#071B38]/55
  backdrop-blur-xl
  border border-white/25
  rounded-2xl
  p-5
  text-white
  shadow-lg
">
              <span className="text-xs font-medium text-slate-300">
                Quick Filters
              </span>
              <div className="flex flex-wrap gap-2 mt-3">
                {QUICK_FILTERS.map((filter) => (
                  <button
                    key={filter}
                    className="text-xs font-medium bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

      {/* Main content: priority requests + calendar/schedule */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Priority Requests */}
  <div className="lg:col-span-2 bg-white/15 backdrop-blur-xl border border-white/30 rounded-xl shadow-sm p-5">
  <div className="flex items-center justify-between mb-4">
    <h2 className="font-semibold text-white tracking-tight">
      Priority Requests
                </h2>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs text-white border border-white/30 rounded-md px-2 py-1"
                >
                  <option value="urgency">Sort by Urgency</option>
                  <option value="date">Sort by Date</option>
                  <option value="requester">Sort by Requester</option>
                </select>
              </div>

              <div className="space-y-4">
                {PRIORITY_REQUESTS.map((req) => (
                  <div
                    key={req.id}
                    className={`border-l-4 ${req.accent} rounded-lg bg-slate-50/60 p-4`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600 shrink-0">
                        {req.initials}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-medium text-[#071B38] text-sm">
                            {req.title}
                          </h3>
                          {req.tag && (
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded ${req.tagColor}`}
                            >
                              {req.tag}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-black mt-1">
                          Requested by {req.requestedBy}
                        </p>

                        {req.description && (
                          <p className="text-sm text-slate-600 mt-2">
                            {req.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-xs text-black mt-2">
                          {req.meta.map((m) => (
                            <span
                              key={m}
                              className="flex items-center gap-1"
                            >
                              <Clock size={12} />
                              {m}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                          {req.actions.map((a) => (
                            <ActionButton
                              key={a.label}
                              label={a.label}
                              variant={a.variant}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full text-center text-sm text-[#071B38] font-medium mt-4 hover:underline">
                View all pending requests &rarr;
              </button>
            </div>

            {/* Calendar + Today's Schedule */}
            <div className="space-y-6 ">
              {/* Calendar */}
             <div className="bg-white/60 backdrop-blur-xl rounded-xl border border-slate-100 shadow-sm p-5">
  <div className="flex items-center justify-between mb-3">
    <h2 className="font-semibold text-[#071B38] text-sm">
      October 2023
                  </h2>
                  <div className="flex items-center gap-1">
                    <button className="p-1 rounded hover:bg-slate-100">
                      <ChevronLeft size={14} />
                    </button>
                    <button className="p-1 rounded hover:bg-slate-100">
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-y-2 text-white text-center text-[11px]">
                  {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
                    <span key={d} className="text-black font-medium">
                      {d}
                    </span>
                  ))}

                  {CALENDAR_DAYS.map((day, idx) => {
                    const isPrevMonth = idx < CALENDAR_START_OFFSET + 6; // 25-30 shown greyed
                    const isToday = day === TODAY_DATE && !isPrevMonth;

                    return (
                      <span
                        key={`${day}-${idx}`}
                        className={`w-6 h-6 mx-auto flex items-center justify-center rounded-full ${
                          isToday
                            ? 'bg-[#071B38] text-white font-semibold'
                            : isPrevMonth
                            ? 'text-slate-300'
                            : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
                        }`}
                      >
                        {day}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Today's Schedule */}
              <div className="bg-white/60 backdrop-blur-xl rounded-xl border border-slate-100 shadow-sm p-5">
                <h2 className="font-semibold text-[#071B38] text-sm mb-4">
                  Today's Schedule
                </h2>

                <div className="space-y-4">
                  {TODAY_SCHEDULE.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <span
                        className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                          item.status === 'done'
                            ? 'bg-emerald-500'
                            : item.status === 'active'
                            ? 'bg-blue-500 animate-pulse'
                            : 'bg-slate-300'
                        }`}
                      />
                      <div>
                        <p className="text-xs text-black">{item.time}</p>
                        <p className="text-sm font-medium text-[#071B38]">
                          {item.title}
                        </p>
                        <p className="text-xs text-black">
                          {item.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}