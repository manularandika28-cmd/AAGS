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

  /*
  |--------------------------------------------------------------------------
  | Navigation items by role
  |--------------------------------------------------------------------------
  */
  const roleNavigation = {
    Student: [
      { name: 'DASHBOARD', icon: LayoutGrid, path: '/Student/dashboard' },
      { name: 'MEETING SCHEDULER', icon: CalendarDays, path: '/Student/meetings' },
      { name: 'MEDICAL HUB', icon: BriefcaseMedical, path: '/Student/medical' },
      { name: 'ACADEMIC RECORDS', icon: GraduationCap, path: '/Student/academic-records' },
    ],

    HOD: [
      { name: 'DASHBOARD', icon: LayoutGrid, path: '/hod/dashboard' },
      { name: 'MEETING REQUESTS', icon: CalendarDays, path: '/hod/meetings' },
      { name: 'MEDICAL REVIEW', icon: Stethoscope, path: '/hod/medical' },
    ],

    Admin: [
      { name: 'DASHBOARD', icon: LayoutGrid, path: '/admin/dashboard' },
      { name: 'USER MANAGEMENT', icon: Users, path: '/admin/users' },
      { name: 'ROLE SETTINGS', icon: SlidersHorizontal, path: '/admin/Roles-And-Permissions' },
      { name: 'AUDIT LOGS', icon: FileText, path: '/admin/audit-logs' },
      { name: 'SYSTEM CONFIGURATION', icon: Settings, path: '/admin/system-configuration' },
    ],

    Dean: [
      { name: 'DASHBOARD', icon: LayoutGrid, path: '/dean/dashboard' },
      { name: 'USER MANAGEMENT', icon: Users, path: '/dean/users' },
      { name: 'ACADEMIC OVERVIEW', icon: BookOpen, path: '/dean/academic-overview' },
    ],

    Lecturer: [
      { name: 'DASHBOARD', icon: LayoutGrid, path: '/lecturer/dashboard' },
      { name: 'STUDENTS', icon: Users, path: '/lecturer/students' },
      { name: 'MEETINGS', icon: CalendarDays, path: '/lecturer/meetings' },
      { name: 'ACADEMIC RECORDS', icon: BookOpen, path: '/lecturer/academic-records' },
    ],
  };

  const navItems = roleNavigation[user?.role] || [];

  if (!user) {
    return null;
  }

  return (
    <aside className="w-64 bg-[black]/30 text-white flex flex-col justify-between min-h-[calc(100vh-2rem)] shrink-0 select-none rounded-xl my-4 ml-4">

      {/* TOP SECTION */}
      <div>
        {/* Brand Header */}
        <div className="p-6 flex items-center space-x-3 border-b border-neutral-800">
          <div className="w-10 h-10 rounded-full bg-brand-navy-50 flex items-center justify-center text-brand-navy-800 shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-body font-bold tracking-tight text-text-inverse leading-tight">
              Faculty of<br />Technology
            </h2>
            <p className="text-caption text-neutral-400 font-light mt-0.5">
              University of Colombo
            </p>
          </div>
        </div>

        {/* User info */}
        <div className="px-5 py-4 border-b border-neutral-800">
          <p className="text-xs font-semibold text-white truncate">{user.name}</p>
          <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-wider">{user.role}</p>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.name === 'DASHBOARD'}
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

      {/* LOGOUT */}
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