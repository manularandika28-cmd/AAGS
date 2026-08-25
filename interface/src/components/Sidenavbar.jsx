import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  CalendarDays,
  BriefcaseMedical,
  GraduationCap,
  LogOut
} from 'lucide-react';

const Sidenavbar = () => {
  const navItems = [
    { name: 'DASHBOARD', icon: LayoutGrid, path: '/dashboard' },
    { name: 'MEETING SCHEDULER', icon: CalendarDays, path: '/meeting-scheduler' },
    { name: 'MEDICAL HUB', icon: BriefcaseMedical, path: '/medical-hub' },
    { name: 'ACADEMIC RECORDS', icon: GraduationCap, path: '/academic-records' },
  ];

  return (
    <aside className="w-64 bg-surface-sidebar text-text-inverse flex flex-col justify-between min-h-screen shrink-0 select-none">
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
            <p className="text-caption text-neutral-400 font-light mt-0.5">University of Colombo</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="mt-6 px-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `w-full flex items-center space-x-3 px-4 py-3 rounded-md text-caption font-semibold tracking-wider transition-all duration-150 ${isActive
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

      {/* Logout */}
      <div className="p-4 mb-4">
        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-md text-caption font-semibold tracking-wider text-neutral-300 hover:bg-neutral-800 hover:text-text-inverse transition-colors">
          <LogOut className="w-4 h-4 shrink-0 rotate-180" />
          <span>LOG OUT</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidenavbar;