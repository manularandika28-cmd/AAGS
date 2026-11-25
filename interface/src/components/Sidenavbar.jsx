
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import {
  LayoutGrid,
  Users,
  SlidersHorizontal,
  FileText,
  Settings,
  LogOut,
  GraduationCap,
  CalendarDays,
  BriefcaseMedical,
  Stethoscope,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock,
} from 'lucide-react';

import logo from '../Assets/logo.svg';
import { useAuth } from '../context/AuthContext';
import useTheme from '../hooks/useTheme';

const Sidenavbar = () => {
  const { user, logout } = useAuth();
  const { isLight } = useTheme();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/Login', { replace: true });
  };

  if (!user) return null;

  const roleBasePaths = {
    Student: '/Student',
    HOD: '/hod',
    Admin: '/admin',
    Dean: '/dean',
    Lecturer: '/lecturer',
    'Medical Officer': '/medical-officer',
  };

  const basePath = roleBasePaths[user.role];

  const allNavItems = [
    {
      name: 'DASHBOARD',
      icon: LayoutGrid,
      path: `${basePath}/dashboard`,
      roles: ['Student', 'HOD', 'Admin', 'Dean', 'Lecturer', 'Medical Officer'],
    },
    {
      name: 'MEETING SCHEDULER',
      icon: CalendarDays,
      path: '/Student/meetings',
      roles: ['Student'],
    },
    {
      name: 'MEDICAL HUB',
      icon: BriefcaseMedical,
      path: '/Student/medical',
      roles: ['Student'],
    },
    {
      name: 'ACADEMIC RECORDS',
      icon: GraduationCap,
      path: '/Student/academic-records',
      roles: ['Student'],
    },
    {
      name: 'MEETING REQUESTS',
      icon: CalendarDays,
      path: '/hod/meetings',
      roles: ['HOD'],
    },
    {
      name: 'MEDICAL REVIEW',
      icon: Stethoscope,
      path: '/hod/medical',
      roles: ['HOD'],
    },

    {
  name: 'MEDICAL REVIEWS',
  icon: Stethoscope,
  path: '/medical-officer/medical-reviews',
  roles: ['Medical Officer'],
    },
    
    {
      name: 'USER MANAGEMENT',
      icon: Users,
      path: '/admin/users',
      roles: ['Admin'],
    },
    {
      name: 'PENDING APPROVALS',
      icon: Clock,
      path: '/admin/pending-approvals',
      roles: ['Admin'],
    },
    {
      name: 'ROLE SETTINGS',
      icon: SlidersHorizontal,
      path: '/admin/Roles-And-Permissions',
      roles: ['Admin'],
    },
    {
      name: 'AUDIT LOGS',
      icon: FileText,
      path: '/admin/audit-logs',
      roles: ['Admin'],
    },
    {
      name: 'SYSTEM CONFIGURATION',
      icon: Settings,
      path: '/admin/system-configuration',
      roles: ['Admin'],
    },
    {
      name: 'MEETING REQUESTS',
      icon: BookOpen,
      path: '/dean/meetings',
      roles: ['Dean'],
    },
    {
      name: 'ATTENDANCE MANAGEMENT',
      icon: Users,
      path: '/lecturer/attendance',
      roles: ['Lecturer'],
    },
    {
      name: 'MEETINGS',
      icon: CalendarDays,
      path: '/lecturer/meetings',
      roles: ['Lecturer'],
    },
  ];

  const navItems = allNavItems.filter((item) =>
    item.roles.includes(user.role)
  );


const sidebarTheme = isLight
  ? `
      bg-white/60
      border-white/70
      text-slate-800
      shadow-[0_12px_40px_rgba(15,23,42,0.08)]
    `
  : `
      bg-[rgba(30,41,59,0.58)]
      border-white/10
      text-white
      shadow-[0_12px_40px_rgba(0,0,0,0.25)]
    `;


  const mutedText = isLight
    ? 'text-slate-500'
    : 'text-white/55';

  const dividerColor = isLight
    ? 'border-slate-200'
    : 'border-white/10';

  const navInactive = isLight
    ? 'text-slate-600 hover:bg-slate-100 hover:text-[#0A192F]'
    : 'text-white/65 hover:bg-white/10 hover:text-white';

  const collapseButton = isLight
    ? 'text-slate-500 hover:text-[#0A192F] hover:bg-slate-100'
    : 'text-white/65 hover:text-white hover:bg-white/10';

  return (
    <aside
  className={`
    shrink-0
    self-stretch
    py-3
    pl-3
    transition-all duration-300 ease-in-out
    ${collapsed ? 'w-[96px]' : 'w-[288px]'}
  `}
>
  <div
    className={`
      flex flex-col
      rounded-[18px]
      border
      backdrop-blur-2xl
      backdrop-saturate-150
      overflow-hidden
      transition-all duration-300
      h-[calc(100vh-24px)]
      sticky top-3
      ${collapsed ? 'w-[76px]' : 'w-[260px]'}
      ${sidebarTheme}
    `}
  >

        {/* BRAND HEADER */}
        <div
          className={`
           h-[82px]
${collapsed ? 'px-0 justify-center' : 'px-4'}
flex items-center
            ${dividerColor}
            border-b
          `}
        >
          <div
            className="
              w-10 h-10
              rounded-xl
              bg-white/80
              border border-slate-200/70
              flex items-center justify-center
              shrink-0
            "
          >
            <img
              src={logo}
              alt="University Logo"
              className="w-8 h-8 object-contain"
            />
          </div>

          {!collapsed && (
            <>
              <div className="ml-3 min-w-0 flex-1">
                <h2
                  className={`
                    text-[13px]
                    font-bold
                    tracking-tight
                    leading-tight
                    whitespace-nowrap
                    ${isLight ? 'text-[#0A192F]' : 'text-white'}
                  `}
                >
                  Faculty of Technology
                </h2>

                <p className={`text-[10px] mt-1 whitespace-nowrap ${mutedText}`}>
                  University of Colombo
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCollapsed(true)}
                aria-label="Collapse sidebar"
                className={`
                  ml-1 w-7 h-7 shrink-0
                  rounded-lg
                  flex items-center justify-center
                  transition-colors
                  ${collapseButton}
                `}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </>
          )}

          
        </div>

        {/* USER INFORMATION */}
        <div className={`${collapsed ? 'px-1' : 'px-5'} py-4 border-b ${dividerColor}`}>
          {!collapsed ? (
            <>
              <p
                className={`
                  text-xs font-bold truncate
                  ${isLight ? 'text-slate-800' : 'text-white'}
                `}
              >
                {user.name}
              </p>

              <p
                className={`
                  text-[10px]
                  mt-1
                  uppercase
                  tracking-[0.15em]
                  font-semibold
                  ${mutedText}
                `}
              >
                {user.role}
              </p>
            </>
          ) : (
  <div className="flex items-center justify-center gap-1">
    <div
      className={`
        w-8 h-8
        rounded-full
        flex items-center justify-center
        text-xs font-bold shrink-0
        ${isLight
          ? 'bg-slate-100 text-[#0A192F]'
          : 'bg-white/10 text-white'}
      `}
      title={`${user.name} — ${user.role}`}
    >
      {user.name?.charAt(0)?.toUpperCase()}
    </div>

    <button
      type="button"
      onClick={() => setCollapsed(false)}
      aria-label="Expand sidebar"
      title="Expand sidebar"
      className={`
        w-7 h-7 shrink-0
        rounded-lg
        flex items-center justify-center
        transition-colors
        ${collapseButton}
      `}
    >
      <ChevronRight className="w-4 h-4" />
    </button>
  </div>
)}
        </div>

        {/* NAVIGATION */}
        <nav className="mt-6 px-2.5 flex-1 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={`${item.name}-${item.path}`}
                to={item.path}
                title={collapsed ? item.name : undefined}
                className={({ isActive }) => `
                  group
                  w-full
                  flex items-center
                  ${collapsed ? 'justify-center px-2' : 'px-3'}
                  py-3
                  rounded-[18px]
                  text-[11px]
                  font-bold
                  tracking-wide
                  whitespace-nowrap
                  transition-all duration-200
                  ${
                    isActive
                      ? 'bg-brand-orange-500 text-white shadow-md shadow-orange-500/20'
                      : navInactive
                  }
                  hover:translate-x-[2px]
                `}
              >
                <Icon
                  className={`
                    w-[18px] h-[18px]
                    shrink-0
                    transition-transform duration-200
                    group-hover:scale-110
                  `}
                />

                {!collapsed && (
                  <span className="ml-3 truncate">
                    {item.name}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className={`p-3 mt-auto border-t ${dividerColor}`}>
          <button
            type="button"
            onClick={handleLogout}
            title={collapsed ? 'Log out' : undefined}
            className={`
              w-full
              flex items-center
              ${collapsed ? 'justify-center px-2' : 'px-3'}
              py-3
              rounded-xl
              text-[11px]
              font-bold
              tracking-wide
              transition-all duration-200
              ${
                isLight
                  ? 'text-rose-600 hover:bg-rose-50'
                  : 'text-rose-300 hover:bg-rose-500/15 hover:text-rose-200'
              }
            `}
          >
            <LogOut className="w-[18px] h-[18px] shrink-0 rotate-180" />

            {!collapsed && (
              <span className="ml-3">Log Out</span>
            )}
          </button>
        </div>

      </div>
    </aside>
  );
};

export default Sidenavbar;
