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
} from 'lucide-react';

import logo from '../Assets/logo.svg';
import { useAuth } from '../context/AuthContext';

const Sidenavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/Login', { replace: true });
  };

  if (!user) {
    return null;
  }

  const roleBasePaths = {
    Student: '/Student',
    HOD: '/hod',
    Admin: '/admin',
    Dean: '/dean',
    Lecturer: '/lecturer',
  };

  const basePath = roleBasePaths[user.role];

  const allNavItems = [
    {
      name: 'DASHBOARD',
      icon: LayoutGrid,
      path: `${basePath}/dashboard`,
      roles: ['Student', 'HOD', 'Admin', 'Dean', 'Lecturer'],
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

  return (
    <aside
      className={`
        shrink-0
          self-stretch
        ${collapsed ? 'w-[80px]' : 'w-[272px]'}
      `}
    >
      {collapsed ? (
        /* =========================
           COLLAPSED SIDEBAR
        ========================== */
        <div
          className="
            w-[80px]
            pt-[9px]
            flex
            justify-center
          "
        >
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            aria-label="Expand sidebar"
            className="
              w-16
              h-16
              flex
              items-center
              justify-center
              rounded-xl
              bg-white/10
              backdrop-blur-xl
              border
              border-white/20
              text-white/80
              hover:text-white
              hover:bg-white/20
              shadow-lg
              transition-colors
            "
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      ) : (
        /* =========================
           EXPANDED SIDEBAR
        ========================== */
        <div
          className="
            w-64
            min-w-64
            bg-white/10
            backdrop-blur-xl
            border
            border-white/20
            text-white
            flex
            flex-col
            justify-between
            min-h-[calc(100vh-2rem)]
            select-none
            rounded-xl
            mt-[9px]
            mr-4
            mb-8
            ml-4
            shadow-lg
            overflow-hidden
          "
        >
          {/* BRAND HEADER */}
          <div
            className="
              h-[82px]
              px-4
              flex
              items-center
              border-b
              border-white/15
            "
          >
            {/* LOGO */}
            <div
              className="
                w-10
                h-10
                rounded-full
                bg-white/20
                flex
                items-center
                justify-center
                shrink-0
              "
            >
              <img
                src={logo}
                alt="University Logo"
                className="w-8 h-8"
              />
            </div>

            {/* BRAND TEXT */}
            <div className="ml-3 min-w-0 flex-1">
              <h2
                className="
                  text-[14px]
                  font-bold
                  tracking-tight
                  text-white
                  leading-tight
                  whitespace-nowrap
                "
              >
                Faculty of Technology
              </h2>

              <p
                className="
                  text-[10px]
                  text-white/60
                  font-light
                  mt-1
                  whitespace-nowrap
                "
              >
                University of Colombo
              </p>
            </div>

            {/* COLLAPSE BUTTON */}
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              aria-label="Collapse sidebar"
              className="
                ml-2
                w-7
                h-7
                shrink-0
                flex
                items-center
                justify-center
                rounded-md
                text-white/70
                hover:text-white
                hover:bg-white/10
                transition-colors
              "
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* USER INFO */}
          <div className="px-5 py-4 border-b border-white/15">
            <p className="text-xs font-semibold text-white truncate">
              {user.name}
            </p>

            <p
              className="
                text-[10px]
                text-white/60
                mt-1
                uppercase
                tracking-wider
                truncate
              "
            >
              {user.role}
            </p>
          </div>

          {/* NAVIGATION */}
          <nav className="mt-6 px-3 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={`${item.name}-${item.path}`}
                  to={item.path}
                  className={({ isActive }) =>
                    `
                      w-full
                      flex
                      items-center
                      space-x-3
                      px-4
                      py-3
                      rounded-md
                      text-caption
                      font-semibold
                      tracking-wider
                      whitespace-nowrap
                      transition-colors
                      ${
                        isActive
                          ? 'bg-brand-orange-500 text-white shadow-sm'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }
                    `
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />

                  <span className="whitespace-nowrap">
                    {item.name}
                  </span>
                </NavLink>
              );
            })}
          </nav>

          {/* LOGOUT */}
          <div className="p-4 mb-4 mt-auto">
            <button
              type="button"
              onClick={handleLogout}
              className="
                w-full
                flex
                items-center
                space-x-3
                px-4
                py-3
                rounded-md
                text-caption
                font-semibold
                tracking-wider
                text-white/70
                hover:bg-red-500/20
                hover:text-white
                transition-colors
              "
            >
              <LogOut className="w-4 h-4 shrink-0 rotate-180" />

              <span className="whitespace-nowrap">
                LOG OUT
              </span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidenavbar;