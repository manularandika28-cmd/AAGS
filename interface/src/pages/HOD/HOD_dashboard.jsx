import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarDays, 
  FilePlus2, 
  LogOut, 
  Bell, 
  HelpCircle, 
  Settings 
} from 'lucide-react';

export default function Layout({ children }) {
  const navLinks = [
    { to: '/', label: 'DASHBOARD', icon: LayoutDashboard },
    { to: '/meetings', label: 'MEETING REQUESTS', icon: CalendarDays },
    { to: '/medical-review', label: 'MEDICAL REVIEW', icon: FilePlus2 },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0d2137] text-slate-300 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Faculty Header */}
          <div className="p-6 flex items-center gap-3 border-b border-slate-800">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-700 font-bold overflow-hidden shadow-inner">
              <span className="text-center leading-tight">UOC</span>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-wide leading-snug">
                Faculty of<br />Technology
              </h2>
              <p className="text-[10px] text-slate-400">UNIVERSITY OF COLOMBO</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-4">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-6 py-3.5 text-xs font-semibold tracking-wider transition-colors ${
                      isActive
                        ? 'bg-rose-500/90 text-white border-l-4 border-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Log Out */}
        <div className="p-6 border-t border-slate-800">
          <button className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" />
            LOG OUT
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-base font-semibold text-slate-800">AAGS Faculty System</h1>
          <div className="flex items-center gap-5">
            <button className="relative text-slate-500 hover:text-slate-700">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
            <button className="text-slate-500 hover:text-slate-700">
              <HelpCircle className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900">
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-300 overflow-hidden border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                alt="User Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* Dynamic Body */}
        <main className="p-8 flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}