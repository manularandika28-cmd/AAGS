
import React from 'react';
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
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const Sidenavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/Login', { replace: true });
  };

  if (!user) {
    return null;
  }

  // Get the correct base URL for each role
  const roleBasePaths = {
    Student: '/Student',
    HOD: '/hod',
    Admin: '/admin',
    Dean: '/dean',
    Lecturer: '/lecturer',
  };

  const basePath = roleBasePaths[user.role];

  // All navigation items
  const allNavItems = [
    // =========================
    // DASHBOARD
    // =========================
    {
      name: 'DASHBOARD',
      icon: LayoutGrid,
      path: `${basePath}/dashboard`,
      roles: ['Student', 'HOD', 'Admin', 'Dean', 'Lecturer'],
    },

    // =========================
    // STUDENT
    // =========================
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

    // =========================
    // HOD
    // =========================
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

    // =========================
    // ADMIN
    // =========================
    {
      name: 'USER MANAGEMENT',
      icon: Users,
      path: '/admin/users',
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

    // =========================
    // DEAN
    // =========================
    {
      name: 'ACADEMIC OVERVIEW',
      icon: BookOpen,
      path: '/dean/academic-overview',
      roles: ['Dean'],
    },

    // =========================
    // LECTURER
    // =========================
    {
      name: 'STUDENTS',
      icon: Users,
      path: '/lecturer/students',
      roles: ['Lecturer'],
    },
    {
      name: 'MEETINGS',
      icon: CalendarDays,
      path: '/lecturer/meetings',
      roles: ['Lecturer'],
    },
  ];

  // Only show navigation items allowed for the current role
  const navItems = allNavItems.filter((item) =>
    item.roles.includes(user.role)
  );

  return (
    <aside className="w-64 bg-black/30 text-white flex flex-col justify-between min-h-[calc(100vh-2rem)] shrink-0 select-none rounded-xl mt-[9px] mr-4 mb-8 ml-4">

      {/* =========================
          TOP SECTION
      ========================= */}
      <div>

        {/* Brand Header */}
        <div className="p-6 flex items-center space-x-3 border-b border-neutral-800">

          <div className="w-10 h-10 rounded-full bg-brand-navy-50 flex items-center justify-center text-brand-navy-800 shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-body font-bold tracking-tight text-text-inverse leading-loose">
              Faculty of Technology
            </h2>

            <p className="text-caption text-neutral-400 font-light mt-0.5">
              University of Colombo
            </p>
          </div>

        </div>

        {/* User Info */}
        <div className="px-5 py-4 border-b border-neutral-800">

          <p className="text-xs font-semibold text-white truncate">
            {user.name}
          </p>

          <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-wider">
            {user.role}
          </p>

        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 space-y-1.5">

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={`${item.name}-${item.path}`}
                to={item.path}
                className={({ isActive }) =>
                  `w-full flex items-center space-x-3 px-4 py-3 rounded-md text-caption font-semibold tracking-wider transition-all duration-150 ${
                    isActive
                      ? 'bg-brand-orange-500 text-text-inverse shadow-sm'
                      : 'text-neutral-300 hover:bg-neutral-800 hover:text-text-inverse'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}

        </nav>

      </div>

      {/* =========================
          LOGOUT
      ========================= */}
      <div className="p-4 mb-4">

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-md text-caption font-semibold tracking-wider text-neutral-300 hover:bg-red-900/40 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0 rotate-180" />
          <span>LOG OUT</span>
        </button>

      </div>

    </aside>
  );
};

export default Sidenavbar;

